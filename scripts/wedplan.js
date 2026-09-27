const fs=require('fs');
const {Document,Packer,Paragraph,TextRun,Table,TableRow,TableCell,WidthType,ShadingType,BorderStyle,AlignmentType,Footer,ExternalHyperlink}=require('docx');
const ACC='0C6A5D',LINE='BFC9C5',MUTE='5A6661',WARN='9A5214';
const W=[1150,2550,4300,2380]; const TW=W.reduce((a,b)=>a+b);
const b={style:BorderStyle.SINGLE,size:4,color:LINE}; const borders={top:b,bottom:b,left:b,right:b};
const run=(t,o={})=>new TextRun({text:t,font:'Arial',size:o.size||17,bold:o.bold,color:o.color,italics:o.italics});
const link=(u,label)=>new ExternalHyperlink({link:u,children:[new TextRun({text:label||u,font:'Arial',size:14,color:'0563C1',underline:{}})]});
const cell=(paras,i,o={})=>new TableCell({width:{size:W[i],type:WidthType.DXA},borders,margins:{top:60,bottom:60,left:80,right:80},
  shading:o.head?{type:ShadingType.CLEAR,fill:ACC,color:'auto'}:o.shade?{type:ShadingType.CLEAR,fill:o.shade,color:'auto'}:undefined,
  children:paras.map(p=>new Paragraph({spacing:{after:10},children:Array.isArray(p)?p:[p]}))});
const R=[
 ['8:00 AM',['Praxis Toastmasters','Online club · 7:00 AM Central'],[[run('✓ Click to join',{bold:true,color:ACC})],[link('https://us06web.zoom.us/j/84950397013?pwd=MWlTN09KSFlnME9vcGNqYnpybmpiUT09')]],['—'],false],
 ['10:00 AM',['North Tustin Sensational Speakers','California · 7:00 AM Pacific · till 11:30'],[[run('✓ Click to join',{bold:true,color:ACC})],[link('https://us06web.zoom.us/j/86747827106?pwd=v12jI5cuMIblTLlfP7QgIijMS8blvl.1')]],['Hill Talkers (San Diego), 10 AM · email kkwhitaker@ucsd.edu'],false],
 ['12:00 PM',['Speakers of the Hill','Markham, Canada (Toronto area)'],[[run('✓ Click to join',{bold:true,color:ACC})],[link('https://us06web.zoom.us/j/3640063842?pwd=RXU2bWprZWNLWGdiOWRVT3VCQVFRZz09')]],['Applewood Achievers (Toronto):',link('https://us06web.zoom.us/j/86362565432?pwd=S9tbi7MejxJc9SyN1hI77jZAIkqbbO.1','Zoom link')],false],
 ['1:00 PM',['Voice of Champions','Doral (Miami area)'],[[run('✉ Needs link — email first',{bold:true,color:WARN})],[run('officers@voiceofchampions.com',{size:15})]],['Lunch break if no reply'],true],
 ['2:30 PM',['Downtown Speakeasy','Denver · 12:30 PM Mountain'],[[run('✓ Click to join',{bold:true,color:ACC})],[link('https://us02web.zoom.us/j/8563711800')],[run('Meeting ID 856 371 1800',{size:15})]],['Balboa Park (San Diego):',link('https://us02web.zoom.us/j/86791288014?pwd=aHZkOVNmaWxYcUJZcEtGVUFCSERRdz09','Zoom link')],false],
 ['4:00 PM',['PowerMasters','San Diego · 1:00 PM Pacific'],[[run('✉ Needs link — email first',{bold:true,color:WARN})],[run('powermasterstoastmasters@gmail.com',{size:15})]],['UCSD Torrey Pines, 3 PM:',link('https://ucsd.zoom.us/j/94596128215','Zoom link')],true],
 ['5:30 PM',['Agricultural Research Center','Beltsville, MD'],[[run('✉ Needs link — email first',{bold:true,color:WARN})],[run('vpm-3039@toastmastersclubs.org',{size:15})]],['Dinner break if no reply'],true],
 ['6:00 PM',['University of Toronto Toastmasters','Toronto'],[[run('✓ Click to join',{bold:true,color:ACC})],[link('https://utoronto.zoom.us/j/3336661729')]],['Hines Verbal Aces (Chicago):',link('https://us05web.zoom.us/j/88593844941?pwd=7GavwBI4GNMdoqU2Pnwpxz2vNEWrS8.1','Zoom link')],false],
 ['7:00 PM',['Elite Toastmasters','Whitby, Canada (Toronto area)'],[[run('✓ Click to join',{bold:true,color:ACC})],[link('https://us06web.zoom.us/j/89460543892')]],['Miramar Dynamic (Florida), 7:30 PM:',link('https://us02web.zoom.us/j/6973415645?pwd=Qm9vOWNkZWR3R0JCc1NJY2EwZnowUT09','Zoom link')],false],
 ['8:00 PM',['⭐ Superior Speakers MASTERCLASS','"How To Leverage a Book To Get More Gigs"'],[[run('✓ You are registered',{bold:true,color:ACC})],[run('Your personal join link is in the Zoom email in uberandujar@gmail.com',{size:15})]],['Have Emotional Damage in hand'],false],
];
const rows=[new TableRow({tableHeader:true,children:['Your time','Club','How to join','Backup / note'].map((h,i)=>cell([[run(h,{bold:true,color:'FFFFFF'})]],i,{head:true}))})];
R.forEach((r,k)=>{const sh=r[4]?'FFF4DC':(k%2?'F3F6F5':undefined);
 rows.push(new TableRow({cantSplit:true,children:[
  cell([[run(r[0],{bold:true,color:ACC,size:19})],[run('☐ attended',{size:14,color:MUTE})]],0,{shade:sh}),
  cell([[run(r[1][0],{bold:true})],[run(r[1][1],{size:15,color:MUTE})]],1,{shade:sh}),
  cell(r[2],2,{shade:sh}),
  cell([r[3].map(x=>typeof x==='string'?run(x,{size:15}):x)],3,{shade:sh})]}));});
