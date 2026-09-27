const fs=require('fs');
const {Document,Packer,Paragraph,TextRun,Table,TableRow,TableCell,WidthType,ShadingType,HeadingLevel,PageOrientation,AlignmentType,BorderStyle,LevelFormat,Footer,PageNumber,ExternalHyperlink}=require('docx');
const rows=JSON.parse(fs.readFileSync('orlando_clubs.json'));
const DAYS=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const fmt=m=>{if(m==null)return'';let h=Math.floor(m/60),mi=m%60,ap=h>=12?'PM':'AM';h=h%12||12;return `${h}:${String(mi).padStart(2,'0')} ${ap}`};
const ph=p=>{const m=/^\+1(\d{3})(\d{3})(\d{4})$/.exec(p||'');return m?`(${m[1]}) ${m[2]}-${m[3]}`:(p||'')};
const ACC='0C6A5D', LINE='C9D3CF';
const W=[1000,2700,1600,900,2100,3500,1600]; const TW=W.reduce((a,b)=>a+b);
const border={style:BorderStyle.SINGLE,size:4,color:LINE};
const borders={top:border,bottom:border,left:border,right:border};
const cell=(txt,i,{head=false,shade}={})=>new TableCell({width:{size:W[i],type:WidthType.DXA},borders,
  shading:head?{type:ShadingType.CLEAR,fill:ACC,color:'auto'}:shade?{type:ShadingType.CLEAR,fill:shade,color:'auto'}:undefined,
  margins:{top:60,bottom:60,left:90,right:90},
  children:(Array.isArray(txt)?txt:[txt]).map(t=>new Paragraph({children:[typeof t==='string'?new TextRun({text:t,bold:head,color:head?'FFFFFF':undefined,size:18,font:'Calibri'}):t]}))});
const HEAD=['Time','Club','City','Online','Meets','Contact email','Phone'];
function dayTable(list){
  return new Table({width:{size:TW,type:WidthType.DXA},columnWidths:W,rows:[
    new TableRow({tableHeader:true,children:HEAD.map((h,i)=>cell(h,i,{head:true}))}),
    ...list.map((c,r)=>{const notes=[c.freq||'Weekly'];if(c.restricted)notes.push('Membership may be restricted');if(c.spanish)notes.push('Spanish-language');
      const sh=r%2?'F3F6F5':undefined;
      return new TableRow({cantSplit:true,children:[
        cell(new TextRun({text:fmt(c.start),bold:true,size:18,color:ACC}),0,{shade:sh}),
        cell([new TextRun({text:c.name,bold:true,size:18}),new TextRun({text:`Club #${c.number}${c.location?' · '+c.location.slice(0,70):''}`,size:15,color:'5A6661'})],1,{shade:sh}),
        cell(c.city,2,{shade:sh}),cell(c.online?'Yes':'In person',3,{shade:sh}),cell(notes.join(' · '),4,{shade:sh}),
        cell(c.email||'—',5,{shade:sh}),cell(ph(c.phone)||'—',6,{shade:sh})]})})]});
}
const P=(text,o={})=>new Paragraph({spacing:{after:80},...o,children:[new TextRun({text,size:o.size||20,font:'Calibri',color:o.color,bold:o.bold,italics:o.italics})]});
const children=[
  new Paragraph({heading:HeadingLevel.TITLE,children:[new TextRun({text:'Orlando Toastmasters Clubs',font:'Calibri',size:44,bold:true,color:'15201C'})]}),
  P('Weekly meeting schedule for every club within 30 miles of downtown Orlando. All times are local Eastern Time.',{color:'5A6661'}),
  P(`${rows.length} clubs · ${rows.filter(c=>c.online).length} allow online attendance · source: Toastmasters International Find a Club, pulled September 27, 2026.`,{color:'5A6661',size:18}),
  P('How to read this: "Meets" shows how often the club meets. Monthly clubs such as "2nd & 4th Tuesday of month" meet only in those weeks. "Membership may be restricted" usually means a company or government club; guests are often welcome, but call first. Contact details are each club\'s own listing. Confirm before driving over.',{size:18,italics:true}),
];
DAYS.forEach((d,i)=>{const list=rows.filter(c=>c.dayIdx===i).sort((a,b)=>a.start-b.start); if(!list.length)return;
  children.push(new Paragraph({heading:HeadingLevel.HEADING_1,spacing:{before:280,after:120},keepNext:true,children:[new TextRun({text:`${d}  (${list.length})`,font:'Calibri',size:28,bold:true,color:ACC})]}));
  children.push(dayTable(list));});
const un=rows.filter(c=>c.dayIdx==null);
if(un.length){children.push(new Paragraph({heading:HeadingLevel.HEADING_1,spacing:{before:280,after:120},children:[new TextRun({text:'New clubs still forming (no schedule yet)',font:'Calibri',size:28,bold:true,color:ACC})]}));
  un.forEach(c=>children.push(P(`${c.name}: ${c.city}. Email ${c.email||'—'}${c.phone?' · Phone '+ph(c.phone):''}`,{size:19})));}
children.push(new Paragraph({heading:HeadingLevel.HEADING_1,spacing:{before:280,after:120},children:[new TextRun({text:'Websites',font:'Calibri',size:28,bold:true,color:ACC})]}));
rows.filter(c=>c.website).sort((a,b)=>a.name.localeCompare(b.name)).forEach(c=>children.push(new Paragraph({spacing:{after:40},children:[new TextRun({text:c.name+': ',bold:true,size:18}),new ExternalHyperlink({link:c.website,children:[new TextRun({text:c.website,style:'Hyperlink',size:18})]})]})));
const doc=new Document({styles:{default:{document:{run:{font:'Calibri',size:20}}}},
  sections:[{properties:{page:{size:{width:12240,height:15840,orientation:PageOrientation.LANDSCAPE},margin:{top:720,bottom:720,left:720,right:720}}},
    footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.RIGHT,children:[new TextRun({text:'Orlando Toastmasters Clubs · page ',size:16,color:'5A6661'}),new TextRun({children:[PageNumber.CURRENT],size:16,color:'5A6661'})]})]})},
    children}]});
Packer.toBuffer(doc).then(b=>{fs.writeFileSync('/home/claude/toastmasters/docs/Orlando-Toastmasters-Clubs.docx',b);console.log('ok')});
