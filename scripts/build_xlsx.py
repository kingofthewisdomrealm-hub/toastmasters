import json,sys,datetime,re
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
city,radius=sys.argv[1],sys.argv[2]
TZ=sys.argv[3] if len(sys.argv)>3 else 'ET'
OFF={'ET':0,'CT':1,'MT':2,'PT':3,'MXC':2}[TZ]
OFF2=1 if TZ=='MXC' else None
SHOWCOUNTY=(city=='Miami')
rows=json.load(open(f'{city.lower()}_clubs.json'))
HASWA=any(c.get('wa') for c in rows)
DAYS=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
for c in rows: c.setdefault('dayText',c.get('day','')); c.setdefault('timeText',c.get('time','')); c.setdefault('zoomLink',''); c.setdefault('zoomId',''); c.setdefault('zoomPass',''); c.setdefault('zoomHow','')
BROWARD={'Fort Lauderdale','Miramar','Hollywood','Weston','Sunrise','Pembroke Pines','Davie','Plantation','Wilton Mannors','Wilton Manors','Lauderdale Lakes','Southwest Ranches','Weston, Miramar, Pembroke Pines','Cooper City','Coral Springs','Pompano Beach','Tamarac','Lauderhill','Dania Beach','Hallandale Beach','Margate','Deerfield Beach','Oakland Park'}
def county(c):
    if city!='Miami': return ''
    return 'Broward' if c['city'] in BROWARD else ('Online' if c['city']=='Online' else 'Miami-Dade')
