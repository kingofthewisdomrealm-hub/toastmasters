const fs=require('fs');
const {Document,Packer,Paragraph,TextRun,Table,TableRow,TableCell,WidthType,ShadingType,BorderStyle,AlignmentType,Footer}=require('docx');
const ACC='0C6A5D',LINE='BFC9C5',MUTE='5A6661';
const W=[1500,1000,2300,3500,1060]; const TW=W.reduce((a,b)=>a+b);
const b={style:BorderStyle.SINGLE,size:4,color:LINE}; const borders={top:b,bottom:b,left:b,right:b};
const run=(t,o={})=>new TextRun({text:t,font:'Arial',size:o.size||18,bold:o.bold,color:o.color,italics:o.italics});
const cell=(parts,i,o={})=>new TableCell({width:{size:W[i],type:WidthType.DXA},borders,margins:{top:70,bottom:70,left:90,right:90},
  shading:o.head?{type:ShadingType.CLEAR,fill:ACC,color:'auto'}:o.shade?{type:ShadingType.CLEAR,fill:o.shade,color:'auto'}:undefined,
  children:(Array.isArray(parts)?parts:[parts]).map(p=>new Paragraph({spacing:{after:20},children:(Array.isArray(p)?p:[p]).map(x=>typeof x==='string'?run(x,{color:o.head?'FFFFFF':undefined,bold:o.head}):x)}))});
const rows=[
 ['TODAY\nSun Sep 27','3:00 PM',['Professionally Speaking',run('Reston, VA · pro speakers club',{size:16,color:MUTE})],['Emailed for link (Cheryl Baker).','Check uberandujar inbox by 2:45.'],'Waiting'],
 ['TODAY\nSun Sep 27','6:30 PM',['Find Your Funny ⭐',run('Advanced humor club',{size:16,color:MUTE})],[[run('Zoom ID ',{}),run('835 9704 6626',{bold:true})],[run('Passcode ',{}),run('252525',{bold:true})]],'Ready'],
 ['Mon Sep 28','9:30 AM social\n10:00 AM mtg',['Reveilliers',run('Theme: National Scarf Day — wear a scarf',{size:16,color:MUTE})],[[run('Zoom ID ',{}),run('890 8832 8284',{bold:true})],[run('Passcode ',{}),run('00985',{bold:true})],run('Agenda coming from William Ingersoll',{size:16,color:MUTE})],'Ready'],
 ['Mon Sep 28 or\nTue Sep 29','11:00 AM',['CALL: Donny Crandell, AS',run('Accredited Speaker — mentorship',{size:16,color:MUTE})],['Reply to his email to confirm the day.'],'Reply!'],
 ['Tue Sep 29','8:00 AM',['Central South Malaysia Advanced',run('8 PM Malaysia time',{size:16,color:MUTE})],['Emailed for link. Waiting for reply.'],'Waiting'],
 ['Wed Sep 30','8:00 PM',['Superior Speakers MASTERCLASS ⭐',run('"How To Leverage a Book To Get More Gigs"',{size:16,color:MUTE})],['Registered. Link is in your email from Zoom.','Bring: Emotional Damage'],'Ready'],
 ['Thu Oct 1','8:58 AM',['Dynamically Speaking',run('Home club of an Accredited Speaker',{size:16,color:MUTE})],[[run('Zoom ID ',{}),run('845 8261 2072',{bold:true})],[run('Passcode ',{}),run('816699',{bold:true})]],'Ready'],
 ['Thu Oct 1','7:30 PM',['Virtual Professional Speakers ⭐',run('10-min round-table feedback',{size:16,color:MUTE})],[[run('Zoom ID ',{}),run('841 1958 4519',{bold:true})],[run('Passcode ',{}),run('915531',{bold:true})]],'Ready'],
 ['Thu Oct 1','8:00 PM',['AI Advantage Advanced',''],['Registered (RSVP). Link comes by email.'],'Ready'],
 ['Fri Oct 2','8:45 AM',['Singapore International',run('8:45 PM Singapore time',{size:16,color:MUTE})],['Emailed for link. Waiting for reply.'],'Waiting'],
 ['Fri Oct 2','12:00 PM',['Beachsiders — IN PERSON',run('Your home club. REJOIN.',{size:16,color:MUTE,bold:true})],['Youth Guidance, 1028 20th Place, Vero Beach'],'Go'],
 ['Fri Oct 2','10:00 PM',['Dungeons & Toast',''],['Registered (every Friday). Link in email from Zoom.'],'Ready'],
 ['Sun Oct 4','12:00 PM',['Global Yoga Voices',''],['Emailed for link. Waiting for reply.'],'Waiting'],
 ['Sun Oct 4','7:00 PM',['Podmasters Advanced',run('No AI note-takers · real name only',{size:16,color:MUTE})],[[run('Zoom ID ',{}),run('890 3623 4794',{bold:true})],run('Full link in your RSVP email',{size:16,color:MUTE})],'Ready'],
];
const tbl=new Table({width:{size:TW,type:WidthType.DXA},columnWidths:W,rows:[
  new TableRow({tableHeader:true,children:['Day','Time (your time)','Club','How to join','Status'].map((h,i)=>cell(h,i,{head:true}))}),
  ...rows.map((r,k)=>{const sh=r[0].startsWith('TODAY')?'FFF4DC':(k%2?'F3F6F5':undefined);
    return new TableRow({cantSplit:true,children:[
      cell(r[0].split('\n').map(x=>run(x,{bold:true})),0,{shade:sh}),
      cell(r[1].split('\n').map(x=>run(x,{bold:true,color:ACC})),1,{shade:sh}),
      cell(r[2].filter(Boolean).map((x,j)=>typeof x==='string'?run(x,{bold:j==0}):x),2,{shade:sh}),
      cell(r[3],3,{shade:sh}),
      cell(run('☐ '+r[4],{bold:true,color:r[4]==='Waiting'?'9A5214':r[4]==='Reply!'?'B00020':ACC}),4,{shade:sh})]})})]});
