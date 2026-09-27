import json,re,html,sys,datetime,subprocess
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
city,lat,lon,radius=sys.argv[1],sys.argv[2],sys.argv[3],sys.argv[4]
STATE=sys.argv[5] if len(sys.argv)>5 else 'FL'
raw=subprocess.run(['curl','-s','-m','60',f'https://www.toastmasters.org/api/sitecore/FindAClub/Search?latitude={lat}&longitude={lon}&radius={radius}','-H','User-Agent: Mozilla/5.0','-H','X-Requested-With: XMLHttpRequest'],capture_output=True,text=True).stdout
d=json.loads(raw)['Clubs']
json.dump(d,open(f'{city.lower()}_raw.json','w'))
DAYS=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
rows=[]
for x in d:
    a=x['Address']; ctry=(x.get('CountryName') or '')
    if ctry and ctry!='United States': continue
    if (a.get('PrimaryRegion') or {}).get('Value') not in (STATE,None,''): continue
    cty=(a['City'] or '').strip()
    num=x['Identification']['Id']['Value']
    day=(x['MeetingDay'] or '').strip(); tm=(x['MeetingTime'] or '').strip()
    both=day+' '+tm
    di=next((i for i,n in enumerate(DAYS) if re.search(r'\b'+n[:3]+r'(?!th)\w*',day,re.I)),None)
    if di is None: di=next((i for i,n in enumerate(DAYS) if re.search(r'\b'+n[:3]+r'(?!th)\w*',tm,re.I)),None)
    m=re.search(r'(\d{1,2})(?::(\d{2}))?',tm); start=None
    if m:
        h=int(m.group(1)); mi=int(m.group(2) or 0)
        after=tm[m.end():m.end()+12].lower(); allap=re.findall(r'(a\.?m|p\.?m|noon)',tm.lower())
        ap=re.match(r'\s*(a\.?m|p\.?m|noon|a\b|p\b)',after); ap=ap.group(1) if ap else (allap[0] if allap else '')
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
      restricted=x['Restriction']!=[] or bool(re.search(r'employee|closed|not open',low+' '+tm.lower())),forming=bool(x['IsProspective']),
      spanish=bool(re.search(r'español|espanol|hispan|latino|l[ií]deres|habla|bilingüe|bilingue|bilingual|spanish',x['Identification']['Name']+' '+(x['Location'] or ''),re.I)),
      miles=round(x['Distance'],1),finder=f"https://www.toastmasters.org/Find-a-Club/{num}-{num}"))
json.dump(rows,open(f'{city.lower()}_clubs.json','w'),indent=1)
print(len(d),len(rows))
