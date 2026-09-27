import json,re,html,sys,datetime,subprocess
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
city,lat,lon,radius=sys.argv[1],sys.argv[2],sys.argv[3],sys.argv[4]
raw=subprocess.run(['curl','-s','-m','60',f'https://www.toastmasters.org/api/sitecore/FindAClub/Search?latitude={lat}&longitude={lon}&radius={radius}','-H','User-Agent: Mozilla/5.0','-H','X-Requested-With: XMLHttpRequest'],capture_output=True,text=True).stdout
d=json.loads(raw)['Clubs']
json.dump(d,open(f'{city.lower()}_raw.json','w'))
DAYS=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
rows=[]
for x in d:
    a=x['Address']; ctry=(x.get('CountryName') or '')
    if ctry and ctry!='United States': continue
    if (a.get('PrimaryRegion') or {}).get('Value') not in ('FL',None,''): continue
    cty=(a['City'] or '').strip()
    num=x['Identification']['Id']['Value']
    day=(x['MeetingDay'] or '').strip(); tm=(x['MeetingTime'] or '').strip()
    di=next((i for i,n in enumerate(DAYS) if re.search(r'\b'+n,day,re.I) or re.search(r'\b'+n[:3]+r'\b',day,re.I)),None)
    m=re.search(r'(\d{1,2})(?::(\d{2}))?',tm); start=None
    if m:
        h=int(m.group(1)); mi=int(m.group(2) or 0)
        after=tm[m.end():m.end()+12].lower(); allap=re.findall(r'(a\.?m|p\.?m|noon)',tm.lower())
        ap=re.match(r'\s*(a\.?m|p\.?m|noon)',after); ap=ap.group(1) if ap else (allap[0] if allap else '')
        if ap.startswith('p') or ap=='noon':
            if h!=12: h+=12
        elif ap.startswith('a') and h==12: h=0
        elif not ap and 1<=h<=6: h+=12
        start=h*60+mi
    low=day.lower()
    norm=re.sub(r'(\d)\s+(st|nd|rd|th)',r'\1\2',low)
    for w,n in (('first','1st'),('second','2nd'),('third','3rd'),('fourth','4th'),('fifth','5th')): norm=re.sub(r'\b'+w+r'\b',n,norm)
    ords=re.findall(r'(1st|2nd|3rd|4th|5th)',norm)
    if 'except' in norm and ords:
        freq='Every '+(DAYS[di] if di is not None else '')+' except '+' & '.join(ords)
    elif re.search(r'tue\w* and thu',norm):
        freq='Tuesdays & Thursdays'
    elif ords: freq=' & '.join(ords)+' '+(DAYS[di] if di is not None else '')+' of month'
    elif 'last' in low: freq='Last '+(DAYS[di] if di is not None else '')+' of month'
    elif re.search(r'every other|biweekly|alternate',low): freq='Every other week'
    elif day: freq='Weekly'
    else: freq=''
    rows.append(dict(name=x['Identification']['Name'].strip(),number=x['Identification']['Id']['DisplayFriendlyFormat'],
      city=('Online' if cty.upper()=='N/A' else ('Pembroke Pines' if '@' in cty else cty.title())),dayText=day,timeText=tm,dayIdx=di,start=start,freq=freq,
      location=html.unescape(re.sub(r'<br\s*/?>',' · ',x['Location'] or '')).strip(),
      street=' '.join(filter(None,[a['Street'],a['PostalCode']])) if cty.upper()!='N/A' else '',
      online=bool(x['AllowsVirtualAttendance']),email=x['Email'] or '',phone=x['Phone'] or '',website=x['Website'] or '',facebook=x['FacebookLink'] or '',
      restricted=x['Restriction']!=[] or 'employee' in low,forming=bool(x['IsProspective']),
      spanish=bool(re.search(r'español|espanol|hispan|latino|l[ií]deres|habla|bilingüe|bilingue|bilingual|spanish',x['Identification']['Name']+' '+(x['Location'] or ''),re.I)),
      miles=round(x['Distance'],1),finder=f"https://www.toastmasters.org/Find-a-Club/{num}-{num}"))
