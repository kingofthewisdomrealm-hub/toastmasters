import json,re,sys
from datetime import datetime,timedelta,date
from zoneinfo import ZoneInfo
ET=ZoneInfo('America/New_York')
TZ={'orlando':'America/New_York','miami':'America/New_York','new york city':'America/New_York','washington dc':'America/New_York','toronto':'America/Toronto','chicago':'America/Chicago','denver':'America/Denver','los angeles':'America/Los_Angeles','san diego':'America/Los_Angeles','mexico city':'America/Mexico_City','guadalajara':'America/Mexico_City','london':'Europe/London','tokyo':'Asia/Tokyo','singapore':'Asia/Singapore'}
def meets(freq,d):
    f=(freq or '').lower()
    if f.startswith('weekly') or 'weekly online' in f or 'thursdays on zoom' in f: return 'y'
    if not f: return '?'
    if re.search(r'every other|biweekly|alternate',f): return '?'
    o=[int(x[0]) for x in re.findall(r'(\d)(st|nd|rd|th)',f)]
    if 'except' in f: return 'n' if (d.day-1)//7+1 in o else 'y'
    if 'last' in f: return 'y' if (d+timedelta(days=7)).month!=d.month else 'n'
    if '–' in f and o: return 'y' if o[0]<= (d.day-1)//7+1 <= 4 else 'n'
    if not o: return '?'
    return 'y' if (d.day-1)//7+1 in o else 'n'
known={ # links received / verified today
 'Reveilliers':('https://us06web.zoom.us/j/89088328284?pwd=QUhNRGpCZnozUHhPcGNmZ2VDd3lGQT09','890 8832 8284','00985'),
 'Dynamically Speaking Toastmasters':('', '845 8261 2072','816699'),
 'Virtual Professional Speakers':('https://us06web.zoom.us/j/84119584519?pwd=EP0jGrhbJXb0W8CpoXjSbUjY4BRG41.1','841 1958 4519','915531'),
 'Find Your Funny':('https://bit.ly/3rTma84','835 9704 6626','252525'),
}
def collect(day):
    start=datetime(day.year,day.month,day.day,8,0,tzinfo=ET); end=datetime(day.year,day.month,day.day,20,0,tzinfo=ET)
    out=[]
    for city,tz in TZ.items():
        try: r=json.load(open(f'{city}_clubs.json'))
        except: continue
        z=ZoneInfo(tz)
        for c in r:
            if c.get('dayIdx') is None or c.get('start') is None or c.get('restricted') or not c.get('online'): continue
            for k in (-1,0,1):
                d=(start+timedelta(days=k)).astimezone(z).date()
                if d.weekday()!=c['dayIdx']: continue
                st=datetime(d.year,d.month,d.day,c['start']//60,c['start']%60,tzinfo=z).astimezone(ET)
                if start<=st<end and meets(c['freq'],d)=='y':
                    link,zid,pw=c.get('zoomLink',''),c.get('zoomId',''),c.get('zoomPass','')
                    out.append(dict(t=st,name=c['name'],city=c['city'],src=city,link=link,id=zid,pw=pw,email=c.get('email',''),lang=c.get('langNote','') or ('Spanish' if c.get('spanish') else ''),website=c.get('website','')))
    for c in json.load(open('/home/claude/toastmasters/src/data/clubs.json')):
        z=ZoneInfo(c['timezone']); h,mi=map(int,c['localTime'].split(':'))
        DAYS=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
        for k in (-1,0,1):
            d=(start+timedelta(days=k)).astimezone(z).date()
            if DAYS[d.weekday()]!=c['meetingDay']: continue
            st=datetime(d.year,d.month,d.day,h,mi,tzinfo=z).astimezone(ET)
            if start<=st<end and meets(c['frequency'],d)=='y':
                out.append(dict(t=st,name=c['name'],city=f"{c['city']}, {c['country']}",src='global',link=c.get('zoomLink') or '',id='',pw='',email=c.get('contactEmail') or '',lang='' if c['language']=='English' else c['language'],website=c.get('website') or ''))
    ded={}
    for o in out:
        k=o['name'].lower().replace('toastmasters','').replace('club','').strip()[:20]
        if k in known or o['name'] in known: pass
        for kn,v in known.items():
            if kn.lower() in o['name'].lower(): o['link'],o['id'],o['pw']=v
        if k not in ded or (o['link'] or o['id']) and not (ded[k]['link'] or ded[k]['id']): ded[k]=o
    return sorted(ded.values(),key=lambda o:o['t'])
if __name__=='__main__':
    for i in range(0,5):
        day=date(2026,9,28)+timedelta(days=i)
        L=collect(day); Z=[o for o in L if o['link'] or o['id']]
        hours=set(o['t'].hour for o in Z)
        print(day.strftime('%a %b %d'),'meetings',len(L),'with zoom',len(Z),'hours covered by zoom',sorted(hours))