const P=(t,o={})=>new Paragraph({spacing:{after:o.after??80},children:[run(t,o)]});
const doc=new Document({styles:{default:{document:{run:{font:'Arial',size:20}}}},sections:[{properties:{page:{size:{width:12240,height:15840},margin:{top:600,bottom:500,left:720,right:720}}},
 footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.RIGHT,children:[run('Josias Andujar · uberandujar@gmail.com · 772-410-7170',{size:14,color:MUTE})]})]})},
 children:[
  P('My Toastmasters Week',{size:40,bold:true,color:'15201C',after:40}),
  P('Sunday, September 27 – Sunday, October 4, 2026 · all times are Florida (Eastern) time',{size:19,color:MUTE,after:60}),
  P('#1 this week: answer Donny Crandell. A call with an Accredited Speaker beats any meeting on this page.',{size:19,bold:true,color:'B00020',after:140}),
  tbl,
  P('',{after:40}),
  P('At every meeting',{size:24,bold:true,color:ACC,after:60}),
  P('☐  Join 5 minutes early. Say: "Josias Andujar, Toastmaster from Vero Beach, Florida."',{size:19}),
  P('☐  Offer to take a role or speak. Test the first 90 seconds of Emotional Damage.',{size:19}),
  P('☐  Ask for feedback like an Accredited Speaker judge: Content 45 · Delivery 35 · Language 20.',{size:19}),
  P('☐  Afterward, write one line: what worked, what was weak, what to change next time.',{size:19}),
 ]}]});
Packer.toBuffer(doc).then(b=>{fs.writeFileSync('/home/claude/toastmasters/docs/My-Toastmasters-Week-Sep27.docx',b);console.log('ok')});
