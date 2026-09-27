import json,re,subprocess,html,sys
from concurrent.futures import ThreadPoolExecutor
ZURL=re.compile(r'https?://(?:[\w-]+\.)?zoom\.us/(?:j|w|my|meeting/register)/[^\s"\'<>)\]]+',re.I)
MID=re.compile(r'meeting\s*id[:\s#]*((?:\d[\s-]?){9,11})',re.I)
WA=re.compile(r'https?://(?:wa\.me/\d+|api\.whatsapp\.com/send\?phone=\d+|chat\.whatsapp\.com/[A-Za-z0-9]+)',re.I)
PWD=re.compile(r'pass(?:code|word)?\s*[:=]?\s*([A-Za-z0-9@#$*!]{4,12})\b|\bPW[:\s]+([A-Za-z0-9]{4,12})\b',re.I)
def text(u):
    r=subprocess.run(['curl','-s','-L','-m','20','-A','Mozilla/5.0',u],capture_output=True,text=True,errors='ignore')
    return r.stdout
def extract(t):
    t2=html.unescape(re.sub(r'<[^>]+>',' ',t)); raw=html.unescape(t)
    urls=sorted(set(u.rstrip('.,;') for u in ZURL.findall(raw)))
    mid=MID.search(t2); pw=PWD.search(t2[mid.start():mid.start()+200]) if mid else None
    return urls,(re.sub(r'\D','',mid.group(1)) if mid else ''),((pw.group(1) or pw.group(2)) if pw else '')
def fmtid(i): return f"{i[:3]} {i[3:7]} {i[7:]}" if len(i)==11 else (f"{i[:3]} {i[3:6]} {i[6:]}" if len(i)==10 else f"{i[:3]} {i[3:6]} {i[6:]}")
def run(c, rawrec):
    found={'whatsappLink':'','zoomLink':'','zoomId':'','zoomPass':'','zoomSource':'','zoomHow':''}
    # 1 directory listing
    dirtext=' '.join(filter(None,[rawrec.get('Location'),rawrec.get('Note'),rawrec.get('MeetingDay'),rawrec.get('MeetingTime')]))
    u,i,p=extract(dirtext)
    if u or i: found.update(zoomLink=u[0] if u else '',zoomId=fmtid(i) if i else '',zoomPass=p,zoomSource='Toastmasters directory')
    # 2 website
    if not (u or i) and c['website'] and 'facebook.com' not in c['website']:
        t=text(c['website'])
        u,i,p=extract(t)
        wa=WA.findall(html.unescape(t))
        if wa: found['whatsappLink']=wa[0]
        if u or i: found.update(zoomLink=u[0] if u else '',zoomId=fmtid(i) if i else '',zoomPass=p,zoomSource='Club website')
        elif re.search(r'zoom',t,re.I) and re.search(r'contact|email|request|rsvp|register',t,re.I): found['zoomHow']='Club site says meetings are on Zoom; request link from club'
    if found['zoomLink'] and 'meeting/register' in found['zoomLink']: found['zoomHow']='Register at this link; Zoom emails the join link'
    return found
for city in sys.argv[1:]:
    rows=json.load(open(f'{city}_clubs.json')); raw={r['Identification']['Id']['DisplayFriendlyFormat']:r for r in json.load(open(f'{city}_raw.json'))['Clubs'] if isinstance(json.load(open(f'{city}_raw.json')),dict)} if False else None
    rj=json.load(open(f'{city}_raw.json')); rj=rj['Clubs'] if isinstance(rj,dict) else rj
    raw={r['Identification']['Id']['DisplayFriendlyFormat']:r for r in rj}
    with ThreadPoolExecutor(24) as ex: res=list(ex.map(lambda c: run(c,raw.get(c['number'],{})),rows))
    for c,f in zip(rows,res): c.update(f)
    json.dump(rows,open(f'{city}_clubs.json','w'),indent=1)
    print(city, 'links',sum(bool(c['zoomLink']) for c in rows),'ids',sum(bool(c['zoomId']) for c in rows),'request',sum(bool(c['zoomHow']) and not c['zoomLink'] for c in rows))
    for c in rows:
        if c['zoomLink'] or c['zoomId']: print('  ',c['name'][:32],'|',c['zoomLink'][:70],'|',c['zoomId'],'|',c['zoomPass'],'|',c['zoomSource'])