const P=(t,o={})=>new Paragraph({spacing:{after:o.after??60},children:[run(t,o)]});
const doc=new Document({styles:{default:{document:{run:{font:'Arial',size:20}}}},sections:[{properties:{page:{size:{width:12240,height:15840},margin:{top:600,bottom:500,left:720,right:720}}},
 footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.RIGHT,children:[run('Josias Andujar · uberandujar@gmail.com · 772-410-7170',{size:14,color:MUTE})]})]})},
 children:[
  P('Toastmasters Marathon: Wednesday, Sep 30',{size:36,bold:true,color:'15201C',after:30}),
  P('10 meetings, 8 AM to 9:30 PM, all on Zoom · all times are your Florida (Eastern) time',{size:19,color:MUTE,after:60}),
  P('✓ = link ready, just click   ·   ✉ = email the club for the link first (highlighted)',{size:17,color:MUTE,after:140}),
  new Table({width:{size:TW,type:WidthType.DXA},columnWidths:W,rows}),
  P('',{after:40}),
  P('Game plan',{size:22,bold:true,color:ACC,after:40}),
  P('☐  Join 5 minutes early. Rename yourself on Zoom: "Josias Andujar – Vero Beach, FL (guest)".',{size:17}),
  P('☐  At every club, offer to take Table Topics or a role. Test the same 90-second opening of Emotional Damage all day, and change ONE thing after each meeting.',{size:17}),
  P('☐  Most meetings run 60–90 minutes. If two overlap, leave politely with a thank-you in the chat.',{size:17}),
  P('☐  Tonight, write down: which version of the opening got the best reaction?',{size:17}),
 ]}]});
Packer.toBuffer(doc).then(b=>{fs.writeFileSync('/home/claude/toastmasters/docs/Toastmasters-Marathon-Wed-Sep30.docx',b);console.log('ok')});