ph=lambda p: f"({p[2:5]}) {p[5:8]}-{p[8:12]}" if p and p.startswith('+1') and len(p)==12 else (f"+52 {p[3:5]} {p[5:9]} {p[9:]}" if p and p.startswith('+52') and len(p)==13 else (p or ''))
wb=Workbook(); ws=wb.active; ws.title='Weekly Schedule'; F='Arial'
hf=PatternFill('solid',fgColor='0C6A5D'); band=PatternFill('solid',fgColor='F1F5F3'); thin=Side(style='thin',color='D5DDDA')
hdr=['Day',('Start time' if TZ=='ET' else ('Start time (Mexico City, local)' if TZ=='MXC' else f'Start time ({TZ}, local)'))]+([] if TZ=='ET' else (['Your time (Eastern) until Nov 1','Your time (Eastern) Nov 1 – Mar 14'] if OFF2 else ['Your time (Eastern)']))+['Club','Club #','City']+(['County'] if SHOWCOUNTY else [])+['Online attendance','How often','Notes','Contact email','Phone','Meeting place','Website','Toastmasters page','Miles from downtown','Day/time as listed','Zoom link','Zoom meeting ID','Zoom passcode','How to get in online']+(['WhatsApp chat link'] if HASWA else [])
ws.append(hdr)
for c in sorted(rows,key=lambda c:(c['dayIdx'] if c['dayIdx'] is not None else 9,c['start'] if c['start'] is not None else 9999)):
    notes=[n for n,f in (('Membership may be restricted',c['restricted']),('Still forming',c['forming']),('Spanish / bilingual',c['spanish'])) if f]
    t=datetime.time(c['start']//60%24,c['start']%60) if c['start'] is not None else None
    et=(datetime.time((c['start']//60+OFF)%24,c['start']%60) if c['start'] is not None else None)
    etday=('' if c['start'] is None or c['dayIdx'] is None else ('' if c['start']//60+OFF<24 else ' (next day)'))
    ws.append([DAYS[c['dayIdx']] if c['dayIdx'] is not None else 'Not listed',t]+([] if TZ=='ET' else ([(et.strftime('%-I:%M %p')+etday) if et else None]+([ (datetime.time((c['start']//60+OFF2)%24,c['start']%60).strftime('%-I:%M %p')) if c['start'] is not None else None] if OFF2 else [])))+[c['name'],c['number'],c['city']]+([county(c)] if SHOWCOUNTY else [])+['Yes' if c['online'] else 'No (in person)',c['freq'],'; '.join(notes),c['email'],ph(c['phone']),' '.join(filter(None,[c['location'],c['street']])),c['website'],c['finder'],c['miles'],' · '.join(filter(None,[c['dayText'],c['timeText']])),c['zoomLink'],c['zoomId'],c['zoomPass'],(c['zoomHow'] or (('Posted in '+c['zoomSource'].lower()) if (c['zoomLink'] or c['zoomId']) else (('Ask the club for the link (WhatsApp or email in this row)' if HASWA else 'Ask the club for the link (email in this row)') if c['online'] else 'In person only')))]+([c.get('wa') or c.get('waNote','')] if HASWA else []))
for cl in ws[1]: cl.font=Font(name=F,bold=True,color='FFFFFF'); cl.fill=hf; cl.alignment=Alignment(vertical='center',wrap_text=True)
prev=None; sh=False
H={h:i+1 for i,h in enumerate(hdr)}
BOLD={H['Day'],H['Club']}; WRAP={H[k] for k in ('Club','Notes','Meeting place','Day/time as listed','How to get in online')}
LINKS={H[k] for k in ('Website','Toastmasters page','Zoom link','WhatsApp chat link') if k in H}
WID={'Day':12,'Club':34,'Club #':10,'City':18,'County':12,'Online attendance':15,'How often':26,'Notes':26,'Contact email':34,'Phone':15,'Meeting place':40,'Website':34,'Toastmasters page':34,'Miles from downtown':10,'Day/time as listed':30,'Zoom link':40,'Zoom meeting ID':16,'Zoom passcode':12,'How to get in online':36,'Your time (Eastern)':16,'Your time (Eastern) until Nov 1':16,'Your time (Eastern) Nov 1 – Mar 14':16,'WhatsApp chat link':30}
for r in range(2,ws.max_row+1):
    if ws.cell(r,1).value!=prev: sh=not sh; prev=ws.cell(r,1).value
    for col in range(1,len(hdr)+1):
        cl=ws.cell(r,col); cl.font=Font(name=F,size=10,bold=col in BOLD); cl.alignment=Alignment(vertical='top',wrap_text=col in WRAP); cl.border=Border(bottom=thin)
        if sh: cl.fill=band
    ws.cell(r,2).number_format='h:mm AM/PM'; ws.cell(r,H['Miles from downtown']).number_format='0.0'
    for col in LINKS:
        v=ws.cell(r,col).value
        if v: ws.cell(r,col).hyperlink=v; ws.cell(r,col).font=Font(name=F,size=10,color='0563C1',underline='single')
for h,i in H.items(): ws.column_dimensions[get_column_letter(i)].width=WID.get(h,14)
ws.cell(1,2).value=hdr[1]
ws.freeze_panes=get_column_letter(H['Club']+1)+'2'; ws.auto_filter.ref=f"A1:{get_column_letter(len(hdr))}{ws.max_row}"; ws.row_dimensions[1].height=30
n=wb.create_sheet('Notes')
for i,l in enumerate([f'{city} Toastmasters Clubs',
 f'{len(rows)} clubs within {radius} miles of downtown {city}, sorted by day and start time. '+('All times are local Eastern Time.' if TZ=='ET' else 'Mexico City does not change its clocks. It is 2 hours behind Florida until the US falls back on Nov 1, 2026, then 1 hour behind until Mar 14, 2027. Both columns are shown.' if TZ=='MXC' else f'Start times are local {TZ}; the "Your time (Eastern)" column converts them to Florida time.'),
 'Source: Toastmasters International Find a Club (toastmasters.org/find-a-club), pulled '+datetime.date.today().strftime('%B %d, %Y')+'.',
 'Use the filter arrows in row 1 to show one day, online-only clubs, etc.','Zoom columns: filled only when the club posts its link publicly (in the Toastmasters directory or on its own website). Most clubs email the link to guests instead.',
 '"How often": monthly clubs such as "2nd & 4th Tuesday of month" meet only in those weeks. The last column shows the day/time exactly as the club lists it.',
 '"Membership may be restricted" usually means a company or government club. Guests are often welcome, but call first.',
 'Contact email and phone are the ones each club publishes in the Toastmasters directory; they can go stale, so confirm before driving over.',
 f'Miles = straight-line distance from downtown {city}.'],1):
    n.cell(i,1,l).font=Font(name=F,size=14 if i==1 else 10,bold=i==1)
n.column_dimensions['A'].width=120
out=f'/home/claude/toastmasters/docs/{city}-Toastmasters-Clubs.xlsx'; wb.save(out)
print(len(rows),out)