json.dump(rows,open(f'{city.lower()}_clubs.json','w'),indent=1)
# xlsx
BROWARD={'Fort Lauderdale','Miramar','Hollywood','Weston','Sunrise','Pembroke Pines','Davie','Plantation','Wilton Mannors','Wilton Manors','Lauderdale Lakes','Southwest Ranches','Weston, Miramar, Pembroke Pines','Cooper City','Coral Springs','Pompano Beach','Tamarac','Lauderhill','Dania Beach','Hallandale Beach','Margate','Deerfield Beach','Oakland Park'}
def county(c):
    if city!='Miami': return ''
    return 'Broward' if c['city'] in BROWARD else ('Online' if c['city']=='Online' else 'Miami-Dade')
ph=lambda p: f"({p[2:5]}) {p[5:8]}-{p[8:12]}" if p and p.startswith('+1') and len(p)==12 else (p or '')
wb=Workbook(); ws=wb.active; ws.title='Weekly Schedule'; F='Arial'
hf=PatternFill('solid',fgColor='0C6A5D'); band=PatternFill('solid',fgColor='F1F5F3'); thin=Side(style='thin',color='D5DDDA')
hdr=['Day','Start time','Club','Club #','City','County','Online attendance','How often','Notes','Contact email','Phone','Meeting place','Website','Toastmasters page','Miles from downtown','Day/time as listed']
ws.append(hdr)
for c in sorted(rows,key=lambda c:(c['dayIdx'] if c['dayIdx'] is not None else 9,c['start'] if c['start'] is not None else 9999)):
    notes=[n for n,f in (('Membership may be restricted',c['restricted']),('Still forming',c['forming']),('Spanish / bilingual',c['spanish'])) if f]
    t=datetime.time(c['start']//60%24,c['start']%60) if c['start'] is not None else None
    ws.append([DAYS[c['dayIdx']] if c['dayIdx'] is not None else 'Not listed',t,c['name'],c['number'],c['city'],county(c),'Yes' if c['online'] else 'No (in person)',c['freq'],'; '.join(notes),c['email'],ph(c['phone']),' '.join(filter(None,[c['location'],c['street']])),c['website'],c['finder'],c['miles'],' · '.join(filter(None,[c['dayText'],c['timeText']]))])
for cl in ws[1]: cl.font=Font(name=F,bold=True,color='FFFFFF'); cl.fill=hf; cl.alignment=Alignment(vertical='center',wrap_text=True)
prev=None; sh=False
for r in range(2,ws.max_row+1):
    if ws.cell(r,1).value!=prev: sh=not sh; prev=ws.cell(r,1).value
    for col in range(1,len(hdr)+1):
        cl=ws.cell(r,col); cl.font=Font(name=F,size=10,bold=col in (1,3)); cl.alignment=Alignment(vertical='top',wrap_text=col in (3,9,12,16)); cl.border=Border(bottom=thin)
        if sh: cl.fill=band
    ws.cell(r,2).number_format='h:mm AM/PM'; ws.cell(r,15).number_format='0.0'
    for col in (13,14):
        v=ws.cell(r,col).value
        if v: ws.cell(r,col).hyperlink=v; ws.cell(r,col).font=Font(name=F,size=10,color='0563C1',underline='single')
for i,w in enumerate([12,11,34,10,18,12,15,26,26,34,15,40,34,34,10,30],1): ws.column_dimensions[get_column_letter(i)].width=w
ws.freeze_panes='C2'; ws.auto_filter.ref=f"A1:{get_column_letter(len(hdr))}{ws.max_row}"; ws.row_dimensions[1].height=30
n=wb.create_sheet('Notes')
for i,l in enumerate([f'{city} Toastmasters Clubs',
 f'{len(rows)} clubs within {radius} miles of downtown {city}, sorted by day and start time. All times are local Eastern Time.',
 'Source: Toastmasters International Find a Club (toastmasters.org/find-a-club), pulled '+datetime.date.today().strftime('%B %d, %Y')+'.',
 'Use the filter arrows in row 1 to show one day, online-only clubs, etc.',
 '"How often": monthly clubs such as "2nd & 4th Tuesday of month" meet only in those weeks. The last column shows the day/time exactly as the club lists it.',
 '"Membership may be restricted" usually means a company or government club. Guests are often welcome, but call first.',
 'Contact email and phone are the ones each club publishes in the Toastmasters directory; they can go stale, so confirm before driving over.',
 f'Miles = straight-line distance from downtown {city}.'],1):
    n.cell(i,1,l).font=Font(name=F,size=14 if i==1 else 10,bold=i==1)
n.column_dimensions['A'].width=120
out=f'/home/claude/toastmasters/docs/{city}-Toastmasters-Clubs.xlsx'; wb.save(out)
print(len(d),len(rows),out)
