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
 ['8:00 AM',['Prep hour (no Zoom club found)','Every 8 AM club is overseas or in person'],[[run('Warm up: run your 90-sec Emotional Damage opening 3x out loud',{size:15})]],['Coffee. Scarf. Game face.'],false],
 ['9:30 AM',['Reveilliers (social starts 9:30)','Meeting 10:00 AM · they replied to you!'],[[run('✓ Click to join',{bold:true,color:ACC})],[link('https://us06web.zoom.us/j/89088328284?pwd=QUhNRGpCZnozUHhPcGNmZ2VDd3lGQT09')],[run('ID 890 8832 8284 · Passcode 00985',{size:15})]],['Wear a scarf: it is their Scarf Day theme. Agenda coming from William Ingersoll.'],false],
 ['11:00 AM',['Call with Donny Crandell (AS)','Only if you booked it with him'],[[run('Reply to his email to lock Mon or Tue 11 AM',{size:15})]],['Bring 3 questions about paid talks'],false],
 ['12:00 PM',['Authors and Aspiring Authors','Washington, DC area · perfect for an author'],[[run('✉ Needs link — email first',{bold:true,color:WARN})],[run('jbdiva1@verizon.net',{size:15})]],['Sun Life Speakers Corner (Toronto) · info.sunlifespeakerscorner@gmail.com'],true],
 ['1:00 PM',['Cervantes (100% in Spanish)','New York City · register once, get link'],[[run('✓ Register, link comes by email',{bold:true,color:ACC})],[link('https://us06web.zoom.us/meeting/register/tZMkde2urjIrGNRBVAh1dg_y7okIZl7up5fJ','Register here')]],['Great spot to try the opening en español'],false],
 ['3:00 PM',['Prepared Speakers','Glendale, CA · 12:00 PM Pacific'],[[run('✓ Click to join',{bold:true,color:ACC})],[link('https://us02web.zoom.us/j/87459739092')]],['Aerospace (El Segundo) 2:30 PM · scruth16604@gmail.com'],false],
 ['5:30 PM',['Plantation Pointe','Plantation, FL · Google Meet (not Zoom)'],[[run('✓ Click to join',{bold:true,color:ACC})],[link('https://meet.google.com/kge-efjt-ttb')],[run('Phone: +1 424-255-9943 · PIN 774 045 069#',{size:15})]],['Dinner after if it ends early'],false],
 ['6:00 PM',['Daytona Beach Toastmasters','Daytona Beach, FL · 6:00–7:15 PM'],[[run('✉ Needs link — email first',{bold:true,color:WARN})],[run('Email via club website',{size:15})]],['Leadership Roundtable NYC · lrttoastmasters@gmail.com'],true],
 ['7:00 PM',['Speak with Purpose','Online club'],[[run('✓ Click to join',{bold:true,color:ACC})],[link('https://zoom.us/j/99102841044?pwd=dHBBNXRweFk0MCtLNkdsQVFxQUVWdz09')]],["Let's Talk Orlando:",link('https://us02web.zoom.us/j/82042838539','Zoom'),run(' · 5-Star Arlington:',{size:15}),link('https://us02web.zoom.us/j/89470614699','Zoom')],false],
 ['7:30 PM',['DTM Driven To Motivate','Online club'],[[run('✓ Join with Meeting ID',{bold:true,color:ACC})],[run('Meeting ID 872 0690 3043',{size:15})]],['Manhasset 7:15 PM:',link('https://us02web.zoom.us/j/83897724699','Zoom'),run(' · Online Presenters humor workshop 7:15–9 PM (RSVP op.toastmost.org)',{size:15})],false],
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
  P('Toastmasters Marathon: Monday, Sep 28',{size:36,bold:true,color:'15201C',after:30}),
  P('8 meetings + 1 call, 9:30 AM to 8:30 PM · Mondays are thinner, so 8–9:30 AM is prep time · all times are your Florida (Eastern) time',{size:19,color:MUTE,after:60}),
  P('✓ = link ready, just click   ·   ✉ = email the club for the link first (highlighted)',{size:17,color:MUTE,after:140}),
  new Table({width:{size:TW,type:WidthType.DXA},columnWidths:W,rows}),
  P('',{after:40}),
  P('Game plan',{size:22,bold:true,color:ACC,after:40}),
  P('☐  Join 5 minutes early. Rename yourself on Zoom: "Josias Andujar – Vero Beach, FL (guest)".',{size:17}),
  P('☐  At every club, offer to take Table Topics or a role. Test the same 90-second opening of Emotional Damage all day, and change ONE thing after each meeting.',{size:17}),
  P('☐  Most meetings run 60–90 minutes. If two overlap, leave politely with a thank-you in the chat.',{size:17}),
  P('☐  Tonight, write down: which version of the opening got the best reaction?',{size:17}),
 ]}]});
Packer.toBuffer(doc).then(b=>{fs.writeFileSync('/home/claude/toastmasters/docs/Toastmasters-Marathon-Mon-Sep28.docx',b);console.log('ok')});
