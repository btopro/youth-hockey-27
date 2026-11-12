import{css as bt,html as m}from"@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";import{DDD as yt}from"@haxtheweb/d-d-d/d-d-d.js";import"@haxtheweb/rpg-character/rpg-character.js";/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */const se={third:{id:"third",label:"\u2153 ice (cross-ice)",width:66,length:85,goalLine:8,cornerRadius:12,blueLines:null,centerLine:!1},half:{id:"half",label:"\xBD ice",width:85,length:100,goalLine:10,cornerRadius:20,blueLines:null,centerLine:!0},full:{id:"full",label:"Full ice",width:85,length:200,goalLine:11,cornerRadius:28,blueLines:75,centerLine:!0},roller:{id:"roller",label:"Roller rink",width:85,length:185,goalLine:12,cornerRadius:26,blueLines:null,centerLine:!0},pond:{id:"pond",label:"Pond",width:70,length:130,goalLine:10,cornerRadius:30,blueLines:null,centerLine:!1},street:{id:"street",label:"Street",width:60,length:120,goalLine:10,cornerRadius:6,blueLines:null,centerLine:!1}},qe={small:{width:6,depth:3},regulation:{width:8,depth:3.5},pond:{width:3.5,depth:2.5},street:{width:7,depth:3}},G={rink:{id:"rink",label:"Rink",crowd:!0,refs:!0},roller:{id:"roller",label:"Roller rink",crowd:!0,refs:!0,surface:"roller",skaters:4},pond:{id:"pond",label:"Pond hockey",crowd:!1,refs:!1,surface:"pond",skaters:4,goalies:!1,net:"pond",boost:18},street:{id:"street",label:"Street hockey",crowd:!1,refs:!1,surface:"street",skaters:4,net:"street",boost:18}},K=300,ie=[{id:"8U",label:"8U",ageIndex:0,surface:"third",skaters:3,net:"small",offsides:!1,icing:!1,checking:!1,buzzer:90,keepScore:!1,periodSeconds:K,periodMinutes:5,speed:.55,ai:.35,saveBase:.65,fights:!1,blurb:"Cross-ice, 3 on 3. More puck touches, more shots, more fun. No scoreboard: parents wave dollar bills instead."},{id:"10U",label:"10U",ageIndex:1,surface:"half",skaters:4,net:"small",offsides:!1,icing:!1,checking:!1,buzzer:90,keepScore:!1,periodSeconds:K,periodMinutes:5,speed:.65,ai:.45,saveBase:.64,fights:!1,blurb:"Half ice, 4 on 4. Small spaces build quick hands and quick decisions."},{id:"12U",label:"12U",ageIndex:2,surface:"half",skaters:3,net:"regulation",offsides:!1,icing:!1,checking:!1,buzzer:120,keepScore:!0,periodSeconds:K,periodMinutes:5,speed:.75,ai:.55,saveBase:.75,fights:!1,blurb:"Half ice, 3 on 3, and the scoreboard turns on."},{id:"14U",label:"14U",ageIndex:3,surface:"full",skaters:5,net:"regulation",offsides:!0,icing:!0,checking:!0,buzzer:0,keepScore:!0,periodSeconds:K,periodMinutes:5,speed:.85,ai:.65,saveBase:.78,fights:!1,blurb:"Full ice, 5 on 5, offsides and icing, and body checking begins."},{id:"16U",label:"16U",ageIndex:4,surface:"full",skaters:5,net:"regulation",offsides:!0,icing:!0,checking:!0,buzzer:0,keepScore:!0,periodSeconds:K,periodMinutes:5,speed:.92,ai:.75,saveBase:.8,fights:!1,blurb:"Faster, stronger, and the late bloomers are catching up."},{id:"18U",label:"18U",ageIndex:5,surface:"full",skaters:5,net:"regulation",offsides:!0,icing:!0,checking:!0,buzzer:0,keepScore:!0,periodSeconds:K,periodMinutes:5,speed:1,ai:.85,saveBase:.82,fights:!1,blurb:"Top speed. Look who the best players are now."},{id:"beer",label:"AAA & Beer League",ageIndex:5,surface:"full",skaters:5,net:"regulation",offsides:!0,icing:!0,checking:!0,buzzer:0,keepScore:!0,periodSeconds:K,periodMinutes:5,speed:.95,ai:.7,saveBase:.75,fights:!0,blurb:"Constant fights. Every fighter gets tossed until somebody runs out of players."}],V=h=>ie.find(e=>e.id===h)||ie[0],Ue={standard:{id:"standard",label:"Standard",penalties:!0},jay:{id:"jay",label:"Jay mode (no penalties)",penalties:!1}},xe=(h,e={})=>{const t=V(h),s=G[e.venue]||(e.roller?G.roller:G.rink),i=s.id!=="rink",n=se[s.surface||t.surface],a=Ue[e.ruleset]||Ue.standard,o=typeof e.strictness=="number"?Math.max(0,Math.min(1,e.strictness)):.5,r=t.periodSeconds;return{level:t,levelId:t.id,ageIndex:t.ageIndex,venue:s.id,roller:s.id==="roller",surface:n,net:qe[s.net||(i?"regulation":t.net)],skaters:s.skaters||t.skaters,goalies:s.goalies!==!1,offsides:i?!1:t.offsides&&!!n.blueLines,icing:i?!1:t.icing,checking:i?!1:t.checking,buzzer:i?0:t.buzzer,keepScore:t.keepScore,periods:3,periodSeconds:r,periodMinutes:t.periodMinutes,minorSeconds:2/15*r,speed:t.speed,ai:t.ai,saveBase:t.saveBase,fights:t.fights&&s.refs,ruleset:a.id,penalties:a.penalties&&s.refs,strictness:o,crowd:s.crowd,boost:s.boost||0,faceoffs:n.id==="full"||n.id==="roller",needWinner:!!e.needWinner}};/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */const kt=h=>{let e=2166136261;for(let t=0;t<h.length;t++)e^=h.charCodeAt(t),e=Math.imul(e,16777619);return e>>>0},ae=h=>{let e=(typeof h=="string"?kt(h):h>>>0)||1;const t=()=>{e=e+1831565813|0;let s=Math.imul(e^e>>>15,1|e);return s=s+Math.imul(s^s>>>7,61|s)^s,((s^s>>>14)>>>0)/4294967296};return{next:t,range:(s,i)=>s+(i-s)*t(),int:(s,i)=>Math.floor(s+(i-s+1)*t()),chance:s=>t()<s,pick:s=>s[Math.floor(t()*s.length)],weighted:s=>{const i=s.reduce((a,o)=>a+o.weight,0);let n=t()*i;for(const a of s)if(n-=a.weight,n<=0)return a;return s[s.length-1]},shuffle:s=>{const i=s.slice();for(let n=i.length-1;n>0;n--){const a=Math.floor(t()*(n+1)),o=i[n];i[n]=i[a],i[a]=o}return i}}},xt=["#f7dece","#f3d2a2","#d5ab88","#af7e57","#7c533e"],Y=[{id:"sparkle-selects",name:"AAAA Sparkle Selects",short:"SPK",crest:"sparkle-selects",kits:{home:{jersey:"#ff3fa4",trim:"#ffde46",stripe:"#2e80ff",number:"#111111",helmet:"#ff3fa4",pants:"#111111"},away:{jersey:"#f4f7fc",trim:"#ff3fa4",stripe:"#ffde46",number:"#ff3fa4",helmet:"#ff3fa4",pants:"#111111"}}},{id:"b-squad",name:"B Squad",short:"BSQ",crest:"b-squad",kits:{home:{jersey:"#151217",trim:"#ff3fa4",stripe:"#7a7a7a",number:"#ff3fa4",helmet:"#ff3fa4",pants:"#151217"},away:{jersey:"#ff3fa4",trim:"#151217",stripe:"#7a7a7a",number:"#151217",helmet:"#151217",pants:"#151217"}}},{id:"jesus-selects",name:"Jesus Selects",short:"JSS",crest:"jesus-selects",kits:{home:{jersey:"#f7f7f2",trim:"#f2c94c",stripe:"#2a4bd7",number:"#2a4bd7",helmet:"#f2c94c",pants:"#2a4bd7"},away:{jersey:"#2a4bd7",trim:"#f2c94c",stripe:"#f7f7f2",number:"#f2c94c",helmet:"#f2c94c",pants:"#2a4bd7"}}},{id:"elite-prospects",name:"Elite Prospects",short:"ELP",crest:"elite-prospects",kits:{home:{jersey:"#0e0e10",trim:"#d4af37",stripe:"#c0c4cc",number:"#d4af37",helmet:"#d4af37",pants:"#0e0e10"},away:{jersey:"#d4af37",trim:"#0e0e10",stripe:"#c0c4cc",number:"#0e0e10",helmet:"#0e0e10",pants:"#0e0e10"}}},{id:"d1-or-bust",name:"D1 or Bust",short:"D1B",crest:"d1-or-bust",kits:{home:{jersey:"#ff7a1a",trim:"#13213f",stripe:"#ffffff",number:"#13213f",helmet:"#13213f",pants:"#13213f"},away:{jersey:"#13213f",trim:"#ff7a1a",stripe:"#ffffff",number:"#ff7a1a",helmet:"#ff7a1a",pants:"#13213f"}}}],P=h=>Y.find(e=>e.id===h)||Y[0],wt=["Avery","Bo","Cam","Dez","Eli","Finn","Gigi","Hollis","Iggy","Jo","Kit","Lux","Mo","Nico","Ozzy","Pip","Quinn","Remy","Sasha","Teddy","Uma","Vic","Wren","Xan","Yuki","Zed","Bea","Gus","Ivy","Rory","Milo","Nell","Otis","Pia","Rex","Tova","Ash","Coco","Duke","Elle"],vt=["Pucksworth","Snipeski","Bardown","Dangleton","Wristerly","Slapsky","Crossbarr","Zambonie","Benchley","Bluelino","Faceoffski","Breakaway","Toecurl","Glovesave","Iceberg","Kneepad","Backcheck","Tapeworth","Onetimer","Hatcher","Lacesley","Rinkman","Stickley","Mittens","Crease","Biscuit","Celly","Wheelson","Sauce","Cellydance","Pylon","Tilly","Skatesby","Edgework","Linemate","Wristwell","Puckett","Boardman","Gretz","Snowmore"],we=(h,e,t)=>Math.max(e,Math.min(t,h)),St=(h,e)=>h==="early"?18-7*e:h==="late"?-15+7*e:0,$t=h=>{const e=ae(`roster:${h.id}`),t=e.shuffle(wt),s=e.shuffle(vt),i=new Set,n=()=>{let r=e.int(2,98);for(;i.has(r);)r=e.int(2,98);return i.add(r),r},a=e.shuffle(["early","early","early","late","late","late","steady","steady","steady","steady","steady","steady","steady"]),o=[];for(let r=0;r<15;r++){const l=r>=13,d=l?e.pick(["early","late","steady"]):a[r],c=d==="early"?e.int(60,95):d==="late"?e.int(5,40):e.int(20,65),u=we(e.int(30,95)+(d==="late"?10:d==="early"?-8:0),20,99);o.push({id:`${h.id}-${r}`,teamId:h.id,first:t[r],last:s[r],name:`${t[r]} ${s[r]}`,number:n(),position:l?"G":r<8?"F":"D",goalie:l,curve:d,talent:e.int(55,80),skin:e.pick(xt),hand:e.chance(.65)?"L":"R",coachability:u,influence:c,fans:Array.from({length:e.int(1,8)},(p,g)=>`${h.id}-${r}-fan-${g}`),offsets:{speed:e.int(-8,8),shot:e.int(-8,8),pass:e.int(-8,8),hands:e.int(-8,8),check:e.int(-10,10),stamina:e.int(-8,8),reflex:e.int(-6,6),position:e.int(-6,6)}})}return o},ve=new Map,_t=h=>(ve.has(h)||ve.set(h,$t(P(h))),ve.get(h)),Mt=(h,e)=>{const t=we(h.talent+St(h.curve,e),25,99),s={};for(const i of Object.keys(h.offsets))s[i]=we(t+h.offsets[i],20,99);return s.overall=t,s.coachability=h.coachability,s.influence=h.influence,s};/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */const U={tripping:{id:"tripping",label:"Tripping",minutes:2,signal:"Strikes the leg below the knee",explain:"Using your stick, knee or foot to make another player fall."},hooking:{id:"hooking",label:"Hooking",minutes:2,signal:"Tugs both arms toward the body",explain:"Using the blade of your stick to pull or hold back another player."},slashing:{id:"slashing",label:"Slashing",minutes:2,signal:"Chops one forearm across the other",explain:"Swinging your stick at another player, even if you only hit their stick or gloves."},holding:{id:"holding",label:"Holding",minutes:2,signal:"Grabs one wrist",explain:"Grabbing another player or their stick to slow them down."},interference:{id:"interference",label:"Interference",minutes:2,signal:"Crosses arms in front of the chest",explain:"Hitting, holding or blocking a player who does not have the puck."},"high-sticking":{id:"high-sticking",label:"High-sticking",minutes:2,signal:"Holds both fists up, one above the other",explain:"Carrying your stick above your shoulders and making contact with another player."},"cross-checking":{id:"cross-checking",label:"Cross-checking",minutes:2,signal:"Pushes both fists forward from the chest",explain:"Hitting another player with the shaft of your stick held in both hands."},roughing:{id:"roughing",label:"Roughing",minutes:2,signal:"Extends a clenched fist to the side",explain:"Extra pushing, shoving or punching, usually after the whistle."},"body-checking":{id:"body-checking",label:"Body checking",minutes:2,signal:"Pats the chest with a closed fist",explain:"Body checking is not allowed until 14U. Younger players learn body contact and angling first, so they are ready for it."},fighting:{id:"fighting",label:"Fighting",minutes:0,ejection:!0,signal:"Throws a punch in the air",explain:"Dropping the gloves earns a game misconduct: you are done for the night."}},Tt=[{id:"hooking",weight:4},{id:"slashing",weight:3},{id:"tripping",weight:3},{id:"holding",weight:1},{id:"high-sticking",weight:1}],jt=[{id:"interference",weight:3},{id:"holding",weight:3},{id:"hooking",weight:2},{id:"high-sticking",weight:1}],Et=(h,e,t)=>{const s=t.rng,i=h.strictness*2,n=r=>h.penalties&&s.chance(Math.min(.95,r*i));let a=null,o=0;return e==="poke"?s.chance(.025)&&(a="slashing",o=.2):e==="stick"?t.onCarrier?s.chance(.3)&&(a=s.weighted(Tt).id,o=.5):(a=s.weighted(jt).id,o=.45):e==="check"&&(h.checking?t.onCarrier?t.fromBehind?(a="cross-checking",o=.35):s.chance(.05)&&(a="roughing",o=.5):(a="interference",o=.6):(a="body-checking",o=.8)),{infraction:a,called:!!a&&n(o)}};/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */const Se=(h,e)=>h.slice().sort((t,s)=>e(s)-e(t))[0],He=[{id:"bribe",weight:3,subject:h=>Se(h.skaters(),e=>e.player.influence),title:"A parent wants a word",body:h=>`${h.player.first} ${h.player.last}'s parent slides you an envelope. "Just make sure #${h.player.number} gets more ice time. Power play. Every shift. You understand."`,choices:[{label:"Take the envelope",result:h=>`#${h.player.number} is double-shifting now. Watch the legs go, and listen to the crowd.`,apply:(h,e,t)=>{t.doubleShift=!0,t.exposure+=25,h.crowd.mood-=.3}},{label:"Ice time is earned",result:()=>"The envelope goes back. The bench notices, and so do the stands.",apply:h=>{h.crowd.mood+=.1}}]},{id:"interview",weight:3,subject:h=>Se(h.skaters(),e=>e.stats.goals*3+e.stats.assists+e.player.influence/50),title:"Mid-game interview",body:h=>`The local stream catches #${h.player.number} ${h.player.first} in the hallway. "I just want to thank my grandparents for the new bike they bought me for my hat trick last game..."`,choices:[{label:"Keep talking about the bike",result:()=>"Exposure up. Somewhere a parent is already clipping this for an agent.",apply:(h,e,t)=>{t.exposure+=15,e.chemistry-=.05}},{label:'"...and my teammates set me up!"',result:()=>"The whole bench heard that. Watch the puck move.",apply:(h,e,t)=>{t.exposure=Math.max(0,t.exposure-10),e.chemistry+=.15}}]},{id:"showcase",weight:2,subject:h=>Se(h.skaters(),e=>e.player.influence+(e.player.curve==="early"?30:0)),title:"The Elite Showcase package",body:h=>`A man in a quarter-zip hands ${h.player.first}'s parent a brochure: Elite Showcase, $4,800, "maximum exposure to scouts." They look at you. "Should we?"`,choices:[{label:"Buy the package",result:h=>`#${h.player.number} now plays for the cameras. Passing is for other people.`,apply:(h,e,t)=>{t.exposure+=30}},{label:"Save it for summer camp",result:h=>`#${h.player.number} relaxes, and it shows.`,apply:(h,e,t)=>{t.exposure=Math.max(0,t.exposure-10),t.boost+=4}}]},{id:"stands",weight:2,subject:()=>null,title:"Trouble in the stands",body:()=>"Two sets of parents are going at it over a missed offsides call. The kids are looking up from the bench.",choices:[{label:"Ask them to settle down",result:()=>"The rink manager walks over. Things cool off.",apply:h=>{h.crowd.mood+=.1,h.crowd.fightRate*=.5}},{label:"Not my problem",result:()=>"It is a little bit your problem. The next one comes sooner.",apply:h=>{h.crowd.mood-=.2,h.crowd.fightRate*=2}}]},{id:"oranges",weight:2,subject:()=>null,title:"Orange slices!",body:()=>"The grandparents brought orange slices for everyone. Nobody is talking about scouts. Somebody is doing an orange-peel smile.",choices:[{label:"Just have fun out there",result:()=>"Fresh legs, big smiles, and the puck starts moving.",apply:(h,e)=>{e.skaters().forEach(t=>{t.stamina=1}),e.chemistry+=.1,h.crowd.mood+=.1}}]}];/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */const ne=(h,e,t)=>Math.max(e,Math.min(t,h)),j=(h,e)=>Math.hypot(h.x-e.x,h.y-e.y),H=(h,e,t,s)=>{const i=e-h.x,n=t-h.y;return{vx:i*(s||2.4),vy:n*(s||2.4)}},Q=(h,e)=>({x:h.cx,y:h.lineY+h.mouth*e}),We=(h,e,t)=>{const s=t.x-e.x,i=t.y-e.y,n=s*s+i*i||1,a=ne(((h.x-e.x)*s+(h.y-e.y)*i)/n,0,1);return Math.hypot(h.x-(e.x+s*a),h.y-(e.y+i*a))},Rt=(h,e)=>{const t=h.rules.surface,s=h.puck,i=h.ownNetFor(e.side),n=i.cx,a=s.x-n,o=s.y-i.lineY,r=Math.hypot(a,o)||1,l=ne(1.4+e.rating.position/100*2.4,1.4,4);let d=n+a/r*l,c=i.lineY+o/r*l;return(c-i.lineY)*i.mouth<.8&&(c=i.lineY+i.mouth*.8),d=ne(d,i.x0-1.5,i.x1+1.5),t.width<0?{vx:0,vy:0}:H(e,d,c,7)},oe=(h,e,t)=>{const s=h.rules.surface,i=e.attackDir(),n=i<0?s.blueLines:s.length-s.blueLines;return i<0?t<n:t>n},Ke=(h,e,t,s)=>{if(!h.rules.offsides||!t.discipline)return s;const i=h.puck;if(oe(h,e,i.y))return s;const n=h.rules.surface,a=e.attackDir(),o=a<0?n.blueLines:n.length-n.blueLines;return oe(h,e,s.y)&&(s.y=o-a*2),s},ee=(h,e)=>h.clampToRink(e.x,e.y,1.5),Ot=(h,e,t,s)=>{const i=h.teams[h.other(e.side)].onIceSkaters();let n=null,a=.25;const o=j(e,Q(s,4));for(const r of t.onIceSkaters()){if(r===e||r.stun>0)continue;const l=Math.min(15,Math.min(...i.map(g=>j(g,r)).concat([15]))),d=Math.min(...i.map(g=>We(g,e,r)).concat([10])),c=(o-j(r,Q(s,4)))/30,u=j(e,r);let p=l/15+c+(d<2.5?-.8:0)-(u>60?.4:0)+t.chemistry;h.rules.offsides&&oe(h,t,r.y)&&!oe(h,t,e.y)&&(p-=1),p>a&&(a=p,n=r)}return n},Ct=(h,e,t,s)=>{const i=h.rng,n=h.netFor(e.side),a=h.teams[h.other(e.side)].onIceSkaters(),o=e.rating.coachability,r=j(e,{x:n.cx,y:n.lineY}),l=(e.y-n.lineY)*n.mouth>1.5,d=l&&Math.abs(e.x-n.cx)<r*.85,c=Math.min(...a.map(f=>j(f,e)).concat([99]));if(s){const f=(10+20*h.rules.speed)*(.8+e.rating.shot/260),b=h.time-(e.heldSince||0);if(d&&r<f&&b>.45){let x=.06+e.rating.shot/700+(r<f*.5?.16:0)+(c<4?.06:0);const $={x:n.cx,y:n.lineY};if(a.some(_=>We(_,e,$)<1.8&&j(_,e)<r)&&(x*=.3),i.chance(x))return h.shoot(e,0),{vx:e.vx,vy:e.vy}}let y=(.2+o*.0035+t.chemistry)*(1-e.exposure/100*.8);if(c<6&&(y*=1.8),e.stamina<.35&&(y*=1.3),i.chance(ne(y,0,.95)*.55)){const x=Ot(h,e,t,n);if(x)return h.pass(e,x),{vx:e.vx,vy:e.vy}}if(h.rules.faceoffs&&c<4.5){const x=h.ownNetFor(e.side);if(j(e,Q(x,0))<40&&i.chance(.05))return h.dump(e),{vx:e.vx,vy:e.vy}}}let u=Q(n,Math.max(5,Math.min(12,r*.3)));l||(u={x:e.x<n.cx?n.x0-6:n.x1+6,y:n.lineY+n.mouth*8});const p=a.filter(f=>j(f,e)<10).sort((f,b)=>j(f,e)-j(b,e))[0];if(p){const f=p.x>e.x?-1:1;u={x:u.x+f*8,y:u.y}}const g=ee(h,u);return H(e,g.x,g.y,4)},$e=(h,e)=>{const t=h.rules.surface,s=e.ownNetY(),i=e.attackDir(),n=Math.abs(e.targetNetY()-s),a=t.blueLines?n-(t.blueLines-t.goalLine):n*.5;return{W:t.width,length:n,oz:a,dz:n-a,u:o=>(o-s)*i,y:o=>s+i*o}},Ve=h=>h.role==="LD"||h.role==="RD"||h.role==="D",_e=(h,e,t,s,i)=>{const n=$e(h,e),a=n.W,o=n.u(i.y),r=i.x<a/2,l=t.role||"C";let d=a/2,c=o;return s==="attack"?o>n.oz-4?l==="LD"?[d,c]=[a*.25,n.oz+4]:l==="RD"?[d,c]=[a*.75,n.oz+4]:l==="D"?[d,c]=[a*.5,n.oz+4]:l==="C"?[d,c]=[a*.5,n.length-20]:l==="LW"===r||l==="W"&&t.uid%2===0?[d,c]=[r?a*.16:a*.84,n.length-24]:[d,c]=[a/2+(r?4:-4),n.length-7]:(l==="LW"?[d,c]=[a*.12,o+22]:l==="RW"?[d,c]=[a*.88,o+22]:l==="W"?[d,c]=[r?a*.85:a*.15,o+22]:l==="C"?[d,c]=[a*.5,o+12]:l==="LD"?[d,c]=[a*.3,o-16]:l==="RD"?[d,c]=[a*.7,o-16]:[d,c]=[a*.5,o-16],c=Math.max(6,c)):o<n.dz+6?!h.rules.goalies&&(l==="D"||l==="LD"===r)?[d,c]=[a*.5,3]:l==="LD"?[d,c]=[a*.38,9]:l==="RD"?[d,c]=[a*.62,9]:l==="D"?[d,c]=[a*.5,8]:l==="C"?[d,c]=[a*.5,18]:l==="LW"?[d,c]=[a*.25,n.dz-4]:l==="RW"?[d,c]=[a*.75,n.dz-4]:[d,c]=[r?a*.75:a*.25,n.dz-4]:Ve(t)?(d=l==="LD"?a*.32:l==="RD"?a*.68:a*.5,c=Math.max(8,o-18)):(d=l==="LW"?a*.28:l==="RW"?a*.72:a*.5,c=Math.max(12,o-8)),{x:d,y:n.y(c)}},Me=(h,e,t,s)=>{let i=0,n=0;for(const a of e.onIceSkaters()){if(a===t)continue;const o=s.x-a.x,r=s.y-a.y,l=Math.hypot(o,r);l>0&&l<9&&(i+=o/l*(9-l),n+=r/l*(9-l))}return{x:s.x+i*.6,y:s.y+n*.6}},It=(h,e,t,s)=>{let i=_e(h,t,e,"attack",s);!e.discipline&&e.rating.coachability<45&&(i={x:(i.x+s.x)/2,y:(i.y+s.y)/2}),i.x+=Math.sin(h.time*1.3+e.uid)*2,i=Me(h,t,e,i),i=Ke(h,t,e,i);const n=ee(h,i);return H(e,n.x,n.y,2.2)},Pt=(h,e,t,s)=>{const i=h.rng,n=h.puck.carrier,a=h.teams[h.other(e.side)],o=h.ownNetFor(e.side),r=Q(o,4),l=e.rating.coachability,d=t.onIceSkaters().slice().sort((f,b)=>j(f,n)-j(b,n)),c=!e.discipline&&h.rules.ageIndex<=1&&l<55;if(d[0]===e||c){const f=r.x-n.x,b=r.y-n.y,y=Math.hypot(f,b)||1,x=j(e,n);if(s&&x<4){const $=h.fromBehind(e,n),_=h.rules.checking?.04+e.rating.check/900:(100-l)/9e3,R=.012+(100-l)/4500+($?.02:0),O=.12+.18*h.rules.ai,F=i.next(),B=!$||i.chance((100-l)/500),k=h.time>=(e.nextStickAt||0);F<_?x<3.3&&B&&h.bodyCheck(e,n):F<_+R?k&&(h.stickPlay(e,n),e.nextStickAt=h.time+10+l/6):F<_+R+O&&h.pokeCheck(e)}return H(e,n.x+f/y*2,n.y+b/y*2,4)}let u=_e(h,t,e,"defend",n);const p=a.onIceSkaters().filter(f=>f!==n).slice().sort((f,b)=>j(f,u)-j(b,u))[0];p&&j(p,u)<22&&(u={x:u.x+(p.x+(r.x-p.x)*.35-u.x)*.55,y:u.y+(p.y+(r.y-p.y)*.35-u.y)*.55},s&&j(e,p)<3&&h.time>=(e.nextStickAt||0)&&i.chance((100-l)/4e5)?(h.stickPlay(e,p),e.nextStickAt=h.time+10+l/6):s&&j(e,p)<3&&h.rules.checking&&i.chance((100-l)/12e3)&&h.bodyCheck(e,p));const g=ee(h,Me(h,t,e,u));return H(e,g.x,g.y,2.4)},At=(h,e,t)=>{const s=h.puck,i=t.onIceSkaters().slice().sort((g,f)=>j(g,s)-j(f,s)).indexOf(e),n=!e.discipline&&e.rating.coachability<50,a=$e(h,t),o=a.u(s.y),r=o>a.oz-10&&o<a.oz+8,l=s.vy*t.attackDir()<0,d=Ve(e)&&r&&l&&i<=1&&(e.role==="LD"==s.x<a.W/2||e.role==="D");if(i===0||d||i===1&&n||h.rules.ageIndex===0&&n){const g=ee(h,{x:s.x+s.vx*.3,y:s.y+s.vy*.3});return H(e,g.x,g.y,5)}const c=s.lastTouch&&s.lastTouch.side===e.side;let u=_e(h,t,e,c?"attack":"defend",s);u=Me(h,t,e,u),c&&(u=Ke(h,t,e,u));const p=ee(h,u);return H(e,p.x,p.y,2.4)},Lt=(h,e,t)=>{const s=h.rng,i=h.teams[e.side],n=h.puck;e.aiTimer-=t;const a=e.aiTimer<=0;a&&(e.aiTimer=.32-.18*h.rules.ai+s.range(0,.08),s.chance(.12)&&(e.discipline=s.chance(.45+e.rating.coachability/180)));const o=n.carrier;if(o===e)return Ct(h,e,i,a);if(!h.rules.goalies&&(e.role==="LD"||e.role==="D")){const r=$e(h,i);if(!(o&&o.side===e.side||!o&&n.lastTouch&&n.lastTouch.side===e.side)&&r.u(n.y)<r.length*.55&&j(e,n)>6){const l=h.ownNetFor(e.side),d={x:l.cx+(n.x-l.cx)*.1,y:l.lineY+l.mouth*2};return H(e,d.x,d.y,4)}}return o&&o.side===e.side?It(h,e,i,o):o?Pt(h,e,i,a):At(h,e,i)};/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */const re={zamboni:{id:"zamboni",name:"Zed the Zamboni Driver",first:"Zed",last:"Zamboni",number:0,blurb:"Has been resurfacing this ice since 1987. Shoots like a cannon, skates like a Zamboni.",look:{jersey:"#ff7a1a",trim:"#f2f2f2",helmet:"#3a3a3a",skin:"#d5ab88",scale:1.15},ratings:{speed:55,shot:99,pass:70,hands:75,check:99,stamina:99,reflex:50,position:50}},grandma:{id:"grandma",name:"Grandma Pucksworth",first:"Grandma",last:"Pucksworth",number:88,blurb:"Brought orange slices. Sees the whole ice. Passes like a dream, skates like a grandma.",look:{helmet:"#d9d9e0",skin:"#f3d2a2",scale:.95},ratings:{speed:45,shot:75,pass:99,hands:99,check:30,stamina:70,reflex:50,position:50}},sasquatch:{id:"sasquatch",name:"The Sasquatch",first:"The",last:"Sasquatch",number:99,blurb:"Showed up at tryouts. Nobody asked for a birth certificate.",look:{jersey:"#6b4423",trim:"#3d2614",helmet:"#6b4423",skin:"#6b4423",pants:"#3d2614",scale:1.4},ratings:{speed:85,shot:92,pass:60,hands:70,check:99,stamina:99,reflex:50,position:50}},mascot:{id:"mascot",name:"Sparky the Mascot",first:"Sparky",last:"Mascot",number:1,blurb:"The suit is very warm. Sparky is very fast. Nobody knows who is in there.",look:{helmet:"#ff3fa4",skin:"#ffde46",bigHead:!0,scale:1.05},ratings:{speed:99,shot:70,pass:80,hands:85,check:40,stamina:60,reflex:50,position:50}}},he={"gold-stick":{id:"gold-stick",name:"Golden sticks",blurb:"$400 each. The parents insisted. Harder shots, crisper passes.",bonus:{shot:15,pass:10},stick:"#f2c94c"},"rocket-skates":{id:"rocket-skates",name:"Rocket skates",blurb:"Custom molded, heat treated, possibly jet powered.",bonus:{speed:18}},"wood-stick":{id:"wood-stick",name:"Wooden sticks",blurb:"Like Grandpa used. Soft hands, heavy shots, unbreakable.",bonus:{hands:12,shot:5},stick:"#c28a4a",unbreakable:!0}},Xe={"big-heads":{id:"big-heads",name:"Big heads",blurb:"Everyone gets a giant head. Just like the parents."},"pink-ice":{id:"pink-ice",name:"Pink ice",blurb:"The Sparkle Selects booster club paid for it."},"fire-puck":{id:"fire-puck",name:"Puck on fire",blurb:"Score twice in a row and the puck catches fire."},"tiny-goalies":{id:"tiny-goalies",name:"Tiny goalies",blurb:"Goalies shrink to the size of a mite. Goals for everyone."}},Je={ZAMBONI:{type:"guest",id:"zamboni"},GRANDMA:{type:"guest",id:"grandma"},BIGFOOT:{type:"guest",id:"sasquatch"},SPARKY:{type:"guest",id:"mascot"},GOLDSTICK:{type:"equipment",id:"gold-stick"},ROCKETS:{type:"equipment",id:"rocket-skates"},OLDSCHOOL:{type:"equipment",id:"wood-stick"},BIGHEADS:{type:"modifier",id:"big-heads"},PINKICE:{type:"modifier",id:"pink-ice"},ONFIRE:{type:"modifier",id:"fire-puck"},TINYGOALIE:{type:"modifier",id:"tiny-goalies"}},Te=["up","up","down","down","left","right","left","right","check","stick"],Ft=h=>String(h||"").toUpperCase().replace(/[^A-Z0-9]/g,""),zt=h=>Je[Ft(h)]||null,Ze=h=>`${h.type}:${h.id}`,je=Object.values(Je).map(Ze),Qe=h=>{const[e,t]=h.split(":"),s=(e==="guest"?re:e==="equipment"?he:Xe)[t];return s?Object.assign({type:e,key:h},s):null},A=(h,e,t)=>Math.max(e,Math.min(t,h)),C=(h,e)=>Math.hypot(h.x-e.x,h.y-e.y),Ee=1.2,Bt=2.1;let et=class{constructor(e,t,s,i){this.game=e,this.side=t,this.def=P(s),this.kitName=i,this.kit=this.def.kits[i]||this.def.kits.home,this.score=0,this.shots=0,this.chemistry=0,this.box=[],this.lineIndex=0,this.lineTime=0;const n=e.rules.ageIndex;this.entities=_t(s).map(a=>({uid:++e.uidCounter,id:a.id,side:t,player:a,rating:Mt(a,n),isGoalie:a.goalie,x:0,y:0,vx:0,vy:0,dir:t==="home"?-Math.PI/2:Math.PI/2,onIce:!1,inBox:!1,ejected:!1,stun:0,slow:0,fighting:!1,stamina:1,exposure:a.influence,boost:0,doubleShift:!1,aiTimer:0,cooldown:{pass:0,shot:0,poke:0,stick:0,check:0,pickup:0},discipline:!0,controller:null,stats:{goals:0,assists:0,shots:0,passes:0,hits:0,pim:0,toi:0,touches:0,possession:0}})),this.applyLoadout(e),this.goalie=this.entities.find(a=>a.isGoalie),this.goalie.onIce=e.rules.goalies}applyLoadout(e){const t=e.opts.loadout&&e.opts.loadout[this.side]||{},s=e.rules.boost||0,i=t.equipment?he[t.equipment]:null;this.equipment=i;const n=["speed","shot","pass","hands","check","stamina","reflex","position"];for(const o of this.entities)for(const r of n){let l=o.rating[r]+(o.isGoalie?0:s);i&&i.bonus[r]&&!o.isGoalie&&(l+=i.bonus[r]),o.rating[r]=A(l,20,99)}const a=t.guest?re[t.guest]:null;if(a){const o=this.entities.find(r=>r.player.position==="F");o.guest=a.id,o.look=a.look,o.player=Object.assign({},o.player,{first:a.first,last:a.last,name:a.name,number:a.number,skin:a.look.skin||o.player.skin,influence:0,coachability:99,curve:"steady"}),o.rating=Object.assign({coachability:99,influence:0,overall:95},a.ratings),o.exposure=0,o.doubleShift=!0}}assignRoles(){const e=this.onIceSkaters(),t=e.length>=4?2:1,s=e.filter(o=>o.player.position==="D"),i=e.filter(o=>o.player.position!=="D");for(;s.length>t;)i.push(s.pop());for(;s.length<t&&i.length>1;)s.push(i.pop());const n=i.length===1?["C"]:i.length===2?["C","W"]:["C","LW","RW","W","W"],a=s.length===1?["D"]:["LD","RD","D"];i.forEach((o,r)=>{o.role=n[r]||"W"}),s.forEach((o,r)=>{o.role=a[r]||"D"})}skaters(){return this.entities.filter(e=>!e.isGoalie&&!e.ejected)}onIceSkaters(){return this.entities.filter(e=>!e.isGoalie&&e.onIce)}available(){return this.skaters().filter(e=>!e.inBox)}strength(){const e=this.game.rules.skaters,t=Math.min(2,this.box.filter(s=>!U[s.type].ejection).length);return Math.max(1,Math.min(e-t,this.available().length))}attackDir(){const e=this.game.period%2===1;return this.side==="home"===e?-1:1}targetNetY(){const e=this.game.rules.surface;return this.attackDir()<0?e.goalLine:e.length-e.goalLine}ownNetY(){const e=this.game.rules.surface;return this.attackDir()<0?e.length-e.goalLine:e.goalLine}changeLine(e){const t=this.strength(),s=this.available();if(s.length===0)return;const i=this.onIceSkaters(),n=i.map(u=>({x:u.x,y:u.y,vx:u.vx,vy:u.vy,dir:u.dir}));i.forEach(u=>{u.onIce=!1});const a=s.filter(u=>u.doubleShift),o=s.filter(u=>!u.doubleShift),r=a.slice(0,t),l=Math.max(1,Math.ceil(o.length/t));this.lineIndex=(this.lineIndex+1)%l;let d=this.lineIndex*t;for(;r.length<t&&o.length>0;){const u=o[d%o.length];if(r.includes(u)||r.push(u),d++,d>this.lineIndex*t+o.length*2)break}r.forEach((u,p)=>{u.onIce=!0,e&&n[p]?Object.assign(u,n[p]):e&&this.game.placeAtBench(u)}),this.lineTime=0,this.assignRoles();const c=this.game.puck;c.carrier&&!c.carrier.onIce&&this.game.loosePuck(0,0),this.game.reassignControllers()}fillToStrength(){const e=this.strength();let t=this.onIceSkaters();const s=this.available().filter(i=>!i.onIce);for(;t.length<e&&s.length>0;){const i=s.shift();i.onIce=!0,this.game.placeAtBench(i),t=this.onIceSkaters()}for(;t.length>e;){const i=t.pop();i.onIce=!1,this.game.puck.carrier===i&&this.game.loosePuck(0,0)}this.assignRoles(),this.game.reassignControllers()}};class tt{constructor(e={}){this.opts=e,this.rules=xe(e.level||"8U",e),this.rng=ae(e.seed||`game:${e.home}:${e.away}:${e.level}`),this.events=[],this.time=0,this.period=1,this.clock=this.rules.periodSeconds,this.phase="faceoff",this.phaseTimer=1,this.crowd={mood:.6,fightRate:1},this.pending=[],this.intermission=null,this.result=null,this.buzzerTimer=this.rules.buzzer,this.nextRestart=null,this.fight=null,this.controllers=Object.assign({},e.controllers||{}),this.uidCounter=0,this.modifiers=e.loadout&&e.loadout.modifiers||[],this.playTime=0,this.stickBreakAt=this.rng.range(.15,.85)*this.rules.periods*this.rules.periodSeconds,this.stickBroken=!1,this.control={};const t=e.homeKit||"home";let s=e.awayKit||"away";this.teams={home:new et(this,"home",e.home||"sparkle-selects",t),away:new et(this,"away",e.away||"jesus-selects",s)},this.puck={x:0,y:0,z:0,vx:0,vy:0,vz:0,carrier:null,shot:null,pass:null,icing:null,lastTouch:null,chain:[],prevY:0};for(const i of["home","away"])this.teams[i].changeLine(!1);this.startFaceoff(this.centerDot())}emit(e,t){this.events.push(Object.assign({type:e,t:this.time,period:this.period,clock:this.clock},t||{}))}drainEvents(){const e=this.events;return this.events=[],e}other(e){return e==="home"?"away":"home"}allOnIce(){return[...this.teams.home.entities,...this.teams.away.entities].filter(e=>e.onIce)}findEntity(e){return[...this.teams.home.entities,...this.teams.away.entities].find(t=>t.uid===e)}centerDot(){const e=this.rules.surface;return{x:e.width/2,y:e.length/2}}clampToRink(e,t,s){const i=this.rules.surface,n=i.cornerRadius,a=i.width,o=i.length;let r=0,l=0,d=!1;const c=A(e,n,a-n),u=A(t,n,o-n);if((e<n||e>a-n)&&(t<n||t>o-n)){const p=e-c,g=t-u,f=Math.hypot(p,g),b=n-s;f>b&&(r=-p/f,l=-g/f,e=c+p/f*b,t=u+g/f*b,d=!0)}else e<s?(e=s,r=1,d=!0):e>a-s&&(e=a-s,r=-1,d=!0),t<s?(t=s,l=1,d=!0):t>o-s&&(t=o-s,l=-1,d=!0);return{x:e,y:t,nx:r,ny:l,hit:d}}nets(){const e=this.rules.surface,t=this.rules.net.width,s=this.rules.net.depth,i=e.width/2;return[{id:"top",cx:i,lineY:e.goalLine,x0:i-t/2,x1:i+t/2,y0:e.goalLine-s,y1:e.goalLine,mouth:1},{id:"bottom",cx:i,lineY:e.length-e.goalLine,x0:i-t/2,x1:i+t/2,y0:e.length-e.goalLine,y1:e.length-e.goalLine+s,mouth:-1}]}attackerOfNet(e){const t=this.teams.home.attackDir()<0;return e.id==="top"?t?"home":"away":t?"away":"home"}zoneDots(e,t){const s=this.rules.surface,i=this.teams[e],n=t==="defensive"?i.ownNetY():i.targetNetY(),a=n<s.length/2?1:-1,o=Math.min(20,s.length*.2),r=Math.min(22,s.width*.26),l=this.puck.x<s.width/2?-1:1;return{x:s.width/2+l*r,y:n+a*o}}placeAtBench(e){const t=this.rules.surface;e.x=3,e.y=t.length/2+(e.side==="home"?-6:6),e.vx=0,e.vy=0}startFaceoff(e){const t=this.rules.surface;this.phase="faceoff",this.phaseTimer=.9,this.nextRestart=null;const s=this.puck;s.carrier=null,s.shot=null,s.pass=null,s.icing=null,s.x=e.x,s.y=e.y,s.prevY=e.y,s.z=0,s.vx=0,s.vy=0,s.vz=0,this.faceoffDot=e;for(const i of["home","away"]){const n=this.teams[i],a=n.attackDir(),o=n.onIceSkaters(),r=[{x:0,y:2.5},{x:-14,y:5},{x:14,y:5},{x:-10,y:16},{x:10,y:16}];o.forEach((l,d)=>{const c=r[d%r.length],u=this.clampToRink(e.x+c.x,e.y-a*c.y,3);l.x=u.x,l.y=u.y,l.vx=0,l.vy=0,l.dir=a<0?-Math.PI/2:Math.PI/2,l.stun=0,l.slow=0}),this.placeGoalie(n)}this.emit("faceoff",{x:e.x,y:e.y}),t&&this.opts.debug&&this.emit("debug",{msg:"faceoff"})}placeGoalie(e){const t=e.goalie;if(!t||!t.onIce)return;const s=this.rules.surface,i=e.ownNetY();t.x=s.width/2,t.y=i+(i<s.length/2?2.5:-2.5),t.vx=0,t.vy=0,t.stun=0}startRestart(e){const t=this.rules.surface,s=this.teams[e],i=this.teams[this.other(e)],n=s.attackDir(),a=s.ownNetY();this.phase="faceoff",this.phaseTimer=1.2,this.nextRestart=null;const o=this.puck;o.shot=null,o.pass=null,o.icing=null;const r=s.onIceSkaters(),l=Math.min(4.5,t.goalLine*.6);r.forEach((c,u)=>{if(u===0)c.x=t.width/2+5,c.y=a-n*l;else{const p=this.clampToRink(t.width*(u%2?.25:.75),a+n*(8+u*4),3);c.x=p.x,c.y=p.y}c.vx=0,c.vy=0,c.dir=n<0?-Math.PI/2:Math.PI/2}),i.onIceSkaters().forEach((c,u)=>{const p=this.clampToRink(t.width*(.2+.3*(u%3)),t.length/2+n*(4+u*3),3);c.x=p.x,c.y=p.y,c.vx=0,c.vy=0,c.dir=n<0?Math.PI/2:-Math.PI/2}),this.placeGoalie(s),this.placeGoalie(i);const d=r[0];d&&this.takePuck(d,!0),this.emit("restart",{side:e})}whistle(e,t,s){if(this.phase!=="play")return;this.phase="whistle",this.phaseTimer=1.4,this.nextRestart=t;const i=this.puck;i.carrier=null,i.shot=null,i.pass=null,i.icing=null,i.vx*=.3,i.vy*=.3,this.emit("whistle",Object.assign({reason:e},s||{})),this.assessPending(),this.rules.fights&&this.phase==="whistle"&&this.maybeFight(null,null,.2)}doRestart(){for(const t of[...this.teams.home.entities,...this.teams.away.entities])t.brokenStick&&(t.brokenStick=!1,this.emit("new-stick",{side:t.side,uid:t.uid}));const e=this.nextRestart;if(!e){this.startFaceoff(this.centerDot());return}if(!this.rules.buzzer)for(const t of["home","away"]){const s=this.teams[t],i=s.onIceSkaters(),n=i.reduce((a,o)=>a+o.stamina,0)/Math.max(1,i.length);(s.lineTime>40||n<.62)&&s.changeLine(!1)}for(const t of["home","away"])this.teams[t].fillToStrength();e.type==="restart"&&!this.rules.faceoffs?this.startRestart(e.side):e.type==="restart"?this.startFaceoff(this.zoneDots(e.side,"defensive")):this.startFaceoff({x:e.x,y:e.y})}dropPuck(){const e=this.faceoffDot,t=this.teams.home.onIceSkaters()[0],s=this.teams.away.onIceSkaters()[0];if(this.phase="play",!t||!s)return;const i=t.rating.hands+t.boost,n=s.rating.hands+s.boost,a=this.rng.chance(i/(i+n))?t:s,o=this.teams[a.side].attackDir();this.puck.x=e.x,this.puck.y=e.y,this.puck.vx=this.rng.range(-6,6),this.puck.vy=-o*this.rng.range(10,16)*this.rules.speed,this.puck.lastTouch={side:a.side,uid:a.uid,y:e.y},this.puck.chain=[a.uid],a.cooldown.pickup=.3,this.emit("faceoff-won",{side:a.side,uid:a.uid})}takePuck(e,t){const s=this.puck,i=s.lastTouch?s.lastTouch.side:null;if(s.carrier=e,s.shot=null,s.pass=null,s.icing=null,s.z=0,s.vz=0,i!==e.side&&(s.chain=[]),s.chain[s.chain.length-1]!==e.uid&&s.chain.push(e.uid),s.chain.length>3&&s.chain.shift(),s.lastTouch={side:e.side,uid:e.uid,y:e.y},e.heldSince=this.time,e.stats.touches++,t||this.emit("pickup",{side:e.side,uid:e.uid}),this.pending.some(n=>n.offender.side===e.side)){this.whistle("penalty",this.penaltyRestart());return}this.reassignControllers()}loosePuck(e,t){const s=this.puck;s.carrier&&(s.carrier.cooldown.pickup=.45,s.lastTouch={side:s.carrier.side,uid:s.carrier.uid,y:s.carrier.y}),s.carrier=null,s.vx=e,s.vy=t}netFor(e){const t=this.teams[e].targetNetY();return this.nets().find(s=>s.lineY===t)}ownNetFor(e){const t=this.teams[e].ownNetY();return this.nets().find(s=>s.lineY===t)}shoot(e,t){const s=this.puck;if(s.carrier!==e||e.cooldown.shot>0||e.brokenStick)return;const i=this.teams[e.side],n=this.netFor(e.side),a=C(e,{x:n.cx,y:n.lineY}),o=e.rating.shot+e.boost;let r=(1-o/100)*3.2+a*.035+(1-this.rules.ai)*.6;e.controller&&(r*=.55);const l=this.rules.net.width/2;let d=n.cx+(t||0)*l*.7+this.rng.range(-1,1)*(l*.55+r);const c=Math.abs(d-n.cx)<l-.25,u=n.lineY-n.mouth*1.5,p=d-s.x,g=u-s.y,f=Math.hypot(p,g)||1,b=(55+o*.45)*this.rules.speed;this.loosePuck(p/f*b,g/f*b),s.vz=this.rng.range(2,8),s.shot={uid:e.uid,side:e.side,power:b,rating:o,from:a,rolled:!1,onTarget:c,human:!!e.controller},this.setIcingWatch(e),e.cooldown.shot=.6,e.cooldown.pickup=.35,c&&(e.stats.shots++,i.shots++),this.emit("shot",{side:e.side,uid:e.uid,onTarget:c,distance:Math.round(a)})}pass(e,t){const s=this.puck;if(s.carrier!==e||e.cooldown.pass>0||!t||e.brokenStick)return;const i=C(e,t),n=A(i*2.4+16,22,(38+(e.rating.pass+e.boost)*.32)*Math.sqrt(this.rules.speed)),a=i/n,o=(1-(e.rating.pass+e.boost)/100)*4+(1-this.rules.ai)*1.5,r=t.x+t.vx*a+this.rng.range(-o,o),l=t.y+t.vy*a+this.rng.range(-o,o),d=this.clampToRink(r,l,2),c=d.x-s.x,u=d.y-s.y,p=Math.hypot(c,u)||1;this.loosePuck(c/p*n,u/p*n),s.pass={from:e.uid,to:t.uid,side:e.side},this.setIcingWatch(e),e.cooldown.pass=.45,e.cooldown.pickup=.4,e.stats.passes++,this.emit("pass",{side:e.side,uid:e.uid,to:t.uid})}dump(e){const t=this.puck;if(t.carrier!==e)return;const s=this.rules.surface,i=this.teams[e.side],n=i.targetNetY()-i.attackDir()*(this.rng.chance(.5)?8:-2),a=(e.x<s.width/2?s.width-6:6)-t.x,o=n-t.y,r=Math.hypot(a,o)||1,l=(62+e.rating.shot*.4)*this.rules.speed;this.loosePuck(a/r*l,o/r*l),this.setIcingWatch(e),e.cooldown.pickup=.4,this.emit("dump",{side:e.side,uid:e.uid})}setIcingWatch(e){const t=this.puck;if(!this.rules.icing)return;const s=this.rules.surface,i=this.teams[e.side],n=i.attackDir()<0?e.y>s.length/2:e.y<s.length/2,a=i.strength()<this.teams[this.other(e.side)].strength();t.icing=n&&!a?{side:e.side}:null}nearestOpponent(e,t){let s=null,i=t;for(const n of this.teams[this.other(e.side)].onIceSkaters()){const a=C(e,n);a<i&&!n.fighting&&(i=a,s=n)}return s}fromBehind(e,t){const s=Math.cos(t.dir),i=Math.sin(t.dir),n=e.x-t.x,a=e.y-t.y,o=Math.hypot(n,a)||1;return(s*n+i*a)/o<-.5}pokeCheck(e){if(e.cooldown.poke>0||e.brokenStick)return;e.cooldown.poke=.7;const t=this.puck.carrier;if(this.emit("poke",{side:e.side,uid:e.uid}),!t||t.side===e.side||C(e,t)>4)return;const s=A(.32+(e.rating.hands-t.rating.hands)*.004,.1,.6);if(this.rng.chance(s)){const i=e.x-t.x,n=e.y-t.y;this.loosePuck(i*2+this.rng.range(-6,6),n*2+this.rng.range(-6,6)),this.emit("poked",{side:e.side,uid:e.uid,from:t.uid})}this.judge(e,"poke",t)}stickPlay(e,t){if(e.cooldown.stick>0||e.brokenStick)return;e.cooldown.stick=.9;const s=t&&C(e,t)<4.5?t:this.nearestOpponent(e,4.5);this.emit("stick",{side:e.side,uid:e.uid,target:s?s.uid:null}),s&&(this.puck.carrier===s?(s.slow=.5,this.rng.chance(.5)&&(this.loosePuck(s.vx*.4+this.rng.range(-8,8),s.vy*.4+this.rng.range(-8,8)),this.emit("poked",{side:e.side,uid:e.uid,from:s.uid}))):s.slow=1,this.judge(e,"stick",s))}bodyCheck(e,t){if(e.cooldown.check>0)return;e.cooldown.check=1.1;const s=t&&C(e,t)<3.4?t:this.nearestOpponent(e,3.4);if(!s){e.vx+=Math.cos(e.dir)*6,e.vy+=Math.sin(e.dir)*6,this.emit("whiff",{side:e.side,uid:e.uid});return}const i=this.puck.carrier===s,n=this.fromBehind(e,s),a=(.6+e.rating.check/100)*10*this.rules.speed,o=s.x-e.x,r=s.y-e.y,l=Math.hypot(o,r)||1;s.vx+=o/l*a,s.vy+=r/l*a,s.stun=.9,e.vx*=.4,e.vy*=.4,e.stats.hits++,i&&this.loosePuck(s.vx*.6+this.rng.range(-6,6),s.vy*.6+this.rng.range(-6,6));const d=this.rules.checking&&i&&!n;this.emit("hit",{side:e.side,uid:e.uid,target:s.uid,legal:d,onCarrier:i}),this.judge(e,"check",s),this.rules.fights&&this.maybeFight(e,s,.2),this.maybeStandsFight(e,s,.15)}judge(e,t,s){const i=Et(this.rules,t,{onCarrier:this.puck.carrier===s||t==="check"&&s&&this.puck.lastTouch&&this.puck.lastTouch.uid===s.uid&&!this.puck.carrier,fromBehind:s?this.fromBehind(e,s):!1,rng:this.rng});if(!i.infraction)return;if(!i.called){this.emit("missed-call",{side:e.side,uid:e.uid,victim:s?s.uid:null,penalty:i.infraction});return}const n=i.infraction;this.pending.some(a=>a.offender===e)||(this.pending.push({offender:e,type:n,victim:s?s.uid:null,at:this.time,action:t}),this.emit("delayed-penalty",{side:e.side,uid:e.uid,penalty:n,action:t,human:!!e.controller}),this.puck.carrier&&this.puck.carrier.side===e.side&&this.whistle("penalty",this.penaltyRestart()))}penaltyRestart(){const e=this.pending[0]?this.pending[0].offender.side:"home";if(this.rules.faceoffs){const t=this.zoneDots(e,"defensive");return{type:"faceoff",x:t.x,y:t.y}}return{type:"restart",side:this.other(e)}}assessPending(){if(this.pending.length!==0){for(const e of this.pending){const t=U[e.type],s=e.offender,i=this.teams[s.side];s.stats.pim+=t.minutes,t.ejection?this.eject(s):(s.inBox=!0,s.onIce=!1,i.box.push({uid:s.uid,type:e.type,remaining:this.rules.minorSeconds})),this.emit("penalty",{side:s.side,uid:s.uid,number:s.player.number,name:s.player.name,penalty:e.type,label:t.label,signal:t.signal,explain:t.explain,minutes:t.minutes}),this.maybeStandsFight(s,e.victim?this.findEntity(e.victim):null,.25)}this.pending=[];for(const e of["home","away"])this.teams[e].fillToStrength()}}eject(e){e.ejected=!0,e.onIce=!1,e.fighting=!1,this.puck.carrier===e&&this.loosePuck(0,0),this.emit("ejection",{side:e.side,uid:e.uid,number:e.player.number,name:e.player.name})}maybeFight(e,t,s){if(!this.rules.fights||this.fight||!this.rng.chance(s))return;if(!e||!t){let a=null;for(const o of this.teams.home.onIceSkaters())for(const r of this.teams.away.onIceSkaters()){const l=C(o,r);(!a||l<a.d)&&(a={a:o,b:r,d:l})}if(!a||a.d>14)return;e=a.a,t=a.b}if(e.isGoalie||t.isGoalie)return;this.fight={a:e,b:t},e.fighting=!0,t.fighting=!0;const i=(e.x+t.x)/2,n=(e.y+t.y)/2;e.x=i-1.4,t.x=i+1.4,e.y=n,t.y=n,e.vx=e.vy=t.vx=t.vy=0,(this.puck.carrier===e||this.puck.carrier===t)&&this.loosePuck(0,0),this.phase==="play"&&(this.emit("whistle",{reason:"fight"}),this.puck.shot=null,this.puck.pass=null),this.phase="fight",this.phaseTimer=3.2,this.nextRestart={type:"faceoff",x:this.centerDot().x,y:this.centerDot().y},this.emit("fight",{a:e.uid,b:t.uid,home:e.side==="home"?e.uid:t.uid})}endFight(){const{a:e,b:t}=this.fight;this.fight=null;for(const i of[e,t])i.stats.pim+=5,this.emit("penalty",{side:i.side,uid:i.uid,number:i.player.number,name:i.player.name,penalty:"fighting",label:U.fighting.label,signal:U.fighting.signal,explain:U.fighting.explain,minutes:0}),this.eject(i);const s=["home","away"].filter(i=>this.teams[i].skaters().length<2);if(s.length>0){this.endGame(s.length===2?"called-both":"called",s.length===1?this.other(s[0]):null);return}for(const i of["home","away"])this.teams[i].fillToStrength();this.doRestart()}maybeStandsFight(e,t,s){!e||!t||this.rng.chance(Math.min(.9,s*this.crowd.fightRate))&&(this.emit("stands-fight",{a:e.uid,b:t.uid}),this.crowd.mood-=.03)}breakStick(){const e=this.puck;let t=e.carrier&&!e.carrier.isGoalie?e.carrier:null;if(t||(t=this.allOnIce().filter(i=>!i.isGoalie).sort((i,n)=>C(i,e)-C(n,e))[0]),!t)return;this.stickBroken=!0;const s=this.teams[t.side];if(s.equipment&&s.equipment.unbreakable){this.emit("stick-held",{side:t.side,uid:t.uid});return}t.brokenStick=!0,e.carrier===t&&this.loosePuck(t.vx*.3+this.rng.range(-5,5),t.vy*.3+this.rng.range(-5,5)),this.emit("stick-break",{side:t.side,uid:t.uid,number:t.player.number,name:t.player.name,x:t.x,y:t.y,exposure:t.exposure})}reassignControllers(){for(const e of Object.keys(this.controllers)){const t=this.controllers[e];this.teams[t];const s=this.control[e],i=this.puck.carrier,n=Object.keys(this.control).filter(a=>a!==e).map(a=>this.control[a]);if(i&&i.side===t&&!n.includes(i)){this.setControl(e,i);continue}s&&s.onIce&&!s.ejected||this.switchPlayer(e)}}setControl(e,t){const s=this.control[e];if(s!==t){s&&(s.controller=null);for(const i of Object.keys(this.control))this.control[i]===t&&(this.control[i]=null);this.control[e]=t,t.controller=e}}switchPlayer(e){const t=this.controllers[e],s=this.teams[t],i=Object.keys(this.control).filter(r=>r!==e).map(r=>this.control[r]),n=this.puck;let a=null,o=1/0;for(const r of s.onIceSkaters()){if(i.includes(r)||r===this.control[e])continue;const l=C(r,n);l<o&&(o=l,a=r)}a||(a=s.onIceSkaters().find(r=>!i.includes(r))),a&&this.setControl(e,a)}step(e,t){if(!(this.phase==="intermission"||this.phase==="final")){if(this.time+=e,this.phaseTimer-=e,this.phase==="faceoff"){this.updateMovement(e,t,!0),this.phaseTimer<=0&&(this.puck.carrier?this.phase="play":this.dropPuck());return}if(this.phase==="whistle"||this.phase==="goal"){this.updateMovement(e,t,!0),this.updatePuck(e,!0),this.phaseTimer<=0&&this.doRestart();return}if(this.phase==="fight"){this.phaseTimer<=0&&this.endFight();return}this.clock-=e,this.playTime+=e,!this.stickBroken&&this.playTime>=this.stickBreakAt&&this.breakStick(),this.updateBox(e),this.rules.buzzer&&(this.buzzerTimer-=e,this.buzzerTimer<=0&&(this.buzzerTimer=this.rules.buzzer,this.emit("buzzer"),this.teams.home.changeLine(!0),this.teams.away.changeLine(!0)));for(const s of["home","away"])this.teams[s].lineTime+=e;this.handleInputs(t),this.updateMovement(e,t,!1),this.updatePuck(e,!1),this.pending.length&&this.time-this.pending[0].at>6&&this.whistle("penalty",this.penaltyRestart()),this.clock<=0&&this.phase==="play"&&this.endPeriod()}}updateBox(e){for(const t of["home","away"]){const s=this.teams[t];let i=!1;s.box=s.box.filter(n=>{if(n.remaining-=e,n.remaining<=0){const a=this.findEntity(n.uid);return a&&(a.inBox=!1),i=!0,this.emit("penalty-over",{side:t,uid:n.uid}),!1}return!0}),i&&s.fillToStrength()}}handleInputs(e){if(e)for(const t of Object.keys(this.controllers)){const s=e[t];let i=this.control[t];if(!(!s||(!i||!i.onIce)&&(this.switchPlayer(t),i=this.control[t],!i)||i.stun>0||i.fighting))if(this.puck.carrier===i)s.shoot?this.shoot(i,s.x):s.pass&&this.pass(i,this.pickPassTarget(i,s)),s.stick&&this.stickPlay(i);else{const n=this.puck.carrier&&this.puck.carrier.side===i.side;s.pass&&!n&&this.switchPlayer(t),s.shoot&&this.pokeCheck(i),s.check&&this.bodyCheck(i),s.stick&&this.stickPlay(i)}}}pickPassTarget(e,t){const s=this.teams[e.side];let i=t.x,n=t.y;!i&&!n&&(i=0,n=s.attackDir());const a=Math.hypot(i,n)||1;let o=null,r=-1/0;for(const l of s.onIceSkaters()){if(l===e)continue;const d=l.x-e.x,c=l.y-e.y,u=Math.hypot(d,c)||1,p=(d*i+c*n)/(u*a)*2-u/40;p>r&&(r=p,o=l)}return o}maxSpeed(e){const t=(17+(e.rating.speed+e.boost)*.13)*this.rules.speed;let s=.62+.38*e.stamina;return this.puck.carrier===e&&(s*=.92),e.slow>0&&(s*=.55),t*s}updateMovement(e,t,s){const i=this.allOnIce();for(const a of i){for(const u of Object.keys(a.cooldown))a.cooldown[u]=Math.max(0,a.cooldown[u]-e);a.stun=Math.max(0,a.stun-e),a.slow=Math.max(0,a.slow-e);let o=0,r=0,l=this.maxSpeed(a);if(a.fighting)continue;if(s&&this.phase==="faceoff"){a.vx=0,a.vy=0;continue}if(a.stun>0)a.vx*=Math.exp(-3*e),a.vy*=Math.exp(-3*e);else{let u;if(a.isGoalie)u=Rt(this,a),l=14*Math.sqrt(this.rules.speed);else if(a.controller&&t&&t[a.controller]&&!s){const b=t[a.controller];u={vx:b.x*l,vy:b.y*l}}else s?u={vx:a.vx*.5,vy:a.vy*.5}:u=Lt(this,a,e);o=u.vx,r=u.vy;const p=Math.hypot(o,r);p>l&&(o=o/p*l,r=r/p*l);const g=a.isGoalie?10:3.2,f=1-Math.exp(-g*e);a.vx+=(o-a.vx)*f,a.vy+=(r-a.vy)*f}a.x+=a.vx*e,a.y+=a.vy*e;const d=Math.hypot(a.vx,a.vy);if(d>1.2&&a.stun<=0)a.dir=Math.atan2(a.vy,a.vx);else if(a.controller&&t&&t[a.controller]){const u=t[a.controller];(u.x||u.y)&&(a.dir=Math.atan2(u.y,u.x))}if(!s&&!a.isGoalie){a.stats.toi+=e;const u=(.008+.02*(d/Math.max(1,l)))*(a.doubleShift?1.7:1)*(1.15-a.rating.stamina/200);a.stamina=A(a.stamina-u*e,.15,1)}const c=this.clampToRink(a.x,a.y,Ee);c.hit&&(a.x=c.x,a.y=c.y,c.nx&&(a.vx*=-.2),c.ny&&(a.vy*=-.2)),this.collideNets(a,Ee)}for(const a of["home","away"])for(const o of this.teams[a].entities)!o.onIce&&!o.isGoalie&&(o.stamina=A(o.stamina+.06*e,0,1));for(let a=0;a<i.length;a++)for(let o=a+1;o<i.length;o++){const r=i[a],l=i[o];if(r.fighting||l.fighting)continue;const d=l.x-r.x,c=l.y-r.y,u=Math.hypot(d,c),p=Ee*2;if(u>0&&u<p){const g=(p-u)/2;r.x-=d/u*g,r.y-=c/u*g,l.x+=d/u*g,l.y+=c/u*g}}const n=this.puck.carrier;if(n&&n.onIce){const a=n,o=this.puck;o.x=a.x+Math.cos(a.dir)*1.7,o.y=a.y+Math.sin(a.dir)*1.7;const r=this.clampToRink(o.x,o.y,.4);o.x=r.x,o.y=r.y,o.vx=a.vx,o.vy=a.vy,a.stats.possession+=e}}collideNets(e,t){for(const s of this.nets())if(e.x>s.x0-t&&e.x<s.x1+t&&e.y>s.y0-t&&e.y<s.y1+t){const i=[{d:e.x-(s.x0-t),ax:"x",v:s.x0-t},{d:s.x1+t-e.x,ax:"x",v:s.x1+t},{d:e.y-(s.y0-t),ax:"y",v:s.y0-t},{d:s.y1+t-e.y,ax:"y",v:s.y1+t}].sort((n,a)=>n.d-a.d)[0];e[i.ax]=i.v,i.ax==="x"?e.vx*=-.2:e.vy*=-.2}}updatePuck(e,t){const s=this.puck;if(s.carrier){s.prevY=s.y;return}const i=s.x,n=s.y;s.x+=s.vx*e,s.y+=s.vy*e,s.z=Math.max(0,s.z+s.vz*e),s.vz=s.z>0?s.vz-30*e:0;const a=Math.hypot(s.vx,s.vy);if(a>0){const r=Math.max(0,a*Math.exp(-.22*e)-3*e);s.vx=s.vx/a*r,s.vy=s.vy/a*r}const o=this.clampToRink(s.x,s.y,.3);if(o.hit){s.x=o.x,s.y=o.y;const r=Math.hypot(o.nx,o.ny)||1,l=o.nx/r,d=o.ny/r,c=s.vx*l+s.vy*d;c<0&&(s.vx-=1.55*c*l,s.vy-=1.55*c*d,s.vx*=.85,s.vy*=.85,Math.abs(c)>14&&this.emit("boards",{speed:Math.abs(c)}))}if(t){s.prevY=s.y;return}for(const r of this.nets()){const l=r.mouth>0?n>r.lineY&&s.y<=r.lineY:n<r.lineY&&s.y>=r.lineY,d=l?(n-r.lineY)/(n-s.y||1):0,c=i+(s.x-i)*d;if(l&&c>r.x0&&c<r.x1&&s.z<4){this.goal(r);return}s.x>r.x0-.3&&s.x<r.x1+.3&&s.y>r.y0&&s.y<r.y1&&((r.mouth>0?n>=r.lineY:n<=r.lineY)?(s.y=r.lineY+r.mouth*.4,s.vy=-s.vy*.5):i<=r.x0-.3||i>=r.x1+.3?(s.x=i,s.vx=-s.vx*.5):(s.y=n,s.vy=-s.vy*.5),s.shot&&this.emit("post",{side:s.shot.side}))}this.checkBlock(i,n),this.checkGoalie(e),this.checkPickup(),this.checkOffside(n),this.checkIcing(n),s.prevY=s.y}checkBlock(e,t){const s=this.puck,i=s.shot;if(!(!i||s.carrier||i.blocked)){i.tried||(i.tried=[]);for(const n of this.teams[this.other(i.side)].onIceSkaters()){if(n.stun>0||i.tried.includes(n.uid))continue;const a=e,o=t,r=s.x-a,l=s.y-o,d=r*r+l*l||1,c=A(((n.x-a)*r+(n.y-o)*l)/d,0,1);if(Math.hypot(n.x-(a+r*c),n.y-(o+l*c))>1.6)continue;i.tried.push(n.uid);const u=(this.rules.goalies?.3:.55)+(n.rating.position||50)/500;if(this.rng.chance(u)){i.blocked=!0,s.vx=s.vx*-.25+this.rng.range(-6,6),s.vy=s.vy*-.25+this.rng.range(-6,6),s.shot=null,s.lastTouch={side:n.side,uid:n.uid,y:n.y},this.emit("block",{side:n.side,uid:n.uid});return}}}}checkGoalie(){const e=this.puck;if(e.carrier)return;const t=this.modifiers.includes("tiny-goalies");for(const s of["home","away"]){const i=this.ownNetFor(s);let n=this.teams[s].goalie,a=!1;if(!n||!n.onIce){const c={x:i.cx,y:i.lineY+i.mouth*2};if(n=this.teams[s].onIceSkaters().filter(u=>u.stun<=0&&C(u,c)<5).sort((u,p)=>C(u,c)-C(p,c))[0],!n)continue;a=!0}const o=a?1.6:(1.8+n.rating.reflex/70)*(t?.55:1),r=C(n,e);if(r>o)continue;const l=(i.lineY-e.y)*e.vy>0,d=Math.hypot(e.vx,e.vy)>18;if(e.shot&&e.shot.side!==s&&!e.shot.rolled&&l){e.shot.rolled=!0;const c=e.shot;let u=this.rules.saveBase+(n.rating.reflex+n.rating.position-120)*.0035-(c.rating-60)*.0028+c.from*.004;c.onTarget||(u+=.25),c.human&&(u-=.12),t&&(u-=.15),a&&(u=A(.3+(n.rating.position||50)/400,.2,.6)),u=A(u,.28,.95),this.rng.chance(u)?this.save(n,c):c.beat=!0;return}if(!(e.shot&&e.shot.beat)&&!a&&!d&&r<o&&n.cooldown.pickup<=0){this.goalieTakes(n);return}}}save(e,t){const s=this.puck;e.stats.touches++,this.emit("save",{side:e.side,uid:e.uid,shooter:t.uid}),s.shot=null,s.icing=null;const i=this.teams[e.side];if(e.isGoalie&&this.rng.chance(this.rules.faceoffs?.4:.35)){this.goalieTakes(e);return}const n=i.attackDir();s.vx=this.rng.range(-14,14)*this.rules.speed,s.vy=n*this.rng.range(6,14)*this.rules.speed,s.lastTouch={side:e.side,uid:e.uid,y:e.y}}goalieTakes(e){const t=this.puck;if(t.shot=null,t.icing=null,t.lastTouch={side:e.side,uid:e.uid,y:e.y},this.rules.faceoffs){t.vx=0,t.vy=0;const l=this.zoneDots(e.side,"defensive");this.emit("freeze",{side:e.side,uid:e.uid}),this.whistle("freeze",{type:"faceoff",x:l.x,y:l.y});return}const s=this.teams[e.side].onIceSkaters();if(s.length===0)return;const i=s.reduce((l,d)=>C(l,e)<C(d,e)?l:d),n=i.x-t.x,a=i.y-t.y,o=Math.hypot(n,a)||1,r=22*Math.sqrt(this.rules.speed);t.x=e.x+n/o*2.5,t.y=e.y+a/o*2.5,t.vx=n/o*r,t.vy=a/o*r,t.pass={from:e.uid,to:i.uid,side:e.side},e.cooldown.pickup=1.2,this.emit("goalie-pass",{side:e.side})}checkPickup(){const e=this.puck;if(e.carrier||e.z>1.5)return;let t=null,s=1/0;for(const i of this.allOnIce()){if(i.isGoalie||i.stun>0||i.fighting||i.cooldown.pickup>0||i.brokenStick)continue;const n=e.pass&&e.pass.to===i.uid,a=Bt+i.rating.hands/120+(n?1:0),o=C(i,e);o>a||Math.hypot(e.vx-i.vx,e.vy-i.vy)>(n?85:55)*Math.max(.6,this.rules.speed)||o<s&&(s=o,t=i)}t&&this.takePuck(t)}checkOffside(e){if(!this.rules.offsides)return;const t=this.puck;if(!t.lastTouch)return;const s=this.rules.surface,i=t.lastTouch.side,n=this.teams[i],a=n.attackDir(),o=a<0?s.blueLines:s.length-s.blueLines;if(!(a<0?e>=o&&t.y<o:e<=o&&t.y>o))return;const r=n.onIceSkaters().find(d=>a<0?d.y<o-1:d.y>o+1);if(!r)return;const l={x:t.x<s.width/2?s.width/2-22:s.width/2+22,y:o-a*5};this.emit("offside",{side:i,uid:r.uid}),this.whistle("offside",{type:"faceoff",x:l.x,y:l.y},{side:i})}checkIcing(e){const t=this.puck;if(!t.icing||t.carrier)return;const s=t.icing.side,i=this.teams[s],n=i.targetNetY();if(!(i.attackDir()<0?e>n&&t.y<=n:e<n&&t.y>=n))return;t.icing=null;const a=this.zoneDots(s,"defensive");this.emit("icing",{side:s}),this.whistle("icing",{type:"faceoff",x:a.x,y:a.y},{side:s})}goal(e){const t=this.puck,s=this.attackerOfNet(e),i=this.teams[s],n=this.teams[this.other(s)];i.score++;const a=t.chain.slice(),o=t.lastTouch&&t.lastTouch.side===s?t.lastTouch.uid:null,r=o?this.findEntity(o):null,l=[];if(r&&t.lastTouch.side===s)for(let u=a.length-2;u>=0&&l.length<2;u--){const p=this.findEntity(a[u]);p&&p.side===s&&p!==r&&!l.includes(p)&&l.push(p)}r&&r.stats.goals++,l.forEach(u=>u.stats.assists++);const d=i.strength()>n.strength();if(d){const u=n.box.findIndex(p=>!U[p.type].ejection);if(u>=0){const p=n.box.splice(u,1)[0],g=this.findEntity(p.uid);g&&(g.inBox=!1),this.emit("penalty-over",{side:n.side,uid:p.uid})}}this.pending=this.pending.filter(u=>u.offender.side===s);const c=r?r.exposure:0;this.emit("goal",{side:s,scorer:r?r.uid:null,scorerName:r?r.player.name:"Own goal",scorerNumber:r?r.player.number:null,assists:l.map(u=>u.uid),ppg:d,keepScore:this.rules.keepScore,viral:r?this.rng.chance(.25+c/200):!1,home:this.teams.home.score,away:this.teams.away.score}),r&&n.goalie&&n.goalie.onIce&&this.maybeStandsFight(r,n.goalie,.06),this.phase="goal",this.phaseTimer=2.6,t.carrier=null,t.shot=null,t.pass=null,t.icing=null,t.vx*=.2,t.vy*=.2,this.nextRestart=this.rules.faceoffs?{type:"faceoff",x:this.centerDot().x,y:this.centerDot().y}:{type:"restart",side:n.side},this.period>this.rules.periods&&this.endGame("overtime",s)}endPeriod(){this.emit("period-end",{period:this.period}),this.pending=[];const e=this.teams.home.score===this.teams.away.score;if(this.period<this.rules.periods){this.beginIntermission();return}if(this.period===this.rules.periods&&this.rules.needWinner&&e){this.period++,this.clock=this.rules.periodSeconds,this.emit("overtime"),this.startFaceoff(this.centerDot());return}if(this.period>this.rules.periods&&e){const t=this.teams.home.skaters().reduce((a,o)=>a+o.rating.shot,0)/this.teams.home.skaters().length,s=this.teams.away.skaters().reduce((a,o)=>a+o.rating.shot,0)/this.teams.away.skaters().length,i=a=>a.goalie&&a.goalie.onIce?a.goalie.rating.reflex:40,n=this.rng.chance(A(.5+(t-i(this.teams.away)-(s-i(this.teams.home)))*.01,.2,.8));this.emit("shootout",{winner:n?"home":"away"}),this.endGame("shootout",n?"home":"away");return}this.endGame("final",null)}beginIntermission(){this.phase="intermission";const e=this.opts.focusSide||"home",t=this.teams[e];if(!this.rules.crowd){this.intermission={id:"quiet",side:e,subject:null,title:"Hot chocolate break",body:"Nobody came to watch. No refs, no scoreboard operator, no parents. Everyone is having a great time.",choices:["Back out there"]},this.emit("intermission",Object.assign({},this.intermission)),this.opts.autoIntermission&&this.chooseIntermission(0);return}const s=this.rng.weighted(He),i=s.subject(t)||null;this.intermission={id:s.id,side:e,subject:i?i.uid:null,title:s.title,body:s.body(i),choices:s.choices.map(n=>n.label)},this.emit("intermission",Object.assign({},this.intermission)),this.opts.autoIntermission&&this.chooseIntermission(this.rng.int(0,s.choices.length-1))}chooseIntermission(e){if(!this.intermission)return null;const t=He.find(o=>o.id===this.intermission.id),s=this.teams[this.intermission.side],i=this.intermission.subject?this.findEntity(this.intermission.subject):null,n=t?t.choices[A(e,0,t.choices.length-1)]:{label:"Back out there",result:()=>"Back out there.",apply:()=>{}};n.apply(this,s,i),this.crowd.mood=A(this.crowd.mood,0,1),s.chemistry=A(s.chemistry,-.3,.5);const a=n.result(i);this.emit("intermission-choice",{id:this.intermission.id,choice:n.label,result:a}),this.intermission=null,this.period++,this.clock=this.rules.periodSeconds,this.buzzerTimer=this.rules.buzzer;for(const o of["home","away"])this.teams[o].changeLine(!1),this.teams[o].entities.forEach(r=>{r.onIce||(r.stamina=A(r.stamina+.4,0,1))});return this.emit("period-start",{period:this.period}),this.startFaceoff(this.centerDot()),a}endGame(e,t){const s=this.teams.home.score,i=this.teams.away.score;let n=t;!n&&s!==i&&(n=s>i?"home":"away"),this.phase="final",this.result={reason:e,winner:n||null,home:s,away:i,keepScore:this.rules.keepScore},this.emit("final",Object.assign({},this.result))}snapshot(){const e=this.puck,t=this.allOnIce().map(s=>({uid:s.uid,side:s.side,number:s.player.number,skin:s.player.skin,hand:s.player.hand,x:s.x,y:s.y,vx:s.vx,vy:s.vy,dir:s.dir,goalie:s.isGoalie,stun:s.stun>0,fighting:s.fighting,puck:e.carrier===s,controller:s.controller,exposure:s.exposure,role:s.role||null,brokenStick:!!s.brokenStick,guest:s.guest||null,look:s.look||null}));return{t:this.time,phase:this.phase,period:this.period,clock:Math.max(0,this.clock),surface:this.rules.surface.id,skaters:t,puck:{x:e.x,y:e.y,z:e.z,uid:e.carrier?e.carrier.uid:null},score:{home:this.teams.home.score,away:this.teams.away.score},strength:{home:this.teams.home.strength(),away:this.teams.away.strength()},box:{home:this.teams.home.box.map(s=>({uid:s.uid,remaining:s.remaining})),away:this.teams.away.box.map(s=>({uid:s.uid,remaining:s.remaining}))},delayed:this.pending.length?this.pending[0].offender.side:null,dir:{home:this.teams.home.attackDir(),away:this.teams.away.attackDir()},modifiers:this.modifiers,venue:this.rules.venue}}clockLabel(){const e=Math.max(0,this.clock/this.rules.periodSeconds*this.rules.periodMinutes*60),t=Math.floor(e/60),s=Math.floor(e%60);return`${t}:${s<10?"0":""}${s}`}}const Dt=(h,e)=>{const t=new tt(Object.assign({autoIntermission:!0},h)),s=1/60;let i=0;const n=[],a=3600*60;for(;t.phase!=="final"&&i<a;){t.step(s,null);const o=t.drainEvents();for(const r of o)n.push(r);i++}return{game:t,events:n,result:t.result,steps:i}};/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */const Re=12,Nt=15,Gt={down:["....hhhh....","...hhhhhh...","...hffffh...","...vfefev...","....ffff....","..tjjjjjjt..",".gjjjjjjjjg.",".gjjssssjjg.","..jjjjjjjj..","..tttttttt..","..pppppppp.."],up:["....hhhh....","...hhhhhh...","...hhhhhh...","...hhhhhh...","....ffff....","..tjjjjjjt..",".gjjjjjjjjg.",".gjjjjjjjjg.","..jjjjjjjj..","..tttttttt..","..pppppppp.."],side:["....hhhh....","...hhhhhh...","...hhhfff...","...hhfefv...","....hfffv...","...jjjjjt...","..jjjjjjjg..","..jjjjjjjg..","..sssssss...","..ttttttt...","..ppppppp..."]},Yt={down:[["..ppp..ppp..","..pp....pp..","..kk....kk..",".bbb....bbb."],["..ppp..ppp..","...pp..pp...","...kk..kk...","..bbb..bbb.."]],up:[["..ppp..ppp..","..pp....pp..","..kk....kk..",".bbb....bbb."],["..ppp..ppp..","...pp..pp...","...kk..kk...","..bbb..bbb.."]],side:[["...pp.pp....","...pp..pp...","...kk..kk...","..bbb..bbbb."],["..pp...pp...","..pp....pp..","..kk....kk..",".bbb....bbbb"]]},qt={down:["....hhhh....","...hhhhhh...","...hvvvvh...","...hvfvfh...","....vvvv....",".tjjjjjjjjt.","gjjjjjjjjjjg","gjjjsssjjjjg",".jjjjjjjjjj.",".tttttttttt.",".wwwwppwwww.",".wwww..wwww.",".wtww..wwtw.",".wwww..wwww.",".kkkk..kkkk."],up:["....hhhh....","...hhhhhh...","...hhhhhh...","...hhhhhh...","....hhhh....",".tjjjjjjjjt.","gjjjjjjjjjjg","gjjjjjjjjjjg",".jjjjjjjjjj.",".tttttttttt.",".wwwwppwwww.",".wwww..wwww.",".wtww..wwtw.",".wwww..wwww.",".kkkk..kkkk."]},Ut={0:["###","#.#","#.#","#.#","###"],1:[".#.","##.",".#.",".#.","###"],2:["###","..#","###","#..","###"],3:["###","..#",".##","..#","###"],4:["#.#","#.#","###","..#","..#"],5:["###","#..","###","..#","###"],6:["###","#..","###","#.#","###"],7:["###","..#",".#.",".#.",".#."],8:["###","#.#","###","#.#","###"],9:["###","#.#","###","..#","###"]},Ht=(h,e)=>{const t=parseInt(h.slice(1),16),s=Math.max(0,Math.min(255,(t>>16&255)+e)),i=Math.max(0,Math.min(255,(t>>8&255)+e)),n=Math.max(0,Math.min(255,(t&255)+e));return`#${(1<<24|s<<16|i<<8|n).toString(16).slice(1)}`},Oe=h=>h.length===4?`#${h[1]}${h[1]}${h[2]}${h[2]}${h[3]}${h[3]}`:h,Wt=(h,e)=>({h:h.helmet,f:e,e:"#222222",v:"#cfd8dc",j:h.jersey,t:h.trim,s:h.stripe,g:Ht(Oe(h.pants),30),p:h.pants,k:"#222222",b:"#e8eef2",w:"#f4f4f4"}),Kt=(h,e)=>{if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(h,e);const t=globalThis.document.createElement("canvas");return t.width=h,t.height=e,t},Vt=(h,e,t)=>{const s=h.getImageData(0,0,e,t).data,i=(a,o)=>a>=0&&o>=0&&a<e&&o<t&&s[(o*e+a)*4+3]>0,n=[];for(let a=0;a<t;a++)for(let o=0;o<e;o++)i(o,a)||(i(o-1,a)||i(o+1,a)||i(o,a-1)||i(o,a+1))&&n.push([o,a]);h.fillStyle="rgba(16, 20, 32, 0.75)",n.forEach(([a,o])=>h.fillRect(a,o,1,1))},Ce=new Map,Xt=(h,e,t,s,i,n)=>{const a=`${h.jersey}${h.trim}${h.helmet}${h.stripe}${h.pants}|${e}|${t}|${s}|${i}|${n?1:0}`;if(Ce.has(a))return Ce.get(a);const o=14,r=17,l=Kt(o,r),d=l.getContext("2d"),c=Wt(h,e);let u;if(n?u=qt[t==="up"?"up":"down"]:u=Gt[t].concat(Yt[t][s%2]),u.forEach((p,g)=>{for(let f=0;f<p.length;f++){const b=p[f];b!=="."&&(d.fillStyle=c[b],d.fillRect(f+1,g+1,1,1))}}),t==="up"&&i!==void 0&&i!==null){const p=String(i).split(""),g=p.length*4-1;let f=1+Math.round((12-g)/2);d.fillStyle=h.number,p.forEach(b=>{Ut[b].forEach((y,x)=>{for(let $=0;$<3;$++)y[$]==="#"&&d.fillRect(f+$,6+x,1,1)}),f+=4})}return Vt(d,o,r),Ce.set(a,l),l},Jt=(h,e)=>{const t=parseInt(Oe(h).slice(1),16),s=parseInt(Oe(e).slice(1),16),i=(t>>16&255)-(s>>16&255),n=(t>>8&255)-(s>>8&255),a=(t&255)-(s&255);return Math.sqrt(i*i+n*n+a*a)};/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */const st={A:[".###.","#...#","#...#","#####","#...#","#...#","#...#"],B:["####.","#...#","#...#","####.","#...#","#...#","####."],C:[".###.","#...#","#....","#....","#....","#...#",".###."],D:["####.","#...#","#...#","#...#","#...#","#...#","####."],E:["#####","#....","#....","####.","#....","#....","#####"],F:["#####","#....","#....","####.","#....","#....","#...."],G:[".###.","#...#","#....","#.###","#...#","#...#",".####"],H:["#...#","#...#","#...#","#####","#...#","#...#","#...#"],I:[".###.","..#..","..#..","..#..","..#..","..#..",".###."],J:["..###","...#.","...#.","...#.","...#.","#..#.",".##.."],K:["#...#","#..#.","#.#..","##...","#.#..","#..#.","#...#"],L:["#....","#....","#....","#....","#....","#....","#####"],M:["#...#","##.##","#.#.#","#.#.#","#...#","#...#","#...#"],N:["#...#","##..#","#.#.#","#..##","#...#","#...#","#...#"],O:[".###.","#...#","#...#","#...#","#...#","#...#",".###."],P:["####.","#...#","#...#","####.","#....","#....","#...."],Q:[".###.","#...#","#...#","#...#","#.#.#","#..#.",".##.#"],R:["####.","#...#","#...#","####.","#.#..","#..#.","#...#"],S:[".####","#....","#....",".###.","....#","....#","####."],T:["#####","..#..","..#..","..#..","..#..","..#..","..#.."],U:["#...#","#...#","#...#","#...#","#...#","#...#",".###."],V:["#...#","#...#","#...#","#...#","#...#",".#.#.","..#.."],W:["#...#","#...#","#...#","#.#.#","#.#.#","##.##","#...#"],X:["#...#","#...#",".#.#.","..#..",".#.#.","#...#","#...#"],Y:["#...#","#...#",".#.#.","..#..","..#..","..#..","..#.."],Z:["#####","....#","...#.","..#..",".#...","#....","#####"],0:[".###.","#...#","#..##","#.#.#","##..#","#...#",".###."],1:["..#..",".##..","..#..","..#..","..#..","..#..",".###."],2:[".###.","#...#","....#","...#.","..#..",".#...","#####"],3:["####.","....#","....#",".###.","....#","....#","####."],4:["...#.","..##.",".#.#.","#..#.","#####","...#.","...#."],5:["#####","#....","####.","....#","....#","#...#",".###."],6:[".###.","#....","#....","####.","#...#","#...#",".###."],7:["#####","....#","...#.","..#..",".#...",".#...",".#..."],8:[".###.","#...#","#...#",".###.","#...#","#...#",".###."],9:[".###.","#...#","#...#",".####","....#","....#",".###."]," ":[".....",".....",".....",".....",".....",".....","....."],".":[".....",".....",".....",".....",".....",".##..",".##.."],",":[".....",".....",".....",".....",".##..","..#..",".#..."],":":[".....",".##..",".##..",".....",".##..",".##..","....."],"!":["..#..","..#..","..#..","..#..","..#..",".....","..#.."],"?":[".###.","#...#","....#","...#.","..#..",".....","..#.."],"-":[".....",".....",".....",".###.",".....",".....","....."],"'":["..#..","..#..",".#...",".....",".....",".....","....."],'"':[".#.#.",".#.#.",".....",".....",".....",".....","....."],$:["..#..",".####","#.#..",".###.","..#.#","####.","..#.."],"#":[".#.#.",".#.#.","#####",".#.#.","#####",".#.#.",".#.#."],"/":["....#","....#","...#.","..#..",".#...","#....","#...."],"&":[".##..","#..#.","#.#..",".#...","#.#.#","#..#.",".##.#"],"(":["...#.","..#..",".#...",".#...",".#...","..#..","...#."],")":[".#...","..#..","...#.","...#.","...#.","..#..",".#..."],"+":[".....","..#..","..#..","#####","..#..","..#..","....."],"%":["##..#","##..#","...#.","..#..",".#...","#..##","#..##"],"\xBD":["#....","#...#","#..#.","..#..",".#.##","#...#","...##"],"\u2153":["#....","#...#","#..#.","..#..",".#.##","#...#","...##"]},Ie=5,Zt=7,le=(h,e)=>{const t=e||1;return String(h).length*(Ie+1)*t-t},L=(h,e,t,s,i,n)=>{const a=n||{},o=a.scale||1,r=String(e).toUpperCase();let l=t;const d=le(r,o);a.align==="center"?l=Math.round(t-d/2):a.align==="right"&&(l=Math.round(t-d));const c=(u,p,g)=>{h.fillStyle=g;for(let f=0;f<r.length;f++){const b=st[r[f]]||st["?"];for(let y=0;y<Zt;y++){const x=b[y];for(let $=0;$<Ie;$++)x[$]==="#"&&h.fillRect(l+u+(f*(Ie+1)+$)*o,s+p+y*o,o,o)}}};return a.shadow&&c(o,o,a.shadow),c(0,0,i),d};/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */const it={"jesus-selects":{w:16,h:12,palette:{a:"#f2c94c",b:"#ffffff",c:"#2a4bd7",d:"#111111"},rows:["....aaaaaaaa....","..aa........aa..","....aaaaaaaa....","................","....dddddddd....","a.dddddddddddd.a","aadccccccccccdaa",".adcccbbbbcccda.","aadcccbbbbcccdaa","a.dccccccccccd.a","...dddddddddd...",".....dddddd....."]},"elite-prospects":{w:16,h:14,palette:{a:"#d4af37",b:"#ffffff",e:"#7fe7ff",f:"#ffffff",g:"#3aa9c9"},rows:["..a...a..a...a..","..aa.aaaaaa.aa..","..aaaaaaaaaaaa..","..abaabaabaaba..","...aaaaaaaaaa...","................","....eeeeeeee....","...effeeeeeee...","..eeeeeeeeeeee..","...gegegegegg...","....ggeeeegg....",".....ggeegg.....","......ggee......",".......gg......."]},"d1-or-bust":{w:16,h:15,palette:{o:"#ff7a1a",n:"#13213f",w:"#ffffff"},rows:["oooooooooooooooo","onnnnnnnnnnnnnno","onwwwnnnnnnwwnno","onwnnwnnnnwwwnno","onwnnwnnnnnwwnno","onwnnwnnnnnwwnno","onwnnwnnnnnwwnno","onwwwnnnnnwwwwno","onnnnnnnnnnnnnno",".onnnnnnnnnnnno.","..onnnnnnnnnno..","...onnnnnnnno...","....onnnnnno....",".....oonnoo.....",".......oo......."]},"b-squad":{w:15,h:15,palette:{a:"#111",b:"#7a7a7a",c:"#ff3fa4"},rows:[".....ccccc.....","...cccaacccc...","..caaccccccac..",".caccaaaaacccc.","caacaaaaaaacaac","caaaacaaacaaaac","aaaaacaccaaaaaa","aaaaacacacaaaaa","aaaabcaccaaaaaa","caabacaaaabaaaa","caaabacaaabaaac",".caaabaaaaaaac.","..aaaaaaaaaca..","...caaaaacac...",".....caaacc...."]},"sparkle-selects":{w:16,h:15,palette:{a:"#111",b:"#2e80ff",c:"#ff3fa4",d:"#ffde46",e:"#fff"},rows:["eee...eeeeeeeee.","eceeeeeccccacae.","ecaecccccccccce.","eecccccccccccaee",".eacaccaddadddde",".eaddddddddcbdae",".eadddddddddddae",".eaaddddddaabbbe",".eddacabbabbbabe",".eaaaccaaaaaaaee",".eeeaacaaaaaeee.","...eeabbdaaee...","....edbbddee....","....eeddeee.....",".....eeee......."]}},ce=(h,e,t,s,i,n)=>{const a=it[e];a&&(h.save(),typeof n=="number"&&(h.globalAlpha=n),a.rows.forEach((o,r)=>{for(let l=0;l<o.length;l++){const d=o[l];d!=="."&&(h.fillStyle=a.palette[d],h.fillRect(Math.round(t+l*i),Math.round(s+r*i),Math.ceil(i),Math.ceil(i)))}}),h.restore())},de={kb:"#ff5252",touch:"#ff5252",pad0:"#ff5252",pad1:"#40c4ff",pad2:"#69f0ae",pad3:"#ffd740"},Pe={kb:"1",touch:"1",pad0:"1",pad1:"2",pad2:"3",pad3:"4"},Ae=16,Qt="#eef4f8",W="#d8343c",ue="#2a5bd7",es=(h,e)=>{if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(h,e);const t=globalThis.document.createElement("canvas");return t.width=h,t.height=e,t},Le=h=>{let e=h;return()=>(e=e*1103515245+12345&2147483647,e/2147483647)};class te{constructor(e,t){this.canvas=e,this.ctx=e.getContext("2d"),this.ctx.imageSmoothingEnabled=!1,this.opts=Object.assign({hud:!0},t||{}),this.camY=null,this.stride=new Map,this.lastPos=new Map,this.rinkCache=new Map,this.teams=null,this.rules=null}setMatch(e,t){this.rules=e,this.teams=t,this.camY=null,this.stride.clear(),this.lastPos.clear()}get W(){return this.canvas.width}get H(){return this.canvas.height}get viewTop(){return this.opts.hud?Ae:0}scaleFor(e){return this.opts.zoom?this.opts.zoom:Math.max(1,(this.W-60)/e.width)}rinkLayer(e,t,s,i){const n=`${e}|${t}|${s}|${this.rules?this.rules.net.width:6}|${i?1:0}`;if(this.rinkCache.has(n))return this.rinkCache.get(n);const a=se[e],o=6,r=Math.round(a.width*t)+o*2,l=Math.round(a.length*t)+o*2,d=es(r,l),c=d.getContext("2d");c.imageSmoothingEnabled=!1;const u=k=>o+k*t,p=k=>o+k*t,g=a.cornerRadius*t,f=(k,w,v,M,S)=>{c.beginPath(),c.moveTo(k+S,w),c.arcTo(k+v,w,k+v,w+M,S),c.arcTo(k+v,w+M,k,w+M,S),c.arcTo(k,w+M,k,w,S),c.arcTo(k,w,k+v,w,S),c.closePath()},b=e==="pond",y=e==="street";f(o-4,o-4,a.width*t+8,a.length*t+8,g+4),c.fillStyle=b?"#b8cfe0":y?"#7c7f88":"#2b3a55",c.fill(),f(o-2,o-2,a.width*t+4,a.length*t+4,g+2),c.fillStyle=b?"#f7fbff":y?"#c9c9c9":"#f2c94c",c.fill(),f(o,o,a.width*t,a.length*t,g),c.fillStyle=y?"#3d4048":b?"#cfe6f2":e==="roller"?"#d9dde6":i?"#ffd6ea":Qt,c.fill(),c.save(),f(o,o,a.width*t,a.length*t,g),c.clip();const x=Le(7+a.length);for(let k=0;k<a.width*a.length/18;k++)y?c.fillStyle=x()>.5?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.18)":c.fillStyle=x()>.5?"rgba(255,255,255,0.6)":"rgba(150,170,190,0.18)",c.fillRect(Math.floor(o+x()*a.width*t),Math.floor(o+x()*a.length*t),Math.ceil(x()*3),1);const $=(k,w,v)=>{c.fillStyle=w,c.fillRect(o,Math.round(p(k)-v/2),a.width*t,v)},_=(k,w,v,M,S)=>{c.beginPath(),c.arc(u(k),p(w),v*t,0,Math.PI*2),S?(c.fillStyle=M,c.fill()):(c.strokeStyle=M,c.lineWidth=1,c.stroke())},R=Math.max(2,Math.round(t));if(a.centerLine&&($(a.length/2,W,R),_(a.width/2,a.length/2,15,ue)),_(a.width/2,a.length/2,.8,ue,!0),a.blueLines&&($(a.blueLines,ue,R+1),$(a.length-a.blueLines,ue,R+1)),$(a.goalLine,W,1),$(a.length-a.goalLine,W,1),e==="full"||e==="roller"){const k=Math.min(20,a.length*.2);for(const w of[a.goalLine+k,a.length-a.goalLine-k])for(const v of[a.width/2-22,a.width/2+22])_(v,w,15,W),_(v,w,1,W,!0);if(a.blueLines)for(const w of[a.blueLines+5,a.length-a.blueLines-5])for(const v of[a.width/2-22,a.width/2+22])_(v,w,1,W,!0)}if(y){c.fillStyle="rgba(232,197,71,0.55)";for(let k=4;k<a.length-4;k+=9)c.fillRect(Math.round(u(a.width/2)-1),Math.round(p(k)),2,Math.round(4*t));c.fillStyle="#2b2d33",c.beginPath(),c.arc(u(a.width*.3),p(a.length*.6),2.5*t,0,Math.PI*2),c.fill()}if(b){c.strokeStyle="rgba(120,160,190,0.5)",c.lineWidth=1;for(let k=0;k<6;k++){let w=u(x()*a.width),v=p(x()*a.length);c.beginPath(),c.moveTo(w,v);for(let M=0;M<4;M++)w+=(x()-.5)*30,v+=(x()-.5)*30,c.lineTo(w,v);c.stroke()}}const O=this.rules?this.rules.net:qe.regulation,F=O.width===4?4.5:6;for(const[k,w]of b||y?[]:[[a.goalLine,1],[a.length-a.goalLine,-1]])c.beginPath(),c.arc(u(a.width/2),p(k),F*t,w>0?0:Math.PI,w>0?Math.PI:Math.PI*2),c.closePath(),c.fillStyle="rgba(110, 180, 255, 0.45)",c.fill(),c.strokeStyle=W,c.lineWidth=1,c.stroke();if(s){const k=Math.max(1,Math.round(t*.55));ce(c,s,u(a.width/2)-8*k,p(a.length/2)-8*k,k,.35)}c.restore();for(const[k,w]of[[a.goalLine,-1],[a.length-a.goalLine,1]]){const v=u(a.width/2-O.width/2),M=u(a.width/2+O.width/2),S=p(k),E=p(k+w*O.depth),D=Math.min(S,E),z=Math.abs(E-S);c.fillStyle="rgba(255,255,255,0.85)",c.fillRect(Math.round(v),Math.round(D),Math.round(M-v),Math.round(z)),c.fillStyle="rgba(120,130,150,0.6)";for(let N=Math.round(D)+1;N<D+z;N+=2)for(let I=Math.round(v)+(N&2?1:0);I<M;I+=2)c.fillRect(I,N,1,1);const q=y?"#ff7a1a":b?"#8b5a2b":W;c.strokeStyle=q,c.lineWidth=1,c.strokeRect(Math.round(v)+.5,Math.round(D)+.5,Math.round(M-v)-1,Math.round(z)-1),c.fillStyle=q,c.fillRect(Math.round(v)-1,Math.round(S)-1,2,2),c.fillRect(Math.round(M)-1,Math.round(S)-1,2,2)}const B={canvas:d,pad:o,scale:t,w:r,h:l};return this.rinkCache.set(n,B),B}drawStands(e,t,s){const i=this.ctx;if(s==="pond"||s==="street"){const o=s==="pond";i.fillStyle=o?"#eef5fb":"#3f6b35",i.fillRect(0,e,this.W,t);const r=Le(o?41:43);for(let l=0;l<70;l++){const d=Math.floor(r()*this.W),c=Math.floor(e+r()*t);o?(i.fillStyle="#2f5d3a",i.fillRect(d,c,3,5),i.fillRect(d-1,c+2,5,3)):(i.fillStyle=r()>.5?"#4c7d41":"#355c2d",i.fillRect(d,c,4,2))}return}i.fillStyle="#141826",i.fillRect(0,e,this.W,t);const n=Le(99),a=["#3a4466","#5a3a66","#665a3a","#3a665a","#6b2a3a","#2a4a6b"];for(let o=e;o<e+t;o+=3)for(let r=0;r<this.W;r+=3)n()>.55&&(i.fillStyle=a[Math.floor(n()*a.length)],i.fillRect(r,o,2,2))}draw(e,t){const s=t||{},i=this.ctx,n=se[e.surface],a=this.scaleFor(n),o=this.teams?this.teams.home.crest:null,r=this.rinkLayer(e.surface,a,o,(e.modifiers||[]).includes("pink-ice")),l=this.viewTop,d=this.H-l,c=r.w,u=r.h,p=Math.round((this.W-c)/2),g=s.follow||e.puck,f=g.y*a+r.pad-d/2,b=u-d;let y=b<=0?b/2:Math.max(0,Math.min(b,f));this.camY===null||s.snapCamera?this.camY=y:this.camY+=(y-this.camY)*Math.min(1,(s.dt||1/60)*6),y=Math.round(this.camY);let x=0;if(c>this.W){const S=g.x*a+r.pad-this.W/2;x=Math.round(Math.max(0,Math.min(c-this.W,S)))}const $=s.shake?Math.round(Math.sin(e.t*70)*s.shake):0,_=s.shake?Math.round(Math.cos(e.t*53)*s.shake):0,R=(c>this.W?-x:p)+$,O=l-y+_;i.save(),i.beginPath(),i.rect(0,l,this.W,d),i.clip(),this.drawStands(l,d,e.surface),i.drawImage(r.canvas,R,O);const F=S=>Math.round(R+r.pad+S*a),B=S=>Math.round(O+r.pad+S*a),k=e.skaters.slice().sort((S,E)=>S.y-E.y),w=e.puck;let v=!1;this.trail||(this.trail=[]),this.trail.push({x:w.x,y:w.y}),this.trail.length>12&&this.trail.shift();const M=()=>{const S=F(w.x),E=B(w.y);s.fire&&this.trail.forEach((z,q)=>{const N=q/this.trail.length;i.fillStyle=q%2?`rgba(255,${Math.round(120+N*120)},40,${N})`:`rgba(255,230,90,${N*.8})`;const I=1+Math.round(N*3);i.fillRect(F(z.x)-Math.floor(I/2)+q%3-1,B(z.y)-Math.floor(I/2)-1,I,I)}),w.z>.2&&(i.fillStyle="rgba(0,0,0,0.25)",i.fillRect(S-1,E,3,1));const D=Math.round(w.z*a*.6);i.fillStyle="#111111",i.fillRect(S-1,E-1-D,3,2),i.fillStyle="#5a5a5a",i.fillRect(S-1,E-1-D,3,1),v=!0};for(const S of k)!v&&w.y<S.y&&!w.uid&&M(),this.drawSkater(S,F(S.x),B(S.y),e,s.dt||1/60),w.uid===S.uid&&M();v||M(),i.restore(),this.opts.hud&&this.drawHud(e),s.banner&&this.drawBanner(s.banner,s.bannerColor,s.sub)}viewFor(e,t){if(e.goalie){const n=se[t.surface];return{view:e.y>n.length/2?"up":"down",flip:!1}}const s=Math.cos(e.dir),i=Math.sin(e.dir);return Math.abs(i)>Math.abs(s)*.8?{view:i<0?"up":"down",flip:!1}:{view:"side",flip:s<0}}drawSkater(e,t,s,i,n){const a=this.ctx,o=this.teams?this.teams[e.side]:null;let r=o?o.kit:{jersey:"#888",trim:"#fff",stripe:"#444",number:"#fff",helmet:"#222",pants:"#222"};const l=e.look||null;l&&(r=Object.assign({},r,l.jersey?{jersey:l.jersey}:{},l.trim?{trim:l.trim}:{},l.helmet?{helmet:l.helmet}:{},l.pants?{pants:l.pants}:{}));const d=i.modifiers||[],c=this.lastPos.get(e.uid),u=c?Math.hypot(e.x-c.x,e.y-c.y):0;this.lastPos.set(e.uid,{x:e.x,y:e.y});const p=(this.stride.get(e.uid)||0)+(u<20?u:0);this.stride.set(e.uid,p);const g=Math.floor(p/2.2)%2,{view:f,flip:b}=this.viewFor(e,i),y=Xt(r,e.skin,f,e.goalie?0:g,e.number,e.goalie);let x=l&&l.scale?l.scale:1;e.goalie&&d.includes("tiny-goalies")&&(x=.6);const $=d.includes("big-heads")||l&&l.bigHead,_=Math.round((Re+2)*x),R=Math.round((Nt+2)*x);a.fillStyle="rgba(20, 40, 70, 0.22)",a.fillRect(t-Math.round(4*x),s-1,Math.round(9*x),2),e.controller&&de[e.controller]&&(a.fillStyle=de[e.controller],a.fillRect(t-5,s,11,1),a.fillRect(t-4,s+1,9,1));const O=f==="up",F=Math.cos(e.dir),B=Math.sin(e.dir),k=o&&o.stickColor?o.stickColor:"#a0522d",w=()=>{if(e.brokenStick)return;if(e.goalie){a.fillStyle="#8b5a2b";const I=t+(f==="up"?-6:3);a.fillRect(I,s-2,4,1);return}const E=t+(e.hand==="L"?-2:2),D=s-Math.round(6*x),z=Math.round(7*x);a.fillStyle=k;for(let I=0;I<z;I++)a.fillRect(Math.round(E+F*I),Math.round(D+B*I*.8+I*.5),1,1);const q=Math.round(E+F*z),N=Math.round(D+B*z*.8+z*.5);a.fillStyle="#222222",a.fillRect(q-1,N,3,1)},v=s-R+1;if(e.stun){a.save(),a.translate(t,s-3),a.rotate(Math.PI/2),a.drawImage(y,-Math.floor(_/2),-Math.floor(R/2),_,R),a.restore();return}let M=0;e.fighting&&(M=Math.round(Math.sin(i.t*40+e.uid)*1.5)),O&&w();const S=E=>{if(a.drawImage(y,E,v,_,R),$){const D=Math.round((Re+2)*x*1.9),z=Math.round(7*x*1.9);a.drawImage(y,0,0,Re+2,7,E+Math.round((_-D)/2),v-z+Math.round(7*x),D,z)}};if(b?(a.save(),a.translate(t+M,0),a.scale(-1,1),S(-Math.floor(_/2)),a.restore()):S(t+M-Math.floor(_/2)),O||w(),e.fighting){a.fillStyle="#ffffff";const E=Math.floor(i.t*12)%4;a.fillRect(t-6+E,v-2,2,2),a.fillRect(t+4-E,v,2,2)}if(e.controller&&Pe[e.controller]){const E=de[e.controller];L(a,Pe[e.controller],t,v-($?18:9),E,{align:"center",shadow:"#10131c"})}}drawHud(e){const t=this.ctx;t.fillStyle="#10131c",t.fillRect(0,0,this.W,Ae),t.fillStyle="#f2c94c",t.fillRect(0,Ae-1,this.W,1);const s=this.rules,i=this.teams;if(!s||!i)return;const n=s.keepScore,a=4;ce(t,i.home.crest,3,1,.8),L(t,i.home.short,19,a,i.home.kit.jersey==="#111111"||i.home.kit.jersey==="#151217"?i.home.kit.trim:i.home.kit.jersey,{shadow:"#000"}),ce(t,i.away.crest,this.W-16,1,.8),L(t,i.away.short,this.W-19,a,i.away.kit.jersey==="#111111"||i.away.kit.jersey==="#151217"?i.away.kit.trim:i.away.kit.jersey,{align:"right",shadow:"#000"}),n&&(L(t,e.score.home,42,a,"#ffffff",{shadow:"#000"}),L(t,e.score.away,this.W-42,a,"#ffffff",{align:"right",shadow:"#000"}));const o=e.period>s.periods?"OT":["1ST","2ND","3RD"][e.period-1]||`${e.period}`,r=Math.max(0,e.clock/s.periodSeconds*s.periodMinutes*60),l=Math.floor(r/60),d=Math.floor(r%60),c=`${l}:${d<10?"0":""}${d}`;L(t,`${o} ${c}`,this.W/2,a,"#f2c94c",{align:"center",shadow:"#000"});const u=[],p=e.strength.home,g=e.strength.away;if(p!==g){const f=p>g?i.home.short:i.away.short;u.push(`${f} POWER PLAY ${Math.max(p,g)}V${Math.min(p,g)}`)}if(e.delayed&&u.push(`DELAYED PENALTY ${i[e.delayed].short}`),u.length){const f=u.join("  "),b=le(f,1)+8;t.fillStyle="rgba(16, 19, 28, 0.8)",t.fillRect(Math.round(this.W/2-b/2),this.H-12,b,11),L(t,f,this.W/2,this.H-10,"#ffffff",{align:"center"})}}drawBanner(e,t,s){const i=this.ctx,n=String(e).split(`
`),a=2,o=n.length*9*a+(s?12:0)+8,r=Math.round(this.viewTop+(this.H-this.viewTop)*.36-o/2);i.fillStyle="rgba(16, 19, 28, 0.78)",i.fillRect(0,r,this.W,o),i.fillStyle=t||"#f2c94c",i.fillRect(0,r,this.W,1),i.fillRect(0,r+o-1,this.W,1),n.forEach((l,d)=>{const c=le(l,a)>this.W-8?1:a;L(i,l,this.W/2,r+4+d*9*a+(a-c)*3,t||"#f2c94c",{align:"center",scale:c,shadow:"#000"})}),s&&L(i,s,this.W/2,r+o-11,"#ffffff",{align:"center",shadow:"#000"})}}/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */const pe=h=>{const e=/^([A-G])([#b]?)(\d)$/.exec(h);if(!e)return 0;const t={C:-9,D:-7,E:-5,F:-4,G:-2,A:0,B:2}[e[1]],s=e[2]==="#"?1:e[2]==="b"?-1:0,i=t+s+(parseInt(e[3],10)-4)*12;return 440*Math.pow(2,i/12)},at={goal:[["C5",.5],["E5",.5],["G5",.5],["C6",1],[null,.25],["G5",.5],["C6",1.5]],rally:[["G4",.5],["G4",.5],["B4",.5],["D5",.5],[null,.5],["B4",.5],["D5",1.5]],penalty:[["E5",.25],["D#5",.25],["E5",.25],["B4",.75]],period:[["C5",.75],["G4",.75],["E4",.75],["C4",1.5]],money:[["C6",.25],["E6",.25],["G6",.5]]},fe={bpm:132,lead:[["E5",1],["G5",.5],["A5",.5],["G5",1],["E5",1],["D5",1],["E5",.5],["G5",.5],["E5",2],["C5",1],["D5",.5],["E5",.5],["G5",1],["A5",1],["G5",1],["E5",.5],["D5",.5],["C5",2]],bass:[["C3",1],["C3",1],["G2",1],["G2",1],["A2",1],["A2",1],["E2",1],["E2",1],["F2",1],["F2",1],["C3",1],["C3",1],["G2",1],["G2",1],["C3",1],["C3",1]]};class ts{constructor(){this.ctx=null,this.master=null,this.crowdGain=null,this.muted=!1,this.loopTimer=null;try{this.muted=globalThis.localStorage.getItem("youth-hockey-27:muted")==="1"}catch{this.muted=!1}}start(){if(this.ctx){this.ctx.state==="suspended"&&this.ctx.resume();return}const e=globalThis.AudioContext||globalThis.webkitAudioContext;e&&(this.ctx=new e,this.master=this.ctx.createGain(),this.master.gain.value=this.muted?0:.5,this.master.connect(this.ctx.destination),this.startCrowd())}setMuted(e){this.muted=e;try{globalThis.localStorage.setItem("youth-hockey-27:muted",e?"1":"0")}catch{}this.master&&this.master.gain.setTargetAtTime(e?0:.5,this.ctx.currentTime,.05)}get ready(){return!!this.ctx}tone(e,t,s,i,n,a){const o=a||{},r=this.ctx.createOscillator(),l=this.ctx.createGain();if(r.type=e,r.frequency.setValueAtTime(t,s),o.slideTo&&r.frequency.exponentialRampToValueAtTime(o.slideTo,s+i),o.vibrato){const c=this.ctx.createOscillator(),u=this.ctx.createGain();c.frequency.value=o.vibrato,u.gain.value=t*.03,c.connect(u),u.connect(r.frequency),c.start(s),c.stop(s+i+.05)}l.gain.setValueAtTime(1e-4,s),l.gain.exponentialRampToValueAtTime(n,s+Math.min(.02,i/4)),l.gain.setValueAtTime(n,s+i*(o.hold||.7)),l.gain.exponentialRampToValueAtTime(1e-4,s+i);let d=r;if(o.filter){const c=this.ctx.createBiquadFilter();c.type="lowpass",c.frequency.value=o.filter,r.connect(c),d=c}d.connect(l),l.connect(o.dest||this.master),r.start(s),r.stop(s+i+.05)}noiseBuffer(){if(this._noise)return this._noise;const e=this.ctx.sampleRate,t=this.ctx.createBuffer(1,e,this.ctx.sampleRate),s=t.getChannelData(0);let i=12345;for(let n=0;n<e;n++)i=i*1103515245+12345&2147483647,s[n]=i/2147483647*2-1;return this._noise=t,t}burst(e,t,s,i,n){const a=this.ctx.createBufferSource();a.buffer=this.noiseBuffer();const o=this.ctx.createBiquadFilter();o.type=n||"bandpass",o.frequency.value=i;const r=this.ctx.createGain();r.gain.setValueAtTime(s,e),r.gain.exponentialRampToValueAtTime(1e-4,e+t),a.connect(o),o.connect(r),r.connect(this.master),a.start(e),a.stop(e+t+.05)}organ(e,t,s,i){const n=i||.07;this.tone("square",e,t,s,n,{filter:2400,vibrato:6,hold:.85}),this.tone("triangle",e*2,t,s,n*.6,{filter:3200,hold:.85}),this.tone("sine",e/2,t,s,n*.8,{hold:.85})}play(e){if(!this.ctx||this.muted)return;const t=this.ctx.currentTime+.01;switch(e){case"shot":this.burst(t,.09,.5,1800,"highpass"),this.tone("square",220,t,.05,.05);break;case"pass":this.burst(t,.05,.25,2500,"highpass");break;case"boards":this.tone("sine",90,t,.18,.25,{slideTo:50}),this.burst(t,.12,.25,300,"lowpass");break;case"hit":this.tone("square",110,t,.12,.12,{slideTo:60,filter:900}),this.burst(t,.15,.35,500,"lowpass");break;case"post":this.tone("triangle",1760,t,.4,.12,{hold:.1}),this.tone("triangle",2637,t,.3,.06,{hold:.1});break;case"whistle":this.tone("sine",2900,t,.22,.12,{vibrato:45}),this.tone("sine",2900,t+.28,.35,.12,{vibrato:45});break;case"buzzer":this.tone("square",180,t,1.1,.08,{filter:1200,hold:.95}),this.tone("square",183,t,1.1,.08,{filter:1200,hold:.95});break;case"horn":for(const s of[110,138.6,164.8])this.tone("sawtooth",s,t,1.8,.06,{filter:900,hold:.9});this.crowdSurge(1);break;case"save":this.burst(t,.07,.3,900),this.crowdSurge(.3);break;case"fight":this.crowdSurge(1),this.playSting("rally");break;case"menu":this.tone("square",660,t,.05,.05,{filter:3e3});break;case"select":this.tone("square",880,t,.06,.06,{filter:3e3}),this.tone("square",1320,t+.06,.08,.06,{filter:3e3});break;case"back":this.tone("square",520,t,.06,.05,{filter:2400}),this.tone("square",330,t+.06,.08,.05,{filter:2400});break;case"tv-on":this.tone("sine",15600,t,.5,.02,{hold:.9}),this.burst(t+.25,1.1,.35,3e3,"bandpass");break;case"slam":this.tone("sine",110,t,.45,.4,{slideTo:40}),this.burst(t,.3,.5,400,"lowpass");break;case"roar":this.roar();break;case"punch":this.burst(t,.12,.6,600,"lowpass"),this.tone("square",90,t,.1,.12,{slideTo:50,filter:800});break;case"whoosh":this.burst(t,.18,.25,2200,"bandpass");break;case"bell":for(const s of[0,.35,.7])this.tone("triangle",1318,t+s,.6,.12,{hold:.05}),this.tone("sine",2637,t+s,.4,.05,{hold:.05});break;case"snap":this.burst(t,.06,.9,3500,"highpass"),this.burst(t+.03,.2,.5,900,"bandpass"),this.playSting("money");break;case"posted":this.tone("sine",988,t,.12,.08,{hold:.3}),this.tone("sine",1319,t+.1,.2,.08,{hold:.3});break;case"cheat":["C5","E5","G5","C6","E6","G6","C7"].forEach((s,i)=>this.tone("square",pe(s),t+i*.06,.08,.05,{filter:4e3}));break;default:at[e]&&this.playSting(e)}}roar(){if(!this.ctx||this.muted)return;const e=this.ctx.currentTime,t=this.ctx.createBufferSource();t.buffer=this.noiseBuffer(),t.loop=!0;const s=this.ctx.createBiquadFilter();s.type="bandpass",s.Q.value=.5,s.frequency.setValueAtTime(400,e),s.frequency.linearRampToValueAtTime(1400,e+1.6);const i=this.ctx.createGain();i.gain.setValueAtTime(1e-4,e),i.gain.exponentialRampToValueAtTime(.5,e+1.4),i.gain.setTargetAtTime(1e-4,e+2.4,.6),t.connect(s),s.connect(i),i.connect(this.master),t.start(e),t.stop(e+5)}announce(e){if(!this.muted)try{const t=globalThis.speechSynthesis;if(!t)return;const s=new globalThis.SpeechSynthesisUtterance(e);s.pitch=.4,s.rate=.85,s.volume=.9,t.cancel(),t.speak(s)}catch{}}playSting(e){if(!this.ctx||this.muted)return;const t=at[e],s=60/150;let i=this.ctx.currentTime+.02;for(const[n,a]of t){const o=a*s;n&&this.organ(pe(n),i,o*.95),i+=o}}startLoop(){if(!this.ctx||this.loopTimer)return;const e=60/fe.bpm,t=fe.lead.reduce((i,[,n])=>i+n,0),s=()=>{if(this.muted)return;let i=this.ctx.currentTime+.05;for(const[n,a]of fe.lead)n&&this.tone("square",pe(n),i,a*e*.9,.035,{filter:3e3,hold:.6}),i+=a*e;i=this.ctx.currentTime+.05;for(const[n,a]of fe.bass)n&&this.tone("triangle",pe(n),i,a*e*.9,.08,{hold:.8}),this.burst(i+a*e/2,.03,.06,7e3,"highpass"),i+=a*e};s(),this.loopTimer=globalThis.setInterval(s,t*e*1e3)}stopLoop(){this.loopTimer&&globalThis.clearInterval(this.loopTimer),this.loopTimer=null}startCrowd(){const e=this.ctx.createBufferSource();e.buffer=this.noiseBuffer(),e.loop=!0;const t=this.ctx.createBiquadFilter();t.type="bandpass",t.frequency.value=700,t.Q.value=.6,this.crowdGain=this.ctx.createGain(),this.crowdGain.gain.value=0,e.connect(t),t.connect(this.crowdGain),this.crowdGain.connect(this.master),e.start()}setCrowd(e,t){if(!this.crowdGain)return;const s=t?.02+e*.05:.01;this.crowdGain.gain.setTargetAtTime(s,this.ctx.currentTime,.4)}crowdSurge(e){if(!this.crowdGain)return;const t=this.ctx.currentTime,s=this.crowdGain.gain;s.cancelScheduledValues(t),s.setValueAtTime(s.value,t),s.linearRampToValueAtTime(.06+e*.16,t+.15),s.setTargetAtTime(.04,t+.8,.8)}stop(){this.stopLoop(),this.ctx&&this.ctx.close(),this.ctx=null,this.crowdGain=null}}/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */const me={ArrowLeft:"left",ArrowRight:"right",ArrowUp:"up",ArrowDown:"down",a:"left",d:"right",w:"up",s:"down",z:"pass",x:"shoot"," ":"shoot",c:"check",v:"stick",p:"pause",Escape:"pause",r:"clip",Enter:"confirm",Backspace:"back"},ge=["pass","shoot","check","stick","pause","clip","confirm","back"],be=()=>({x:0,y:0,pass:!1,shoot:!1,check:!1,stick:!1,pause:!1,clip:!1,confirm:!1,back:!1});class ss{constructor(e){this.host=e,this.keys=new Set,this.tapped=new Set,this.prev={},this.touch={x:0,y:0,pass:!1,shoot:!1,check:!1,stick:!1,pause:!1,clip:!1,active:!1},this.onKeyDown=t=>{const s=me[t.key]||me[t.key.toLowerCase()];!s||!this.enabled||this.host.capturesKeys(t)&&(this.keys.add(s),this.tapped.add(s),["up","down","left","right","shoot"].includes(s)&&t.preventDefault())},this.onKeyUp=t=>{const s=me[t.key]||me[t.key.toLowerCase()];s&&this.keys.delete(s)},this.onBlur=()=>{this.keys.clear(),this.tapped.clear()},this.enabled=!0}attach(){globalThis.addEventListener("keydown",this.onKeyDown),globalThis.addEventListener("keyup",this.onKeyUp),globalThis.addEventListener("blur",this.onBlur)}detach(){globalThis.removeEventListener("keydown",this.onKeyDown),globalThis.removeEventListener("keyup",this.onKeyUp),globalThis.removeEventListener("blur",this.onBlur)}pads(){const e=[],t=globalThis.navigator&&globalThis.navigator.getGamepads?globalThis.navigator.getGamepads():[];for(let s=0;s<Math.min(4,t.length);s++)t[s]&&t[s].connected&&e.push({id:`pad${s}`,index:s,name:t[s].id});return e}rawKeyboard(){const e=be();return e.x=(this.keys.has("right")?1:0)-(this.keys.has("left")?1:0),e.y=(this.keys.has("down")?1:0)-(this.keys.has("up")?1:0),ge.forEach(t=>{e[t]=this.keys.has(t)}),e}rawPad(e){const t=globalThis.navigator.getGamepads()[e],s=be();if(!t)return s;const i=a=>Math.abs(a)<.25?0:a;s.x=i(t.axes[0]||0),s.y=i(t.axes[1]||0);const n=a=>!!(t.buttons[a]&&t.buttons[a].pressed);return n(14)&&(s.x=-1),n(15)&&(s.x=1),n(12)&&(s.y=-1),n(13)&&(s.y=1),s.pass=n(0),s.shoot=n(1),s.check=n(2),s.stick=n(3),s.pause=n(9),s.clip=n(8),s.confirm=n(0),s.back=n(1),s}tap(e){this.tapped.add(e)}rawTouch(){const e=be();return e.x=this.touch.x,e.y=this.touch.y,ge.forEach(t=>{e[t]=!!this.touch[t]}),e.confirm=this.touch.pass,e}poll(){const e={kb:this.rawKeyboard()};if(this.pads().forEach(s=>{e[s.id]=this.rawPad(s.index)}),this.touch.active){const s=this.rawTouch(),i=e.kb;(s.x||s.y)&&(i.x=s.x,i.y=s.y),ge.forEach(n=>{i[n]=i[n]||s[n]})}const t={};for(const s of Object.keys(e)){const i=e[s],n=this.prev[s]||be(),a=Object.assign({},i);ge.forEach(l=>{a[l]=i[l]&&!n[l]||s==="kb"&&this.tapped.has(l)});const o=Math.hypot(i.x,i.y);o>1&&(a.x=i.x/o,a.y=i.y/o);const r=l=>l>.5?1:l<-.5?-1:0;a.navX=r(i.x)!==r(n.x)?r(i.x):0,a.navY=r(i.y)!==r(n.y)?r(i.y):0,t[s]=a,this.prev[s]=i}return this.tapped.clear(),t}}class is{constructor(e,t){this.fps=t||30,this.max=Math.round((e||20)*this.fps),this.frames=[],this.acc=0}clear(){this.frames=[],this.acc=0}push(e,t){this.acc+=t,!(this.acc<1/this.fps&&this.frames.length)&&(this.acc=0,this.frames.push(e),this.frames.length>this.max&&this.frames.shift())}last(e){const t=Math.round(e*this.fps);return this.frames.slice(Math.max(0,this.frames.length-t))}}const nt=()=>{const h=globalThis.MediaRecorder;return h&&["video/webm;codecs=vp9","video/webm;codecs=vp8","video/webm","video/mp4"].find(e=>h.isTypeSupported(e))||null},as=()=>!!(globalThis.document.createElement("canvas").captureStream&&nt()),ns=(h,e,t)=>{const s=t||{},i=nt();if(!i||h.length===0)return Promise.reject(new Error("Clips are not supported in this browser"));const n=globalThis.document.createElement("canvas");n.width=256,n.height=224;const a=globalThis.document.createElement("canvas");a.width=768,a.height=672;const o=a.getContext("2d");o.imageSmoothingEnabled=!1;const r=new te(n,{hud:!0});r.setMatch(e.rules,e.teams);const l=a.captureStream(30),d=[],c=new globalThis.MediaRecorder(l,{mimeType:i,videoBitsPerSecond:4e6});return c.ondataavailable=u=>{u.data&&u.data.size&&d.push(u.data)},new Promise((u,p)=>{c.onstop=()=>u({blob:new globalThis.Blob(d,{type:i.split(";")[0]}),ext:i.indexOf("mp4")>=0?"mp4":"webm"}),c.onerror=y=>p(y.error||new Error("recording failed")),c.start();let g=0;const f=45,b=()=>{if(g<h.length){r.draw(h[g],{dt:1/30,snapCamera:g===0});const y=n.getContext("2d");Math.floor(g/15)%2===0&&(y.fillStyle="#d8343c",y.fillRect(6,22,5,5)),L(y,"REPLAY",14,21,"#ffffff",{shadow:"#000"})}else{const y=n.getContext("2d");y.fillStyle="#10131c",y.fillRect(0,0,256,224),L(y,"YOUTH HOCKEY '27",128,90,"#ff3fa4",{align:"center",scale:2,shadow:"#000"}),L(y,s.caption||"",128,120,"#ffffff",{align:"center",shadow:"#000"})}o.drawImage(n,0,0,768,672),s.onFrame&&s.onFrame(g,h.length+f),g++,g<h.length+f?globalThis.setTimeout(b,1e3/30):globalThis.setTimeout(()=>c.stop(),100)};b()})};class os{constructor(e){this.opts=e,this.rules=xe(e.level,e),this.jamboree=!this.rules.keepScore,this.team=e.team,this.rng=ae(e.seed||`tournament:${e.team}:${e.level}`);const t=this.rng.shuffle(Y.map(s=>s.id).filter(s=>s!==e.team));this.others=t,this.done=!1,this.champion=null,this.jamboree?this.rounds=[{name:"Jamboree",games:t.map(s=>({home:e.team,away:s,user:!0,played:!1}))}]:(this.rounds=[{name:"Semifinals",games:[{home:e.team,away:t[0],user:!0,played:!1},{home:t[1],away:t[2],user:!1,played:!1}]}],this.simulatePending())}gameOptions(e){return{level:this.opts.level,roller:this.opts.roller,venue:this.opts.venue,ruleset:this.opts.ruleset,strictness:this.opts.strictness,needWinner:!this.jamboree,home:e.home,away:e.away}}simulatePending(){for(const e of this.rounds)for(const t of e.games){if(t.user||t.played)continue;const{result:s}=Dt(Object.assign({seed:`${this.opts.seed||"t"}:${t.home}:${t.away}`},this.gameOptions(t)));this.record(t,s)}}record(e,t){e.played=!0,e.score={home:t.home,away:t.away},e.winner=t.winner?e[t.winner]:null,e.reason=t.reason}next(){for(const e of this.rounds){const t=e.games.find(s=>s.user&&!s.played);if(t)return t}return null}recordUser(e){const t=this.next();if(!t)return;if(this.record(t,e),this.jamboree){this.next()||(this.done=!0);return}const s=this.rounds[this.rounds.length-1];if(s.name==="Semifinals"){const i=s.games.map(o=>o.winner),n=i.includes(this.team),a={home:i[0],away:i[1],user:n,played:!1};this.rounds.push({name:"Final",games:[a]}),n||(this.simulatePending(),this.champion=a.winner,this.done=!0)}else this.champion=t.winner,this.done=!0}}const Fe=(h,e)=>{const t=globalThis.document.createElement("canvas");return t.width=h,t.height=e,t},ze=(h,e,t,s)=>{const i=le(h,e)+e*8,n=7*e+e*8,a=Fe(i,n),o=a.getContext("2d");L(o,h,e*2,e*2,"#ffffff",{scale:e});const r=f=>{const b=Fe(i,n),y=b.getContext("2d");return y.drawImage(a,0,0),y.globalCompositeOperation="source-atop",y.fillStyle=f(y),y.fillRect(0,0,i,n),b},l=r(f=>{const b=f.createLinearGradient(0,e*2,0,e*9);return t.forEach(([y,x])=>b.addColorStop(y,x)),b}),d=r(()=>s),c=r(()=>"#05060c"),u=Fe(i+e*4,n+e*4),p=u.getContext("2d");p.imageSmoothingEnabled=!1;const g=Math.max(3,Math.round(e*1.2));for(let f=g;f>=0;f--)for(const[b,y]of[[-1,0],[1,0],[0,-1],[0,1]])p.drawImage(c,f+b*2,f+y*2);for(let f=g;f>0;f--)p.drawImage(d,f,f);return p.drawImage(l,0,0),p.globalCompositeOperation="source-atop",p.fillStyle="rgba(255,255,255,0.35)",p.fillRect(0,e*2,u.width,Math.round(e*1.6)),u},ot=[[0,"#ffffff"],[.45,"#b9d6ff"],[.55,"#2a5bd7"],[1,"#e8f1ff"]],rs=[[0,"#fff6c8"],[.45,"#f2c94c"],[.55,"#b07b10"],[1,"#ffe27a"]],T={lineOn:.25,staticEnd:1.4,youth:1.6,sports:2.15,num:2.75,tagline:3.4,prompt:4.4};class Ye{constructor(e){this.canvas=e,this.ctx=e.getContext("2d"),this.ctx.imageSmoothingEnabled=!1,this.t=0,this.seed=7,this.art=null,this.sparks=Array.from({length:40},(t,s)=>({a:s*137.5%360,r:.3+s*53%70/100,s:1+s%3}))}rand(){return this.seed=this.seed*1103515245+12345&2147483647,this.seed/2147483647}build(){const e=this.canvas.width,t=Math.max(4,Math.floor(e/64));this.art={youth:ze("YOUTH",t,ot,"#0d1f5c"),sports:ze("SPORTS",t,ot,"#0d1f5c"),num:ze("27",Math.round(t*1.75),rs,"#6b3f00")},this.big=t,this.numScale=Math.round(t*1.75)}static slam(e){if(e<=0)return 0;if(e>=1)return 1;const t=1.7;return 1+(t+1)*Math.pow(e-1,3)+t*Math.pow(e-1,2)}draw(e,t){const s=t||{};this.art||this.build(),this.t=e;const i=this.ctx,n=this.canvas.width,a=this.canvas.height;if(i.save(),i.fillStyle="#04050a",i.fillRect(0,0,n,a),e<T.lineOn)i.fillStyle="rgba(200,220,255,0.8)",i.fillRect(n/2-1,a/2-1,2,2);else if(e<T.lineOn+.3){const o=(e-T.lineOn)/.3,r=Math.max(2,o*o*a);i.fillStyle="#e8f1ff",i.fillRect(0,a/2-r/2,n,r)}else{const o=i.createRadialGradient(n/2,a*.45,10,n/2,a*.45,n*.75);o.addColorStop(0,"#1d2f6b"),o.addColorStop(1,"#04050a"),i.fillStyle=o,i.fillRect(0,0,n,a);for(let r=0;r<2;r++){const l=Math.sin(e*.9+r*2.2)*.5;i.save(),i.translate(n*(.25+r*.5),a+10),i.rotate(l+(r?.25:-.25)),i.fillStyle="rgba(180,210,255,0.06)",i.beginPath(),i.moveTo(-6,0),i.lineTo(6,0),i.lineTo(70,-a*1.3),i.lineTo(-70,-a*1.3),i.fill(),i.restore()}e<T.staticEnd&&this.static(i,n,a,1-(e-T.lineOn-.3)/(T.staticEnd-T.lineOn-.3)),this.logo(i,n,a,e)}this.tv(i,n,a,e),i.restore(),s.prompt&&e>T.prompt&&Math.floor(e*2.5)%2===0&&L(i,s.prompt,n/2,Math.round(a*.86),"#ffffff",{align:"center",scale:Math.max(2,Math.floor(n/200)),shadow:"#000"})}static(e,t,s,i){const n=Math.max(0,Math.min(1,i)),a=3;for(let o=0;o<s;o+=a)for(let r=0;r<t;r+=a){const l=this.rand();if(l<.5*n+.1){const d=Math.floor(l*255*n+40);e.fillStyle=`rgba(${d},${d},${d+20},${.85*n+.1})`,e.fillRect(r,o,a,a)}}}logo(e,t,s,i){const{youth:n,sports:a,num:o}=this.art,r=this.big,l=this.numScale,d=Math.round(s*.14),c=d+r*10.5,u=c+r*3.5+r*2+l*3.5,p=(f,b,y,x,$,_)=>{const R=$+4*_;if(i<b)return;const O=Ye.slam(Math.min(1,(i-b)/.28)),F=y==="left"?-t*(1-O):y==="right"?t*(1-O):0,B=y==="top"?-s*(1-O):0,k=y==="top"?1+(1-O)*.6:1;e.save(),e.translate(Math.round(x+F),Math.round(R+B)),e.scale(k,k),e.drawImage(f,Math.round(-f.width/2),Math.round(-f.height/2)),e.restore()};p(n,T.youth,"left",t/2,d,r),p(a,T.sports,"right",t/2,c,r),p(o,T.num,"top",t/2,u,l);const g=T.num+.28;if(i>g&&i<g+.6){const f=(i-g)/.6;e.strokeStyle=`rgba(255,226,122,${1-f})`,e.lineWidth=6*(1-f)+1,e.beginPath(),e.ellipse(t/2,u,t*.6*f,s*.25*f,0,0,Math.PI*2),e.stroke()}if(i>g){const f=t/2,b=u;this.sparks.forEach((y,x)=>{const $=(y.a+i*40*(x%2?1:-1))*Math.PI/180,_=(o.width*.5+10)*y.r+Math.sin(i*3+x)*6,R=(Math.sin(i*8+x*1.3)+1)/2;e.fillStyle=`rgba(255,240,180,${.3+R*.7})`,e.fillRect(Math.round(f+Math.cos($)*_),Math.round(b+Math.sin($)*_*.5),y.s,y.s)})}if(i>T.tagline){const f=Math.max(2,Math.floor(t/220)),b="IT'S IN THE MINIVAN.",y=Math.min(b.length,Math.floor((i-T.tagline)*24));L(e,b.slice(0,y),t/2,Math.round(u+l*3.5+r*4.5),"#ff3fa4",{align:"center",scale:f,shadow:"#000"})}}tv(e,t,s,i){e.fillStyle="rgba(0,0,0,0.28)";for(let l=0;l<s;l+=3)e.fillRect(0,l,t,1);const n=i*.35%1.3*s-s*.15,a=e.createLinearGradient(0,n,0,n+s*.15);a.addColorStop(0,"rgba(255,255,255,0)"),a.addColorStop(.5,"rgba(255,255,255,0.06)"),a.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=a,e.fillRect(0,n,t,s*.15);const o=Math.sin(i*60)*.02+(this.rand()<.03?.08:0);o>0&&(e.fillStyle=`rgba(255,255,255,${o})`,e.fillRect(0,0,t,s));const r=e.createRadialGradient(t/2,s/2,Math.min(t,s)*.35,t/2,s/2,Math.max(t,s)*.72);r.addColorStop(0,"rgba(0,0,0,0)"),r.addColorStop(1,"rgba(0,0,0,0.75)"),e.fillStyle=r,e.fillRect(0,0,t,s)}}/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */const X={play:{color:"#ff3b4e",dark:"#3a0a14",lit:"#ff6a72"},options:{color:"#3b8bff",dark:"#0e1e3e",lit:"#78a0ff"},extras:{color:"#b45cff",dark:"#22103a",lit:"#c77dff"},howto:{color:"#2fe08a",dark:"#0c2a1e",lit:"#6fe3a8"},title:{color:"#5ad0ff",dark:"#0d1830",lit:"#9fe4ff"},gold:{color:"#ffd23f",dark:"#3a2c06",lit:"#ffe27a"}},Be=(h,e,t,s,i,n)=>{h.beginPath(),h.moveTo(e+n,t),h.lineTo(e+s,t),h.lineTo(e+s-n,t+i),h.lineTo(e,t+i),h.closePath(),h.fill()};class hs{constructor(e){this.canvas=e,this.ctx=e.getContext("2d"),this.accent=X.title.color,this.second=X.title.lit,this.sparks=Array.from({length:30},(t,s)=>[s*7919%997/997,s*104729%991/991,.3+s*31%97/140])}setSection(e){const t=X[e]||X.title;this.accent=t.color,this.second=t.lit}draw(e,t){const s=this.ctx,i=this.canvas.width,n=this.canvas.height,a=t?0:e*60;s.fillStyle="#07060e",s.fillRect(0,0,i,n);for(let r=0;r<6;r++)s.fillStyle=`rgba(13,11,26,${1-r*.12})`,s.fillRect(0,n-60+r*10,i,10);const o=a*.25%80;s.globalAlpha=.08,s.fillStyle=this.accent,Be(s,i*.58+o*.5,-10,i*.55,n+20,n*.45),s.globalAlpha=.07,s.fillStyle=this.second,Be(s,i*.72+o*.5,-10,i*.18,n+20,n*.45),s.globalAlpha=.05,s.fillStyle=this.accent,Be(s,-i*.3-o*.3,-10,i*.42,n+20,n*.45),s.globalAlpha=1;for(let r=0;r<12;r++){const l=this.sparks[r],d=20+l[1]*(n-40),c=30+l[2]*90,u=(l[0]*i*2+a*(3+l[2]*6))%(i+c*2)-c;s.globalAlpha=.06+l[2]*.08,s.fillStyle=r%3?this.accent:"#e8e4ff",s.fillRect(u,d,c,1)}for(let r=12;r<this.sparks.length;r++){const l=this.sparks[r],d=(Math.sin(a*.05+r*1.7)+1)/2;s.globalAlpha=.15+d*.4,s.fillStyle=r%2?this.accent:"#e8e4ff";const c=d>.8?2:1;s.fillRect(l[0]*i,l[1]*n,c,c)}s.globalAlpha=1;for(let r=0;r<4;r++)s.fillStyle="rgba(0,0,0,0.12)",s.fillRect(0,r*4,i,4),s.fillRect(0,n-(r+1)*4,i,4)}}const rt={play:["..........",".##....##.","..##..##..","...####...","....##....","...####...","..##..##..",".##....##.",".........."],puck:["..........","..######..",".########.",".#******#.",".########.","..######..",".........."],options:["....##....",".#.####.#.","..######..",".###..###.","###....###",".###..###.","..######..",".#.####.#.","....##...."],extras:["...####...","..#....#..","##########","#........#","#..****..#","#..*..*..#","#..****..#","#........#","##########"],howto:["##########","#........#","#.******.#","#........#","#.****...#","#........#","#.*****..#","#........#","##########"],trophy:["##########","#.######.#","#.######.#",".#.####.#.","...####...","....##....","....##....","..######..","..######.."],back:["...#......","..##......",".#######..","########..",".#######..","..##...#..","...#...#..",".......#..","..#####..."]},ls=(h,e,t)=>{const s=rt[h]||rt.puck,i=s[0].length,n=s.length;let a="";return s.forEach((o,r)=>{for(let l=0;l<o.length;l++)o[l]!=="."&&(a+=`<rect x="${l}" y="${r}" width="1" height="1" fill="${o[l]==="*"?t||"#ffffff":e}"/>`)}),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${i} ${n}" shape-rendering="crispEdges">${a}</svg>`},cs=(h,e,t)=>`data:image/svg+xml,${encodeURIComponent(ls(h,e,t))}`;class ds{constructor(e){this.rng=e.rng,this.toughness=typeof e.toughness=="number"?e.toughness:.5,this.time=45,this.you={hp:100,stars:0,dodge:null,block:!1,stun:0,punch:null,cooldown:0},this.them={hp:100,state:"idle",timer:1.2,guard:"high",punch:null},this.result=null,this.messages=[],this.hits={you:0,them:0}}say(e){this.messages.push({text:e,at:this.time}),this.messages.length>4&&this.messages.shift()}update(e,t){if(this.result)return;const s=t||{},i=this.you,n=this.them;if(this.time-=e,i.cooldown=Math.max(0,i.cooldown-e),i.stun=Math.max(0,i.stun-e),i.punch&&(i.punch.t-=e,i.punch.t<=0&&(i.punch=null)),i.dodge=i.stun>0?null:s.left?"left":s.right?"right":null,i.block=i.stun<=0&&!i.dodge&&!!s.down,i.stun<=0&&i.cooldown<=0&&!i.dodge&&(s.star&&i.stars>0?this.youPunch("star",!!s.up):s.jab?this.youPunch("jab",!!s.up):s.hook&&this.youPunch("hook",!!s.up)),this.themUpdate(e),n.hp<=0&&!this.result)n.hp=0,n.state="down",this.finish("you","KO");else if(i.hp<=0&&!this.result)i.hp=0,this.finish("them","KO");else if(this.time<=0&&!this.result){this.time=0;const a=i.hp-n.hp;this.finish(a>5?"you":a<-5?"them":"draw","TIME")}}youPunch(e,t){const s=this.you,i=this.them;s.cooldown=e==="star"?.8:e==="hook"?.45:.3,s.punch={kind:e,high:t,t:.18};const n=i.state==="stunned",a=i.state==="tell"&&this.rng.chance(.35),o=(i.state==="idle"||i.state==="hit")&&(t?i.guard==="low":i.guard==="high");let r=e==="star"?26:e==="hook"?9:6;t&&e!=="star"&&(r+=2),e==="star"&&(s.stars-=1),n||a||o||e==="star"&&this.rng.chance(.5)?(n&&(r=Math.round(r*1.5)),i.hp-=r,this.hits.you++,n&&!this.counterStar?(s.stars=Math.min(3,s.stars+1),this.counterStar=!0,this.say("COUNTER! \u2605")):e==="star"&&this.say("STAR PUNCH!"),n||(i.state="hit",i.timer=.25)):this.say("BLOCKED")}themUpdate(e){const t=this.them,s=this.you;if(t.timer-=e,!(t.timer>0))switch(t.state){case"idle":case"hit":t.state="tell",t.punch={high:this.rng.chance(.55),side:this.rng.chance(.5)?"left":"right"},t.timer=.75-this.toughness*.3;break;case"tell":t.state="punch",t.timer=.14;break;case"punch":{const i=t.punch;s.dodge?(t.state="stunned",t.timer=1.3,this.counterStar=!1,this.say("DODGE!")):s.block?(s.hp-=i.high?4:2,t.state="idle",t.timer=.6,this.say("BLOCK")):(s.hp-=i.high?13:9,s.stun=.4,this.hits.them++,t.state="idle",t.timer=.5+this.rng.next()*.6,this.say("OOF")),t.punch=null;break}default:t.state="idle",t.guard=this.rng.chance(.5)?"high":"low",t.timer=.6+this.rng.next()*(.9-this.toughness*.4);break}}finish(e,t){this.result={winner:e,how:t,you:Math.max(0,Math.round(this.you.hp)),them:Math.max(0,Math.round(this.them.hp))}}}const ht="youth-sports-27:unlocks",us=()=>{try{const h=globalThis.localStorage.getItem(ht),e=h?JSON.parse(h):null;if(e&&Array.isArray(e.unlocked))return e}catch{}return{unlocked:[],active:[]}},lt=h=>{try{globalThis.localStorage.setItem(ht,JSON.stringify(h))}catch{}};class ps{constructor(){this.data=us()}has(e){return this.data.unlocked.includes(e)}add(e){return this.has(e)?!1:(this.data.unlocked.push(e),lt(this.data),!0)}addAll(){return je.filter(e=>this.add(e))}list(e){return this.data.unlocked.filter(t=>!e||t.startsWith(`${e}:`)).map(t=>t.split(":")[1])}isActive(e){return(this.data.active||[]).includes(e)}toggle(e){const t=new Set(this.data.active||[]);return t.has(e)?t.delete(e):t.add(e),this.data.active=Array.from(t),lt(this.data),t.has(e)}activeModifiers(){return(this.data.active||[]).filter(e=>this.has(`modifier:${e}`))}}/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */const De={goal:5,save:3,hit:2,block:2,"stick-break":4,"faceoff-won":1},ct=h=>{const e=`#${h.number}`;switch(h.type){case"goal":return`${e} SCORES \u{1F6A8}`;case"save":return`${e} with the robbery \u{1F9E4}`;case"hit":return`${e} lays the body \u{1F4A5}`;case"block":return`${e} sacrifices the body \u{1FAE1}`;case"stick-break":return`${e} broke a $349 stick \u{1F4B8}`;default:return`${e} doing ${e} things`}},fs=(h,e,t)=>h.filter(s=>s.side===e&&De[s.type]).sort((s,i)=>De[i.type]-De[s.type]||i.t-s.t).slice(0,t),ms=h=>{const{ours:e,theirs:t,kid:s,keepScore:i,chosen:n,period:a}=h,o=e-t,r=[];return!i&&o>0&&r.push(`Nobody keeps score at this age but we're up ${Math.max(e,t)}-${Math.min(e,t)} \u{1F609}`),o<0?r.push("Tough one so far. Not gonna say anything, but Billy has played A LOT today. \u{1F644} #justsaying #icetime"):o===1?r.push("Shoutout to the AMAZING coaches!!! \u{1F64C} Best staff in the league, so blessed to have them \u{1F499} #coachappreciation"):o>=2?r.push(`${s} carrying the team AGAIN \u{1F4AA} Scouts please take note #future #D1bound`):r.push("Refs are BLIND today. Just saying. \u{1F993} #zebras #ridiculous"),n&&n.length&&r.push(n.map(ct).join(" / ")),r.push(`After ${a===1?"the 1st":"the 2nd"} period \u{1F3D2}`),r.join(`
`)},ye={losing:[["Billy's mom","\u{1F440}"],["Coach Dave","Reminder: please see the team social media policy."],["Hockey Dad Rick","Ice time is earned. Just saying."],["Aunt Linda","Which one is Billy?"]],close:[["Coach Dave","Thank you! \u{1F64F} (please stop tagging me)"],["Team Manager","Reminder: snack schedule is in the group chat."],["Grandma","So proud!! Which one is he?"]],winning:[["Hockey Dad Rick","Elite showcase this summer?? DM me"],["Grandma","So proud!! Which one is he?"],["Skills Coach Brayden","Private lessons paying off \u{1F624} $95/hr, link in bio"]],tied:[["Other Team Mom","Refs called it both ways tbh"],["Coach Dave","Reminder: please see the team social media policy."],["Grandma","Who are the zebras?"]]},dt=h=>h<0?ye.losing:h===1?ye.close:h>=2?ye.winning:ye.tied,ut=(h,e)=>(h<0?40:h===1?18:h>=2?64:27)+(e?e.length*11:0),gs=bt`
  :host {
    display: block;
    --yh-pink: #ff3fa4;
    --yh-ink: #07060e;
    --yh-panel: #14112a;
    --yh-panel2: #1c1838;
    --yh-edge: #e8e4ff;
    --yh-dim: #8a87a3;
    --yh-gold: #ffd23f;
    --yh-accent: #5ad0ff;
    --yh-font: 'Press Start 2P', var(--ddd-font-navigation, monospace);
    color: #ffffff;
    font-family: var(--yh-font);
    max-width: 820px;
    margin: 0 auto;
    -webkit-font-smoothing: none;
  }
  :host(:fullscreen) {
    max-width: none;
    width: 100vw;
    height: 100vh;
    background: #000;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  :host(:fullscreen) .shell {
    width: min(100vw, calc((100vh - 150px) * 1.143 + 0px));
    max-height: 100vh;
  }
  :host(:fullscreen) .menu {
    min-height: min(100vh, calc(100vw * 0.66));
  }
  .shell {
    background: var(--yh-ink);
    border: 3px solid var(--yh-accent);
    box-shadow: 6px 6px 0 #000;
    position: relative;
    overflow: hidden;
    width: 100%;
  }
  :host([attract]) .shell {
    border-width: 1px;
    box-shadow: none;
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  /* ---------- intro ---------- */
  .intro {
    position: relative;
    cursor: pointer;
    background: #000;
  }
  .intro canvas {
    display: block;
    width: 100%;
    aspect-ratio: 512 / 448;
    image-rendering: pixelated;
  }
  .intro button.skip {
    position: absolute;
    inset: 0;
    opacity: 0;
    width: 100%;
    cursor: pointer;
  }

  .intro-start {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    pointer-events: none;
    color: var(--yh-gold);
    font-size: 18px;
    text-shadow: 3px 3px 0 #000;
    background: repeating-linear-gradient(#000 0 2px, rgba(30, 30, 40, 0.6) 2px 4px);
    animation: tvidle 1.2s steps(2) infinite;
  }
  .intro-start small {
    font-size: 8px;
    color: #c9c4dc;
  }
  @keyframes tvidle {
    50% {
      opacity: 0.6;
    }
  }

  /* ---------- menus ---------- */
  .menu {
    position: relative;
    min-height: 560px;
    padding: 56px 18px 46px;
    box-sizing: border-box;
  }
  .menu canvas.bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    image-rendering: pixelated;
  }
  .menu > *:not(canvas) {
    position: relative;
    z-index: 1;
  }
  .topbar {
    position: absolute !important;
    top: 10px;
    left: 10px;
    right: 10px;
    display: flex;
    justify-content: space-between;
    z-index: 3 !important;
  }
  button,
  a.btn {
    font-family: var(--yh-font);
    font-size: 10px;
    color: #fff;
    background: #2e246c;
    border: 0;
    padding: 9px 14px;
    cursor: pointer;
    clip-path: polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%);
    filter: drop-shadow(3px 3px 0 #000);
    text-decoration: none;
    display: inline-block;
    line-height: 1.3;
  }
  button:hover,
  button:focus-visible,
  a.btn:hover,
  a.btn:focus-visible {
    background: #5a46d8;
    outline: none;
    box-shadow: inset 0 -2px 0 var(--yh-gold);
  }
  button[disabled] {
    opacity: 0.45;
    cursor: not-allowed;
  }
  button.go,
  a.btn.go {
    background: var(--yh-accent);
    color: #07060e;
    font-size: 12px;
    padding: 12px 22px;
  }
  button.go:focus-visible,
  button.go:hover {
    background: var(--yh-gold);
  }
  .logo {
    text-align: center;
    margin: 0 0 18px;
    font-size: 30px;
    letter-spacing: 2px;
    line-height: 1.1;
    text-shadow: 4px 4px 0 #07060e;
  }
  .logo .small {
    display: block;
    font-size: 10px;
    color: #78a0c6;
    letter-spacing: 6px;
    margin-bottom: 6px;
    text-shadow: 2px 2px 0 #000;
  }
  .logo .ch {
    display: inline-block;
    animation: rainbow 2.4s linear infinite;
    -webkit-text-stroke: 2px #07060e;
  }
  @keyframes rainbow {
    0% {
      color: #ff5a6e;
    }
    20% {
      color: #ffd23f;
    }
    40% {
      color: #6fe3a8;
    }
    60% {
      color: #5ad0ff;
    }
    80% {
      color: #c77dff;
    }
    100% {
      color: #ff5a6e;
    }
  }
  .hub {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .tile {
    --c: var(--yh-accent);
    --d: #0d1830;
    position: relative;
    display: flex;
    align-items: center;
    gap: 14px;
    min-height: 150px;
    padding: 18px 24px 18px 30px;
    background: color-mix(in srgb, var(--c) 55%, #000);
    clip-path: polygon(18px 0, 100% 0, calc(100% - 18px) 100%, 0 100%);
    filter: drop-shadow(7px 7px 0 rgba(0, 0, 0, 0.6));
    text-align: left;
    transition: transform 0.12s ease-out;
  }
  .tile::before {
    content: '';
    position: absolute;
    inset: 4px;
    background: repeating-linear-gradient(115deg, transparent 0 34px, color-mix(in srgb, var(--c) 18%, transparent) 34px 48px), var(--d);
    clip-path: polygon(16px 0, 100% 0, calc(100% - 16px) 100%, 0 100%);
    background-size: 200% 100%;
    animation: stripes 6s linear infinite;
    z-index: -1;
  }
  .tile:focus-visible,
  .tile:hover,
  .tile.on {
    background: var(--c);
    transform: scale(1.03) translate(-3px, -3px);
    box-shadow: none;
  }
  .tile:focus-visible::before,
  .tile.on::before {
    animation-duration: 1.6s;
    opacity: 0.85;
  }
  @keyframes stripes {
    to {
      background-position: -200% 0;
    }
  }
  .tile img {
    width: 64px;
    height: 64px;
    image-rendering: pixelated;
    flex: none;
  }
  .tile .name {
    font-size: 20px;
    display: block;
    text-shadow: 3px 3px 0 #07060e;
  }
  .tile .sub {
    font-size: 8px;
    color: #c9c4dc;
    display: block;
    margin-top: 10px;
    line-height: 1.6;
  }
  .banner {
    display: inline-block;
    font-size: 16px;
    padding: 10px 46px 10px 18px;
    background: linear-gradient(110deg, var(--yh-accent) 0 85%, #fff 85% 88%, var(--yh-accent) 88% 91%, rgba(255, 255, 255, 0.5) 91% 93%, var(--yh-accent) 93%);
    clip-path: polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%);
    filter: drop-shadow(5px 5px 0 #000);
    text-shadow: 3px 3px 0 #07060e;
    margin-bottom: 4px;
    animation: slidein 0.26s cubic-bezier(0.2, 1.4, 0.5, 1);
  }
  .crumb {
    font-size: 7px;
    color: var(--yh-accent);
    margin-left: 12px;
  }
  @keyframes slidein {
    from {
      transform: translateX(-120%);
    }
  }
  .panels {
    display: grid;
    grid-template-columns: 1.25fr 1fr;
    gap: 16px;
    margin-top: 16px;
  }
  .panel {
    position: relative;
    background: var(--yh-panel);
    padding: 22px 16px 16px;
    clip-path: polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
    filter: drop-shadow(5px 5px 0 rgba(0, 0, 0, 0.55));
    border-bottom: 3px solid var(--yh-accent);
  }
  .panel h3 {
    position: absolute;
    top: -2px;
    left: 12px;
    margin: 0;
    font-size: 8px;
    padding: 4px 14px;
    background: var(--yh-accent);
    color: #07060e;
    clip-path: polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%);
  }
  .rows {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 6px;
  }
  .row {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 8px;
    width: 100%;
    font-size: 9px;
    color: #c9c4dc;
    background: var(--yh-panel2);
    padding: 9px 12px 9px 26px;
    clip-path: polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%);
    filter: none;
    text-align: left;
    position: relative;
  }
  .row .val {
    color: #fff;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .row .val img {
    width: 18px;
    height: 18px;
    image-rendering: pixelated;
  }
  .row .arrows {
    color: var(--yh-gold);
  }
  .row:focus-visible,
  .row.on {
    background: var(--yh-accent);
    color: #fff;
    box-shadow: inset 0 -2px 0 rgba(255, 255, 255, 0.25);
  }
  .row:focus-visible::before,
  .row.on::before {
    content: '';
    position: absolute;
    left: 10px;
    top: 50%;
    border: 5px solid transparent;
    border-left: 6px solid #fff;
    transform: translateY(-50%);
    animation: nudge 0.5s ease-in-out infinite alternate;
  }
  @keyframes nudge {
    to {
      left: 14px;
    }
  }
  .row.back {
    color: var(--yh-gold);
  }
  .matchup {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    text-align: center;
    gap: 8px;
    font-size: 8px;
    line-height: 1.6;
  }
  .matchup img {
    width: 84px;
    height: 84px;
    image-rendering: pixelated;
    display: block;
    margin: 0 auto 6px;
    filter: drop-shadow(4px 4px 0 #000);
  }
  .vs {
    font-size: 18px;
    color: var(--yh-gold);
    text-shadow: 3px 3px 0 #000;
  }
  .note {
    font-size: 8px;
    line-height: 1.8;
    color: #c9c4dc;
    margin: 12px 0 0;
  }
  .note.warn {
    color: #ff8fd0;
  }
  .hint {
    position: absolute !important;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.72);
    border-top: 1px solid var(--yh-accent);
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px 14px;
    padding: 7px 10px;
    font-size: 7px;
    color: #c9c4dc;
  }
  .hint kbd {
    font-family: var(--yh-font);
    font-size: 7px;
    background: var(--yh-edge);
    color: #07060e;
    padding: 2px 4px;
    margin-right: 4px;
    box-shadow: inset 0 -1px 0 var(--yh-accent);
  }
  .list {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 16px;
    margin-top: 16px;
  }
  .detail h4 {
    font-size: 14px;
    margin: 4px 0 14px;
    text-shadow: 3px 3px 0 #000;
  }
  .detail p,
  .detail li {
    font-size: 8px;
    line-height: 2;
    color: #e8e4f4;
  }
  .detail ul {
    padding-left: 16px;
  }
  .cheat {
    display: grid;
    gap: 10px;
  }
  .cheat input {
    font-family: var(--yh-font);
    font-size: 14px;
    text-transform: uppercase;
    background: #07060e;
    color: var(--yh-gold);
    border: 2px solid var(--yh-accent);
    padding: 10px;
    letter-spacing: 4px;
  }
  .cheat input:focus-visible {
    outline: 2px solid var(--yh-gold);
  }
  .keys {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    gap: 4px;
  }
  .keys button {
    padding: 7px 0;
    font-size: 9px;
  }
  .keys button.wide {
    grid-column: span 2;
  }
  .unlocked {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 6px;
  }
  .unlocked .row {
    grid-template-columns: 1fr auto;
  }
  .toast {
    position: absolute !important;
    left: 50%;
    bottom: 54px;
    transform: translateX(-50%);
    background: #16132a;
    color: var(--yh-gold);
    font-size: 9px;
    padding: 10px 14px;
    border: 2px solid var(--yh-gold);
    z-index: 5 !important;
    white-space: nowrap;
  }

  /* ---------- the game ---------- */
  .stands {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px;
    background: #0b0e16;
    height: 104px;
    overflow: hidden;
    border-bottom: 2px solid var(--yh-gold);
  }
  .stands.empty {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 9px;
    color: #c9c4dc;
    background: repeating-linear-gradient(90deg, #121624 0 30px, #0f1220 30px 60px);
    line-height: 1.8;
    text-align: center;
  }
  .side {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-end;
    padding: 2px 6px 0;
    position: relative;
  }
  .side.away {
    justify-content: flex-end;
  }
  .section {
    display: flex;
    align-items: flex-end;
    position: relative;
    margin: 0 2px;
  }
  .section .tag {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    font-size: 7px;
    background: rgba(0, 0, 0, 0.7);
    padding: 1px 3px;
    z-index: 2;
    white-space: nowrap;
  }
  .fan {
    position: relative;
    width: 30px;
    height: 46px;
    margin: 0 -5px;
  }
  .fan rpg-character {
    width: 36px;
    height: 46px;
    display: block;
  }
  .fan.jump {
    animation: hop 0.5s ease-in-out infinite;
  }
  .fan.wild {
    animation: wild 0.35s ease-in-out infinite;
    z-index: 3;
  }
  .fan.fight {
    animation: shake 0.12s linear infinite;
    z-index: 3;
  }
  .fan.fight::after {
    content: '!!';
    position: absolute;
    top: -2px;
    left: 50%;
    transform: translateX(-50%);
    color: #ff5252;
    font-size: 10px;
    text-shadow: 1px 1px 0 #000;
  }
  .fan .bill {
    position: absolute;
    top: 2px;
    left: 50%;
    width: 18px;
    height: 9px;
    margin-left: -9px;
    background: #4caf50;
    border: 1px solid #1b5e20;
    color: #0b3d0e;
    font-size: 7px;
    line-height: 8px;
    text-align: center;
    animation: wave 0.3s ease-in-out infinite alternate;
    z-index: 4;
  }
  @keyframes hop {
    50% {
      transform: translateY(-4px);
    }
  }
  @keyframes wild {
    0% {
      transform: translateY(0) rotate(-6deg);
    }
    50% {
      transform: translateY(-12px) rotate(6deg);
    }
    100% {
      transform: translateY(0) rotate(-6deg);
    }
  }
  @keyframes shake {
    0% {
      transform: translateX(-2px);
    }
    50% {
      transform: translateX(2px);
    }
  }
  @keyframes wave {
    from {
      transform: rotate(-15deg) translateY(0);
    }
    to {
      transform: rotate(15deg) translateY(-3px);
    }
  }
  .stage {
    position: relative;
    outline: none;
  }
  .stage:focus-visible {
    box-shadow: inset 0 0 0 2px var(--yh-gold);
  }
  canvas#rink {
    display: block;
    width: 100%;
    aspect-ratio: 256 / 224;
    image-rendering: pixelated;
    background: #141826;
  }
  :host(:fullscreen) canvas#rink {
    width: auto;
    height: calc(100vh - 150px);
    margin: 0 auto;
  }
  .overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(7, 6, 14, 0.62);
    padding: 14px;
    z-index: 5;
  }
  .card {
    background: var(--yh-panel);
    border-bottom: 3px solid var(--yh-accent);
    clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
    filter: drop-shadow(6px 6px 0 #000);
    padding: 22px 24px;
    max-width: 480px;
    width: 100%;
    font-size: 9px;
    line-height: 1.9;
  }
  .card h3 {
    font-size: 13px;
    margin: 0 0 10px;
    text-shadow: 3px 3px 0 #000;
  }
  .card .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 14px;
  }
  .card .actions.stack {
    flex-direction: column;
  }
  .card .actions.stack button {
    text-align: left;
  }
  .card .kicker {
    font-size: 7px;
    color: var(--yh-accent);
  }
  .penalty .label {
    font-size: 16px;
    color: #ffd740;
    text-shadow: 3px 3px 0 #000;
  }
  .intermission .people {
    display: flex;
    gap: 8px;
    float: right;
    margin-left: 12px;
  }
  .intermission .people rpg-character {
    width: 56px;
    height: 72px;
  }
  .phone-wrap {
    display: flex;
    align-items: flex-end;
    gap: 12px;
  }
  .phone {
    background: #111;
    border-radius: 14px;
    padding: 14px 6px;
    border: 2px solid #444;
    position: relative;
  }
  .phone canvas {
    display: block;
    width: 160px;
    height: 266px;
    image-rendering: pixelated;
    border-radius: 4px;
  }
  .phone .rec {
    position: absolute;
    top: 20px;
    left: 12px;
    font-size: 8px;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .phone .rec::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #d8343c;
  }
  .bubble {
    background: #fff;
    color: #111;
    border-radius: 10px;
    padding: 12px;
    max-width: 210px;
    font-size: 8px;
    line-height: 1.8;
    margin-bottom: 80px;
  }
  .caller rpg-character {
    width: 64px;
    height: 82px;
  }
  .toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 8px;
    background: #0b0e16;
    align-items: center;
  }
  .toolbar .spacer {
    flex: 1;
  }
  .toolbar button {
    font-size: 8px;
    padding: 7px 12px;
  }
  .help {
    font-size: 7px;
    line-height: 1.8;
    color: #a2aaad;
    padding: 0 10px 8px;
    background: #0b0e16;
    margin: 0;
  }
  :host(:fullscreen) .help {
    display: none;
  }
  .touch {
    display: none;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: #0b0e16;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
  }
  .touch.on {
    display: flex;
  }
  .joy {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: #182035;
    border: 2px solid #2b3a55;
    position: relative;
  }
  .knob {
    position: absolute;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--yh-pink);
    left: 36px;
    top: 36px;
    pointer-events: none;
  }
  .pad-buttons {
    display: grid;
    grid-template-columns: repeat(2, 64px);
    gap: 10px;
  }
  .pad-buttons button {
    height: 52px;
    clip-path: none;
    border-radius: 26px;
    padding: 0;
    font-size: 8px;
  }

  /* stick break: a picture-in-picture close-up */
  .pip {
    position: absolute;
    top: 22px;
    right: 14px;
    width: 34%;
    aspect-ratio: 4 / 3;
    border: 3px solid #fff;
    box-shadow: 4px 4px 0 #000;
    overflow: hidden;
    z-index: 4;
    pointer-events: none;
    background: #000;
    animation: pipin 0.25s ease-out;
  }
  @keyframes pipin {
    from {
      transform: scale(0.2);
      opacity: 0;
    }
  }
  .pip canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    image-rendering: pixelated;
  }
  .pip .burst {
    position: absolute;
    inset: -40%;
    background: repeating-conic-gradient(from 0deg, rgba(90, 200, 255, 0.85) 0 6deg, rgba(255, 255, 255, 0) 6deg 14deg);
    mix-blend-mode: screen;
    animation: spin 0.6s linear infinite, flash 0.5s ease-out 2 alternate;
    mask-image: radial-gradient(circle, transparent 18%, #000 30%);
    -webkit-mask-image: radial-gradient(circle, transparent 18%, #000 30%);
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes flash {
    from {
      filter: brightness(2.2);
    }
  }
  .pip .half {
    position: absolute;
    top: 46%;
    left: 46%;
    width: 22%;
    height: 5%;
    background: #a0522d;
    box-shadow: 2px 2px 0 #000;
  }
  .pip .half.a {
    animation: snapA 0.9s ease-out forwards;
  }
  .pip .half.b {
    animation: snapB 0.9s ease-out forwards;
  }
  @keyframes snapA {
    to {
      transform: translate(-140%, -260%) rotate(-260deg);
    }
  }
  @keyframes snapB {
    to {
      transform: translate(150%, -200%) rotate(300deg);
    }
  }
  .pip .money {
    position: absolute;
    top: 45%;
    left: 50%;
    font-size: 18px;
    animation: money 1.6s ease-out forwards;
    opacity: 0;
  }
  @keyframes money {
    0% {
      opacity: 1;
      transform: translate(-50%, 0) scale(0.4);
    }
    100% {
      opacity: 0;
      transform: translate(var(--dx), var(--dy)) rotate(var(--r)) scale(1.2);
    }
  }
  .pip .cap {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.75);
    font-size: 7px;
    text-align: center;
    padding: 4px;
    color: #fff;
  }
  .pip .cap strong {
    color: #5ad0ff;
  }

  /* the brawl */
  .brawl {
    position: absolute;
    inset: 0;
    z-index: 6;
    background: linear-gradient(#1a1430, #07060e 70%);
    overflow: hidden;
    font-size: 8px;
  }
  .brawl .bleachers {
    position: absolute;
    left: 0;
    right: 0;
    top: 34px;
    height: 34%;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: 8px;
    background: repeating-linear-gradient(#2b2450 0 6px, #1f1a3c 6px 30px);
    opacity: 0.85;
  }
  .brawl .bleachers rpg-character {
    width: 44px;
    height: 56px;
  }
  .brawl .bleachers .fan.fight {
    animation: shake 0.1s linear infinite;
  }
  .brawl .kids {
    position: absolute;
    left: 4%;
    bottom: 6%;
    display: flex;
    gap: 2px;
    align-items: flex-end;
  }
  .brawl .kids rpg-character {
    width: 46px;
    height: 58px;
  }
  .brawl .kids .tear {
    position: absolute;
    top: -12px;
    font-size: 8px;
    color: #9fe4ff;
  }
  .brawl .them {
    position: absolute;
    left: 50%;
    bottom: 20%;
    transform: translateX(-50%);
    transition: transform 0.08s;
  }
  .brawl .them rpg-character {
    width: 190px;
    height: 240px;
    display: block;
  }
  .brawl .them.tell {
    animation: shake 0.1s linear infinite;
    filter: drop-shadow(0 0 10px #ff3b4e);
  }
  .brawl .them.punch {
    transform: translateX(-50%) scale(1.18) translateY(14px);
  }
  .brawl .them.stunned {
    filter: drop-shadow(0 0 12px #ffd23f);
  }
  .brawl .them.hit {
    filter: brightness(2.5);
  }
  .brawl .them.down {
    transform: translateX(-50%) rotate(80deg) translateY(30%);
    transition: transform 0.6s;
  }
  .brawl .bang {
    position: absolute;
    top: -6%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 30px;
    color: #ff3b4e;
    text-shadow: 3px 3px 0 #000;
  }
  .brawl .dizzy {
    position: absolute;
    top: -2%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 16px;
    color: #ffd23f;
    animation: spin 1s linear infinite;
  }
  .brawl .you {
    position: absolute;
    left: 50%;
    bottom: -8%;
    width: 150px;
    height: 170px;
    transform: translateX(-50%);
    transition: transform 0.08s;
  }
  .brawl .you.left {
    transform: translateX(-120%);
  }
  .brawl .you.right {
    transform: translateX(20%);
  }
  .brawl .you.block {
    transform: translateX(-50%) translateY(18px);
  }
  .brawl .you.stun {
    filter: brightness(2) saturate(0);
  }
  .brawl .you .head {
    position: absolute;
    left: 50%;
    top: 0;
    width: 70px;
    height: 74px;
    margin-left: -35px;
    border-radius: 45% 45% 40% 40%;
    background: var(--hair, #4a3020);
    box-shadow: inset -8px -6px 0 rgba(0, 0, 0, 0.3);
  }
  .brawl .you .body {
    position: absolute;
    left: 50%;
    top: 60px;
    width: 150px;
    height: 120px;
    margin-left: -75px;
    border-radius: 50px 50px 0 0;
    background: var(--jersey, #ff3fa4);
    box-shadow: inset -12px 0 0 rgba(0, 0, 0, 0.25);
  }
  .brawl .you .fist {
    position: absolute;
    top: 52px;
    width: 40px;
    height: 36px;
    border-radius: 12px;
    background: #f3d2a2;
    border: 3px solid #07060e;
    transition: transform 0.06s;
  }
  .brawl .you .fist.l {
    left: 0;
  }
  .brawl .you .fist.r {
    right: 0;
  }
  .brawl .you .fist.go {
    transform: translateY(-120px) scale(1.4);
  }
  .brawl .you .fist.go.high {
    transform: translateY(-170px) scale(1.4);
  }
  .brawl .hud {
    position: absolute;
    top: 8px;
    left: 10px;
    right: 10px;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 10px;
    align-items: center;
    z-index: 2;
  }
  .brawl .bar {
    height: 12px;
    background: #2a2448;
    border: 2px solid #fff;
    position: relative;
  }
  .brawl .bar span {
    position: absolute;
    inset: 0;
    background: linear-gradient(#ff8fd0, #ff3fa4);
    transform-origin: left;
  }
  .brawl .bar.them span {
    background: linear-gradient(#ffb36b, #ff7a1a);
  }
  .brawl .clock {
    font-size: 14px;
    color: var(--yh-gold);
    text-shadow: 2px 2px 0 #000;
  }
  .brawl .who {
    font-size: 7px;
    margin-bottom: 3px;
  }
  .brawl .stars {
    color: var(--yh-gold);
    letter-spacing: 2px;
  }
  .brawl .msg {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 18px;
    color: #fff;
    text-shadow: 3px 3px 0 #000;
    z-index: 3;
    white-space: nowrap;
  }
  .brawl .hint {
    z-index: 3;
  }

  /* BookFace */
  .bf {
    background: #f0f2f5;
    color: #1c1e21;
    width: 100%;
    max-width: 520px;
    max-height: 100%;
    overflow: auto;
    font-family: system-ui, sans-serif;
    font-size: 13px;
    box-shadow: 6px 6px 0 #000;
  }
  .bf header {
    background: #3b5ad9;
    color: #fff;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 800;
    font-size: 20px;
    letter-spacing: -1px;
  }
  .bf header small {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0;
  }
  .bf .post {
    background: #fff;
    margin: 10px;
    padding: 12px;
    border-radius: 8px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
  .bf .who {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
  }
  .bf .who rpg-character {
    width: 36px;
    height: 44px;
    background: #e4e6eb;
    border-radius: 50%;
    overflow: hidden;
  }
  .bf .who small {
    display: block;
    font-weight: 400;
    color: #65676b;
    font-size: 11px;
  }
  .bf .text {
    white-space: pre-line;
    margin: 10px 0;
    line-height: 1.4;
  }
  .bf .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
  }
  .bf .thumb {
    position: relative;
    padding: 0;
    border: 3px solid transparent;
    background: #000;
    clip-path: none;
    filter: none;
    cursor: pointer;
    border-radius: 4px;
  }
  .bf .thumb[aria-pressed='true'] {
    border-color: #3b5ad9;
  }
  .bf .thumb canvas {
    display: block;
    width: 100%;
    aspect-ratio: 4 / 3;
    image-rendering: pixelated;
  }
  .bf .thumb span {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    font-size: 11px;
    padding: 3px 5px;
    text-align: left;
  }
  .bf .likes {
    display: flex;
    justify-content: space-between;
    color: #65676b;
    border-bottom: 1px solid #ced0d4;
    padding: 6px 0;
    font-size: 12px;
  }
  .bf .comment {
    display: flex;
    gap: 6px;
    margin-top: 8px;
  }
  .bf .comment div {
    background: #f0f2f5;
    border-radius: 14px;
    padding: 6px 10px;
  }
  .bf .comment b {
    display: block;
    font-size: 12px;
  }
  .bf .actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 0 10px 10px;
  }
  .bf button {
    font-family: system-ui, sans-serif;
    font-size: 13px;
    font-weight: 700;
    background: #3b5ad9;
    clip-path: none;
    filter: none;
    border-radius: 6px;
  }
  .bf button.plain {
    background: #e4e6eb;
    color: #1c1e21;
  }

  /* final, bracket */
  .scoreline {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 14px;
    margin: 14px 0;
    text-align: center;
    font-size: 9px;
    line-height: 1.6;
  }
  .scoreline img {
    width: 70px;
    height: 70px;
    image-rendering: pixelated;
    display: block;
    margin: 0 auto 6px;
  }
  .scoreline .big {
    font-size: 28px;
    color: var(--yh-gold);
    text-shadow: 4px 4px 0 #000;
  }
  table.stats {
    width: 100%;
    border-collapse: collapse;
    font-size: 8px;
    margin: 10px 0;
  }
  table.stats th,
  table.stats td {
    border: none;
    border-bottom: 1px solid #2c2650;
    padding: 6px;
    text-align: center;
    background: transparent;
    color: inherit;
  }
  table.stats th:first-child,
  table.stats td:first-child {
    text-align: left;
  }
  .awards {
    list-style: none;
    padding: 0;
    margin: 12px 0;
    display: grid;
    gap: 8px;
    font-size: 8px;
    line-height: 1.8;
  }
  .awards strong {
    display: block;
    color: var(--yh-gold);
    font-size: 7px;
  }
  .round ul {
    list-style: none;
    margin: 8px 0 0;
    padding: 0;
    display: grid;
    gap: 6px;
  }
  .round li {
    background: var(--yh-panel2);
    padding: 9px 14px;
    clip-path: polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%);
    display: flex;
    justify-content: space-between;
    gap: 8px;
    font-size: 8px;
  }
  .round li.mine {
    background: color-mix(in srgb, var(--yh-accent) 40%, var(--yh-panel2));
  }
  .round h3 {
    font-size: 10px;
    margin: 14px 0 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .fan.jump,
    .fan.wild,
    .fan.fight,
    .fan .bill,
    .tile::before,
    .logo .ch,
    .pip .burst,
    .row::before,
    .banner {
      animation: none !important;
    }
    .fan.wild,
    .fan.jump {
      filter: brightness(1.4);
    }
  }
  @media (max-width: 640px) {
    .menu {
      padding: 50px 10px 60px;
      min-height: 0;
    }
    .hub,
    .panels,
    .list {
      grid-template-columns: 1fr;
    }
    .tile {
      min-height: 96px;
    }
    .tile .name {
      font-size: 15px;
    }
    .logo {
      font-size: 20px;
    }
    .stands {
      height: 72px;
    }
    .fan {
      width: 22px;
      height: 34px;
    }
    .fan rpg-character {
      width: 26px;
      height: 34px;
    }
    .phone canvas {
      width: 120px;
      height: 200px;
    }
    .bubble {
      margin-bottom: 40px;
    }
    .brawl .them rpg-character {
      width: 130px;
      height: 165px;
    }
    .brawl .you {
      transform: translateX(-50%) scale(0.7);
      transform-origin: bottom center;
    }
  }
`,ke=1/60,pt="youth-sports-27:options",Ne=new Map,Z=h=>{if(Ne.has(h))return Ne.get(h);const e=it[h];if(!e)return"";const t=globalThis.document.createElement("canvas");t.width=e.w*4,t.height=e.h*4,ce(t.getContext("2d"),h,0,0,4);const s=t.toDataURL();return Ne.set(h,s),s},ft=["Did you SEE that? We need the Elite Showcase package.","Sending this to the agent right now. Top line, every shift.","That is going on the highlight reel. And the other highlight reel.","Coach better be watching. I am uploading this tonight.","Ten-year-old? D1 commit. I am calling it."],mt=["Rink security walks both of them to the parking lot.","The snack bar lady breaks it up with a mop.","A grandparent films the whole thing. It has more views than any goal.","Both parents are banned for the rest of the game. The kids pretend not to know them."],bs=h=>{const e={};for(const t of Object.keys(h))e[t]=Object.assign({},h[t],{pass:!1,shoot:!1,check:!1,stick:!1,pause:!1,clip:!1,confirm:!1,back:!1});return e},ys=()=>{const h={intro:!0,brawls:!0,bookface:!0};try{const e=globalThis.localStorage.getItem(pt);if(e)return Object.assign(h,JSON.parse(e))}catch{}return h},ks=h=>{try{globalThis.localStorage.setItem(pt,JSON.stringify(h))}catch{}},J=(h,e,t)=>{const s=Math.max(0,h.indexOf(e));return h[(s+t+h.length)%h.length]},Ge=[{id:"controls",title:"Controls",body:["Arrows or WASD skate. Z passes, or switches to the skater nearest the puck when you do not have it.","X shoots, or poke checks on defense. C body checks (only where checking is allowed). V is a stick play: it might take the puck, it might take a penalty.","P pauses. R saves the last 10 seconds as a clip. F goes full screen.","Gamepads: A pass, B shoot, X check, Y stick, Start pause. Up to four, plus touch controls on phones."]},{id:"levels",title:"Age levels",body:["8U plays cross-ice, 3 on 3, with small nets and no scoreboard. 10U and 12U play half ice. 14U and up play full ice, 5 on 5, with offsides, icing and body checking.","Every period is five minutes. The buzzer at the younger levels changes everyone at once: everybody plays.","AAA and the Beer League are the only places fights happen. Fight, and you are ejected."]},{id:"venues",title:"Venues",body:["The rink has refs, a crowd and all the pressure that comes with them.","Roller: 4 on 4, no offsides, no icing.","Pond hockey and street hockey: no refs, no crowd, no scoreboard operator. Nobody comes to watch, so every kid plays way better. Pond has no goalies, just tiny nets and whoever is closest."]},{id:"parents",title:"The stands",body:["Every kid has 1 to 8 fans in the stands. The kids with the most exposure have the loudest fans, and they pass the least.","Score a pretty one and a parent may film it for the agent. At the youngest levels, nobody keeps score: the parents wave dollar bills instead.","Between periods a parent gets an idea. You decide what happens."]},{id:"brawl",title:"Parent brawls",body:["When the ref misses a call, two parents may square off in the stands. You play your kid\u2019s parent.","Hold LEFT or RIGHT to dodge, DOWN to block. Z jabs, X hooks, hold UP to punch high. Dodge a punch and counter for a star, then C throws the star punch.","Nobody wins. The crowd sours, both kids are rattled and both parents are banned."]},{id:"bookface",title:"BookFace",body:["After the first and second periods, a parent posts highlights from the period to BookFace. Pick up to four.","The post never matches the clips. Losing? Billy has played a lot today. Up by one? The coaches are amazing."]},{id:"sticks",title:"Sticks",body:["One composite stick breaks every game. It costs $349. You get a close-up.","The kid has no stick until the next whistle. Wooden sticks never break, if you can find the code."]},{id:"cheats",title:"Cheats",body:["Type codes on the EXTRAS screen. A few hints: the guy who drives the ice machine. Who brought the orange slices. A tall hairy legend. Every team has a mascot.","Equipment: a $400 stick made of gold. Skates with ROCKETS. The way it was done in the OLD SCHOOL.","Game changers: everyone gets BIG HEADS, the ice turns pink, the puck catches fire, goalies shrink.","Old gamers know a certain button code works on any menu. Here it ends with check and stick."]}];class gt extends yt{static get tag(){return"youth-hockey-27"}static get properties(){return{...super.properties,level:{type:String,reflect:!0},home:{type:String},away:{type:String},venue:{type:String},roller:{type:Boolean},mode:{type:String},ruleset:{type:String},strictness:{type:Number},attract:{type:Boolean,reflect:!0},skipIntro:{type:Boolean,attribute:"skip-intro"},_screen:{state:!0},_menu:{state:!0},_howto:{state:!0},_guest:{state:!0},_equipment:{state:!0},_overlay:{state:!0},_assign:{state:!0},_pads:{state:!0},_lineup:{state:!0},_fx:{state:!0},_intermission:{state:!0},_penalty:{state:!0},_phone:{state:!0},_clip:{state:!0},_final:{state:!0},_muted:{state:!0},_announce:{state:!0},_toast:{state:!0},_pip:{state:!0},_book:{state:!0},_opts:{state:!0},_introStarted:{state:!0},_cheat:{state:!0},_fullscreen:{state:!0}}}constructor(){super(),this.level="10U",this.home="sparkle-selects",this.away="jesus-selects",this.venue="rink",this.roller=!1,this.mode="exhibition",this.ruleset="standard",this.strictness=50,this.attract=!1,this.skipIntro=!1,this._opts=ys(),this._screen="intro",this._menu="hub",this._howto=0,this._guest="",this._equipment="",this._overlay=null,this._assign={kb:"home",touch:"home",pad0:"home",pad1:"away",pad2:"home",pad3:"away"},this._pads=[],this._lineup={home:[],away:[]},this._fx={},this._fanFx={},this._banned=new Set,this._intermission=null,this._penalty=null,this._phone=null,this._clip=null,this._final=null,this._announce="",this._toast=null,this._pip=null,this._book=null,this._brawl=null,this._cheat="",this._combo=[],this._fullscreen=!1,this._introStarted=!1,this._introCues=new Set,this.audio=new ts,this._muted=this.audio.muted,this.input=new ss(this),this.unlocks=new ps,this.replay=new is(20,30),this.game=null,this.tournament=null,this.renderer=null,this._raf=null,this._acc=0,this._last=0,this._banners=[],this._visible=!0,this._lineupKey="",this._moments=[],this._streak={side:null,n:0},this.t={title:"Youth Sports 27",pause:"Pause",resume:"Resume",quit:"Quit to menu",saveClip:"Save clip",fullscreen:"Full screen",exitFullscreen:"Exit full screen",mute:"Sound off",unmute:"Sound on",touchHelp:"Joystick skates. PASS passes or switches player, SHOOT shoots or poke checks, CHECK body checks, STICK is a stick play.",controlsHelp:"Arrows skate. Z pass or switch player. X shoot or poke check. C body check. V stick play. P pause. R save a clip. F full screen."}}connectedCallback(){super.connectedCallback();const e=globalThis.document;if(!e.querySelector("link[data-youth-sports-font]")){const t=e.createElement("link");t.rel="stylesheet",t.href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap",t.setAttribute("data-youth-sports-font",""),e.head.appendChild(t)}this.input.attach(),this._onPad=()=>{this._pads=this.input.pads()},globalThis.addEventListener("gamepadconnected",this._onPad),globalThis.addEventListener("gamepaddisconnected",this._onPad),this._onVisibility=()=>{globalThis.document.hidden&&this._screen==="playing"&&!this._overlay&&!this.attract&&(this._overlay="pause")},globalThis.document.addEventListener("visibilitychange",this._onVisibility),this._onFullscreen=()=>{const t=globalThis.document;this._fullscreen=(t.fullscreenElement||t.webkitFullscreenElement)===this},globalThis.document.addEventListener("fullscreenchange",this._onFullscreen),globalThis.document.addEventListener("webkitfullscreenchange",this._onFullscreen),this._onKey=t=>this.onKey(t),this.addEventListener("keydown",this._onKey),"IntersectionObserver"in globalThis&&(this._io=new IntersectionObserver(t=>{this._visible=t.some(s=>s.isIntersecting)}),this._io.observe(this)),this._pads=this.input.pads(),this._loop=this._loop.bind(this),this._raf=globalThis.requestAnimationFrame(this._loop)}disconnectedCallback(){this.input.detach(),globalThis.removeEventListener("gamepadconnected",this._onPad),globalThis.removeEventListener("gamepaddisconnected",this._onPad),globalThis.document.removeEventListener("visibilitychange",this._onVisibility),globalThis.document.removeEventListener("fullscreenchange",this._onFullscreen),globalThis.document.removeEventListener("webkitfullscreenchange",this._onFullscreen),this.removeEventListener("keydown",this._onKey),this._io&&this._io.disconnect(),this._raf&&globalThis.cancelAnimationFrame(this._raf),this.audio.stop(),this._clip&&this._clip.url&&globalThis.URL.revokeObjectURL(this._clip.url),super.disconnectedCallback()}firstUpdated(e){super.firstUpdated&&super.firstUpdated(e),this.roller&&this.venue==="rink"&&(this.venue="roller"),this.home===this.away&&(this.away=Y.find(t=>t.id!==this.home).id),this.attract?this.startAttract():(this.skipIntro||!this._opts.intro)&&(this._screen="menu")}updated(e){super.updated&&super.updated(e),this._overlay==="bookface"&&this._book&&!this._book.drawn&&this.drawThumbs()}capturesKeys(e){if(this.attract)return!1;const t=e.composedPath?e.composedPath():[],s=t[0]||e.target,i=s&&s.tagName?s.tagName.toLowerCase():"",n=["input","textarea","select"].includes(i)||s&&s.isContentEditable;return this._screen==="playing"?n?!1:t.includes(this)||globalThis.document.activeElement===globalThis.document.body||this._fullscreen:!1}onKey(e){if(this.attract)return;const t=(e.composedPath?e.composedPath():[])[0]||e.target,s=t&&t.tagName?t.tagName.toLowerCase():"";if(s==="input"||s==="textarea")return;const i=e.key;if(this._screen==="menu"&&this._menu==="extras"&&!e.ctrlKey&&!e.metaKey&&!e.altKey){if(/^[a-z]$/i.test(i)){this._cheat=(this._cheat+i.toUpperCase()).slice(0,16),e.preventDefault();return}if(i==="Backspace"){this._cheat=this._cheat.slice(0,-1),e.preventDefault();return}}if(i==="f"||i==="F"){this.toggleFullscreen(),e.preventDefault();return}if(this._screen==="intro"){(i==="Enter"||i===" ")&&(e.preventDefault(),this.introPress());return}if(this._screen==="playing")return;const n={ArrowUp:"up",ArrowDown:"down",ArrowLeft:"left",ArrowRight:"right"};if(n[i]){e.preventDefault(),this.comboPush(n[i]),this.menuMove(n[i]);return}i==="c"||i==="C"?this.comboPush("check"):i==="v"||i==="V"?this.comboPush("stick"):(i==="Escape"||i==="Backspace")&&(e.preventDefault(),this.menuBack())}toggleFullscreen(){const e=globalThis.document;if(e.fullscreenElement||e.webkitFullscreenElement){e.exitFullscreen?e.exitFullscreen():e.webkitExitFullscreen&&e.webkitExitFullscreen();return}const t=this.requestFullscreen||this.webkitRequestFullscreen;if(!t){this.toast("No full screen here. On iPhone: Share, then Add to Home Screen.");return}try{const s=t.call(this);s&&s.catch&&s.catch(()=>this.toast("Full screen was blocked by the browser."))}catch{this.toast("Full screen was blocked by the browser.")}this.updateComplete.then(()=>{const s=this.shadowRoot.querySelector(".stage");s&&this._screen==="playing"&&s.focus()})}toast(e,t){this._toast=e,globalThis.clearTimeout(this._toastTimer),this._toastTimer=globalThis.setTimeout(()=>{this._toast=null},t||2600),this.say(e)}introPress(){const e=this.introTime();if(!this._introStarted){this.audio.start(),this._introStarted=!0,this._introStart=performance.now(),this._introCues=new Set;return}if(e<T.prompt){this._introStart=performance.now()-T.prompt*1e3,this._introCues.has("roar")||(this._introCues=new Set(["tv","youth","sports","num","roar"]),this.audio.play("slam"),this.audio.roar());return}this.audio.play("select"),this.audio.startLoop(),this.goMenu("hub")}introTime(){return this._introStarted?(performance.now()-this._introStart)/1e3:0}introCue(e){const t=(i,n,a)=>{e>=n&&!this._introCues.has(i)&&(this._introCues.add(i),a())},s=this.audio;t("tv",T.lineOn,()=>s.play("tv-on")),t("youth",T.youth,()=>s.play("slam")),t("sports",T.sports,()=>s.play("slam")),t("num",T.num,()=>{s.play("slam"),s.roar()}),t("roar",T.num+.4,()=>s.announce("Youth Sports Twenty Seven")),t("title",T.tagline,()=>this.say("Youth Sports 27. It\u2019s in the minivan. Press start."))}goMenu(e){this._screen="menu",this._menu=e,this.focusFirst()}focusFirst(){this.updateComplete.then(()=>{const e=this.shadowRoot.querySelector(".menu [data-nav]");e&&e.focus({preventScroll:!0})})}menuBack(){if(this._screen==="menu"){if(this._menu==="hub")return;this.audio.play("back"),this.goMenu("hub")}else(this._screen==="bracket"||this._screen==="final")&&(this.audio.play("back"),this.quit())}navList(){return Array.from(this.shadowRoot.querySelectorAll(".menu [data-nav]")).filter(e=>!e.disabled)}menuMove(e){const t=this.navList();if(!t.length)return;const s=this.shadowRoot.activeElement;let i=t.indexOf(s);if(i<0){t[0].focus({preventScroll:!0});return}if((e==="left"||e==="right")&&s.dataset.cycle){this.cycleRow(s.dataset.cycle,e==="left"?-1:1);return}const n=parseInt(s.dataset.cols||"1",10);let a=0;e==="up"?a=-n:e==="down"?a=n:n>1&&(a=e==="left"?-1:1),a&&(i=Math.max(0,Math.min(t.length-1,i+a)),t[i]!==s&&(t[i].focus({preventScroll:!0}),this.audio.play("menu")))}comboPush(e){if(this._combo.push(e),this._combo.length>Te.length&&this._combo.shift(),this._combo.length===Te.length&&this._combo.every((t,s)=>t===Te[s])){this._combo=[];const t=this.unlocks.addAll();this.audio.play("cheat"),this.toast(t.length?`BUTTON CODE! ${t.length} CHEATS UNLOCKED`:"YOU ALREADY HAVE EVERYTHING",3200),this.requestUpdate()}}menuPadInput(e){for(const t of this._pads){const s=e[t.id];if(s){if(this._screen==="intro"){(s.confirm||s.pause||s.shoot)&&this.introPress();continue}if(s.navY&&(this.comboPush(s.navY<0?"up":"down"),this.menuMove(s.navY<0?"up":"down")),s.navX&&(this.comboPush(s.navX<0?"left":"right"),this.menuMove(s.navX<0?"left":"right")),s.check&&this.comboPush("check"),s.stick&&this.comboPush("stick"),s.confirm){const i=this.shadowRoot.activeElement;i&&i.click?i.click():this.focusFirst()}else s.back?this.menuBack():s.pause&&this._screen==="menu"&&this._menu==="setup"&&this.startFromSelect()}}}yourSide(){return Object.values(this.humans())[0]||"home"}venueRules(){return xe(this.level,{venue:this.venue,ruleset:this.ruleset})}setupRows(){const e=this.venueRules(),t=G[this.venue],s=Y.map(r=>r.id),i=["",...this.unlocks.list("guest")],n=["",...this.unlocks.list("equipment")],a=[{id:"mode",label:"Mode",value:this.mode==="tournament"?e.keepScore?"Tournament":"Jamboree":"Exhibition"},{id:"level",label:"Age level",value:V(this.level).label},{id:"venue",label:"Venue",value:t.label},{id:"home",label:"Home",value:P(this.home).name,img:Z(P(this.home).crest)},{id:"away",label:"Away",value:P(this.away).name,img:Z(P(this.away).crest)},{id:"ruleset",label:"Referee",value:t.refs?this.ruleset==="jay"?"Jay mode":"Standard":"No refs",off:!t.refs},{id:"strictness",label:"Strictness",value:!t.refs||this.ruleset==="jay"?"--":`${this.strictness}%`,off:!t.refs||this.ruleset==="jay"}];i.length>1&&a.push({id:"guest",label:"Guest star",value:this._guest?re[this._guest].name:"None"}),n.length>1&&a.push({id:"equipment",label:"Equipment",value:this._equipment?he[this._equipment].name:"Stock"});const o=[{id:"kb",label:this._touchVisible()?"Keys / touch":"Keyboard"}];return this._pads.forEach(r=>o.push({id:r.id,label:`Pad ${r.index+1}`})),o.forEach(r=>{const l=this._assign[r.id]||"cpu";a.push({id:`ctl:${r.id}`,label:`P${Pe[r.id]} ${r.label}`,value:l==="cpu"?"CPU":P(this[l]).short,dot:de[r.id]})}),this._setupLists={teamIds:s,guests:i,gear:n},a}cycleRow(e,t){const s=this._setupLists||{teamIds:Y.map(n=>n.id),guests:[""],gear:[""]},i=G[this.venue];switch(e){case"mode":this.mode=this.mode==="tournament"?"exhibition":"tournament";break;case"level":this.level=J(ie.map(n=>n.id),this.level,t);break;case"venue":this.venue=J(Object.keys(G),this.venue,t);break;case"home":case"away":{const n=e==="home"?this.away:this.home;let a=J(s.teamIds,this[e],t);a===n&&(a=J(s.teamIds,a,t)),this[e]=a;break}case"ruleset":if(!i.refs)return;this.ruleset=this.ruleset==="jay"?"standard":"jay";break;case"strictness":if(!i.refs||this.ruleset==="jay")return;this.strictness=Math.max(0,Math.min(100,this.strictness+t*10));break;case"guest":this._guest=J(s.guests,this._guest,t);break;case"equipment":this._equipment=J(s.gear,this._equipment,t);break;default:if(e.startsWith("ctl:")){const n=e.slice(4),a=J(["home","cpu","away"],this._assign[n]||"cpu",t);this._assign=Object.assign({},this._assign,{[n]:a})}}this.audio.play("menu"),this.updateComplete.then(()=>{const n=this.shadowRoot.querySelector(`[data-cycle="${e}"]`);n&&this.say(n.getAttribute("aria-label"))})}optionRows(){return[{id:"sound",label:"Sound",value:this._muted?"Off":"On"},{id:"fullscreen",label:"Full screen",value:this._fullscreen?"On":"Off"},{id:"intro",label:"Title intro",value:this._opts.intro?"On":"Off"},{id:"brawls",label:"Parent brawls",value:this._opts.brawls?"On":"Off"},{id:"bookface",label:"BookFace posts",value:this._opts.bookface?"On":"Off"}]}toggleOption(e){e==="sound"?this.toggleMute():e==="fullscreen"?this.toggleFullscreen():(this._opts=Object.assign({},this._opts,{[e]:!this._opts[e]}),ks(this._opts)),this.audio.play("menu")}enterCode(e){const t=zt(e);if(this._cheat="",!t){this.audio.play("back"),this.toast("NOPE. NOT A CODE.");return}const s=Ze(t),i=Qe(s),n=this.unlocks.add(s);this.audio.play("cheat"),t.type==="modifier"&&n&&this.unlocks.toggle(t.id),this.toast(n?`UNLOCKED: ${i.name.toUpperCase()}`:`ALREADY UNLOCKED: ${i.name.toUpperCase()}`,3e3),t.type==="guest"&&(this._guest=t.id),t.type==="equipment"&&(this._equipment=t.id),this.requestUpdate()}humans(){const e=["kb"];this._pads.forEach(s=>e.push(s.id));const t={};return e.forEach(s=>{const i=this._assign[s];(i==="home"||i==="away")&&(t[s]=i)}),t}kitsFor(e,t){const s=P(e),i=P(t);let n="away";return Jt(s.kits.home.jersey,i.kits.away.jersey)<140&&(n="home"),{homeKit:"home",awayKit:n}}loadout(){if(this.attract)return{modifiers:[]};const e={};return this._guest&&this.unlocks.has(`guest:${this._guest}`)&&(e.guest=this._guest),this._equipment&&this.unlocks.has(`equipment:${this._equipment}`)&&(e.equipment=this._equipment),{[this.yourSide()]:e,modifiers:this.unlocks.activeModifiers()}}newGame(e,t,s){const i=this.attract?{}:this.humans(),n=Object.values(i),a=Object.assign({level:this.level,venue:this.venue,ruleset:this.ruleset,strictness:this.strictness/100,home:e,away:t,controllers:i,focusSide:n[0]||"home",autoIntermission:this.attract,loadout:this.loadout(),seed:`${e}:${t}:${this.level}:${Date.now()}`},this.kitsFor(e,t),s||{});this.game=new tt(a),this.replay.clear(),this._banners=[],this._fx={},this._fanFx={},this._banned=new Set,this._final=null,this._penalty=null,this._phone=null,this._intermission=null,this._overlay=null,this._pip=null,this._book=null,this._brawl=null,this._brawlPeriod=0,this._moments=[],this._streak={side:null,n:0};const o=l=>{const d=this.game.teams[l],c=d.equipment;return{kit:d.kit,short:d.def.short,crest:d.def.crest,name:d.def.name,stickColor:c&&c.stick?c.stick:null}};this.match={rules:this.game.rules,teams:{home:o("home"),away:o("away")}},this._screen="playing",this.updateComplete.then(()=>{const l=this.shadowRoot.querySelector("#rink");if(this.renderer=new te(l,{hud:!0}),this.renderer.setMatch(this.match.rules,this.match.teams),!this.attract){const d=this.shadowRoot.querySelector(".stage");d&&d.focus({preventScroll:!0})}}),this.updateLineup(!0),this.audio.stopLoop();const r=G[this.game.rules.venue];this.say(`${this.match.teams.home.name} versus ${this.match.teams.away.name}, ${V(this.level).label}, ${r.label}. Drop the puck.`)}startAttract(){const e=Y.map(i=>i.id),t=e.includes(this.home)?this.home:e[0];let s=e.includes(this.away)?this.away:e[1];s===t&&(s=e.find(i=>i!==t)),this.newGame(t,s,{seed:`attract:${this.level}:${Date.now()}`})}startFromSelect(){if(this.audio.start(),this.home!==this.away){if(this.audio.play("select"),this.mode==="tournament"){this.tournament=new os({level:this.level,venue:this.venue,ruleset:this.ruleset,strictness:this.strictness/100,team:this.home,seed:`${Date.now()}`}),this._screen="bracket",this.focusFirst(),this.audio.startLoop();return}this.tournament=null,this.newGame(this.home,this.away)}}playNextTournamentGame(){const e=this.tournament.next();e&&this.newGame(e.home,e.away,{needWinner:!this.tournament.jamboree})}_loop(e){this._raf=globalThis.requestAnimationFrame(this._loop);const t=this._last?Math.min(.1,(e-this._last)/1e3):ke;this._last=e;const s=this.input.poll();if(this._screen!=="playing"){this.attract||this.menuPadInput(s),this.drawMenuFrame(e);return}if(!this.game||!this.renderer||this.attract&&!this._visible)return;if(this._overlay==="brawl"){this.brawlStep(t,s);return}this.overlayInput(s);const i=!!this._overlay||this.game.phase==="intermission";if(!i){if(!this.attract){const o=Object.keys(s);if(o.some(r=>s[r].pause)){this._overlay="pause",this.focusOverlay();return}if(o.some(r=>s[r].clip)){this.saveClip();return}}this._acc+=t;let n=!0;for(;this._acc>=ke;)if(this.game.step(ke,n?s:bs(s)),n=!1,this._acc-=ke,this.handleEvents(this.game.drainEvents()),this._overlay){this._acc=0;break}const a=this.game.snapshot();this.replay.push(a,t),this.updateLineup(!1),this.updateCarrierFans()}this.tickFx(t),this.drawFrame(t),this.audio.setCrowd(this.game.rules.crowd?this.game.crowd.mood:0,!i&&this.game.rules.crowd)}drawMenuFrame(e){if(this._screen==="intro"){const s=this.shadowRoot&&this.shadowRoot.querySelector("#intro");if(!s)return;(!this.intro||this.intro.canvas!==s)&&(this.intro=new Ye(s));const i=this.reducedMotion()&&this._introStarted?Math.max(T.prompt,this.introTime()):this.introTime();this._introStarted&&this.introCue(i),this.intro.draw(this._introStarted?i:0,{prompt:this._introStarted?"PRESS START":""});return}const t=this.shadowRoot&&this.shadowRoot.querySelector("canvas.bg");t&&((!this.bg||this.bg.canvas!==t)&&(this.bg=new hs(t)),this.bg.setSection(this.menuSection()),this.bg.draw(e/1e3,this.reducedMotion()))}menuSection(){return this._screen==="final"?"gold":this._screen==="bracket"?"play":this._screen==="menu"?this._menu==="setup"?"play":this._menu==="hub"?"title":this._menu:"title"}drawFrame(e){const t=this.game.snapshot(),s=performance.now();this._banners=this._banners.filter(o=>o.until>s);const i=this._banners[0],n=i&&i.shake&&!this.reducedMotion()?1:0,a=this.game.modifiers.includes("fire-puck")&&this._streak.n>=2;this.renderer.draw(t,{dt:e,banner:i?i.text:null,bannerColor:i?i.color:null,sub:i?i.sub:null,shake:n,fire:a}),this._phone&&this.phoneRenderer&&this.drawPhone(e),this._pip&&this.drawPip(t,e)}reducedMotion(){return globalThis.matchMedia&&globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches}banner(e,t){const s=t||{};this._banners.push({text:e,sub:s.sub||null,color:s.color,until:performance.now()+(s.ms||1800),shake:s.shake}),this._banners.length>3&&this._banners.shift()}say(e){this._announce="",this.updateComplete.then(()=>{this._announce=e})}entity(e){return this.game?this.game.findEntity(e):null}remember(e,t,s){const i=this.entity(t);if(!i||this.attract)return;const n=this._moments;n.length>60&&n.shift(),n.push({type:e,uid:t,side:s||i.side,number:i.player.number,period:this.game.period,t:this.game.time,x:i.x,y:i.y,snap:this.game.snapshot()})}handleEvents(e){const t=this.audio,s=this.match.teams,i=this.game.rules.keepScore;for(const n of e)switch(n.type){case"shot":t.play("shot");break;case"pass":t.play("pass");break;case"boards":t.play("boards");break;case"post":t.play("post"),this.banner("POST!",{ms:900,color:"#ffffff"});break;case"save":t.play("save"),this.react(n.uid,"jump",1.5),this.remember("save",n.uid);break;case"block":this.remember("block",n.uid);break;case"hit":t.play("hit"),this.react(n.uid,"jump",1.2),n.legal?this.remember("hit",n.uid):this.react(n.target,"angry",2.5);break;case"whistle":t.play("whistle"),n.reason==="offside"&&this.banner("OFFSIDE",{sub:"Attackers went in ahead of the puck",color:"#ffffff"}),n.reason==="icing"&&this.banner("ICING",{sub:"Shot from your own half went all the way down",color:"#ffffff"});break;case"buzzer":t.play("buzzer"),this.banner("BUZZER!",{sub:"Everybody changes. Everybody plays.",ms:1500,color:"#69f0ae"});break;case"goal":{const a=n.side;t.play("horn"),t.playSting("goal"),this._streak=this._streak.side===a?{side:a,n:this._streak.n+1}:{side:a,n:1};const o=n.scorerNumber?`#${n.scorerNumber} ${n.scorerName}`:"Off a skate",r=this.game.modifiers.includes("fire-puck")&&this._streak.n===2;this.banner(r?"HE'S ON FIRE!":"GOAL!",{sub:o,ms:2400,color:s[a].kit.jersey,shake:!0}),n.scorer&&(this.remember("goal",n.scorer,a),this.react(n.scorer,"wild",4),i||(this.react(n.scorer,"money",4),t.playSting("money"))),(n.assists||[]).forEach(l=>this.react(l,"jump",3)),this.teamReact(a,"jump",2),this.say(i?`Goal, ${s[a].name}. ${o}. ${s.home.short} ${n.home}, ${s.away.short} ${n.away}.`:`Goal by ${o}. Nobody is keeping score at this level, but the parents are.`),n.viral&&n.scorer&&!this.attract&&this.game.rules.crowd&&this.startPhone(n.scorer);break}case"penalty":{const a=s[n.side];if(this.react(n.uid,"angry",4),n.penalty==="fighting"){this.banner("EJECTED",{sub:`#${n.number} ${a.short}`,ms:1400,color:"#d8343c"});break}this.say(`Penalty, ${a.name}. Number ${n.number}, ${n.label}. ${n.explain}`),this.attract?this.banner(n.label.toUpperCase(),{sub:`#${n.number} ${a.short}`,ms:1600,color:"#ffd740"}):(this._penalty=Object.assign({team:a.name,short:a.short,color:a.kit.jersey,until:performance.now()+3600},n),this._overlay="penalty"),t.playSting("penalty");break}case"missed-call":this.missedCall(n);break;case"stick-break":this.stickBreak(n);break;case"stick-held":this.banner("THE WOOD HOLDS",{sub:"Grandpa was right",ms:1600,color:"#c28a4a"});break;case"new-stick":this.banner("NEW STICK",{sub:"Another $349 from the bench",ms:1200,color:"#5ad0ff"});break;case"stands-fight":this.standsFight(n.a,n.b);break;case"fight":t.play("fight"),this.banner("FIGHT!",{sub:"Gloves are off",ms:3e3,color:"#d8343c",shake:!0}),this.teamReact("home","jump",3),this.teamReact("away","jump",3),this.say("Fight! Both players are ejected.");break;case"period-end":t.play("buzzer"),t.playSting("period");break;case"overtime":this.banner("OVERTIME",{sub:"Next goal wins",ms:2500});break;case"shootout":this.banner("SHOOTOUT",{sub:`${s[n.winner].short} wins it`,ms:2500});break;case"intermission":this.attract||this.startIntermission(n);break;case"period-start":this.banner(`PERIOD ${n.period}`,{ms:1500});break;case"final":this.finish(n);break}}finish(e){if(this.attract){globalThis.setTimeout(()=>this.startAttract(),2500),this.banner(e.keepScore?"FINAL":"GOOD GAME",{ms:2400});return}this.audio.startLoop();const t=this.game,s=[...t.teams.home.skaters(),...t.teams.away.skaters()],i=c=>s.slice().sort((u,p)=>c(p)-c(u))[0],n=i(c=>c.stats.goals*3+c.stats.assists*2+c.stats.passes*.1),a=i(c=>c.stats.passes),o=i(c=>c.stats.possession-c.stats.passes*2),r=c=>{const u=t.teams[c],p=u.entities;return{shots:u.shots,passes:p.reduce((g,f)=>g+f.stats.passes,0),hits:p.reduce((g,f)=>g+f.stats.hits,0),pim:p.reduce((g,f)=>g+f.stats.pim,0)}},l=c=>`#${c.player.number} ${c.player.name} (${t.teams[c.side].def.short})`;this._final={result:e,stats:{home:r("home"),away:r("away")},awards:[{label:"Player of the game",who:l(n)},{label:"Most passes",who:`${l(a)}, ${a.stats.passes}`},{label:"Puck hog award",who:`${l(o)}, ${Math.round(o.stats.possession)} seconds with the puck, ${o.stats.passes} passes`}]},this.tournament&&this.tournament.recordUser(e),this._screen="final",this._overlay=null,this._pip=null,this.focusFirst();const d=this.match.teams;e.reason&&e.reason.startsWith("called")?this.say("Game called. Not enough players left to keep playing."):e.keepScore?this.say(`Final. ${d.home.name} ${e.home}, ${d.away.name} ${e.away}.`):this.say("Good game. Nobody kept score. Everybody played.")}updateLineup(e){const t=this.game;if(!t)return;const s=a=>t.teams[a].entities.filter(o=>o.onIce),i=["home","away"].map(a=>s(a).map(o=>o.uid).join(",")).join("|");if(!e&&i===this._lineupKey)return;this._lineupKey=i;const n=a=>s(a).map(o=>({uid:o.uid,number:o.player.number,goalie:o.isGoalie,fans:o.player.fans,superFans:o.exposure>=60}));this._lineup={home:n("home"),away:n("away")}}react(e,t,s){e&&(this._fx=Object.assign({},this._fx,{[e]:{kind:t,until:performance.now()+s*1e3}}))}teamReact(e,t,s){const i=Object.assign({},this._fx);for(const n of this._lineup[e]||[])(!i[n.uid]||i[n.uid].kind===t)&&(i[n.uid]={kind:t,until:performance.now()+s*1e3});this._fx=i}standsFight(e,t){if(!this.game.rules.crowd)return;const s=this.entity(e),i=this.entity(t),n=Object.assign({},this._fanFx),a=performance.now()+3500;s&&(n[s.player.fans[0]]=a),i&&(n[i.player.fans[0]]=a),this._fanFx=n,this.requestUpdate(),this.banner("TROUBLE IN THE STANDS",{ms:1400,color:"#ffd740"})}updateCarrierFans(){if(!this.game.rules.crowd)return;const e=this.game.puck.carrier;if(!e||e.exposure<60)return;const t=this._fx[e.uid];(!t||t.kind!=="money"||t.until-performance.now()<300)&&((!t||t.kind!=="money")&&this.audio.playSting("money"),this.react(e.uid,"money",1.2))}tickFx(){const e=performance.now();let t=!1;const s={};for(const n of Object.keys(this._fx)){const a=this._fx[n];a.until>e?s[n]=a:t=!0}t&&(this._fx=s);let i=!1;for(const n of Object.keys(this._fanFx))this._fanFx[n]<=e&&(delete this._fanFx[n],i=!0);i&&this.requestUpdate(),this._penalty&&this._overlay==="penalty"&&this._penalty.until<e&&this.closeOverlay(),this._pip&&this._pip.until<e&&(this._pip=null,this.pipRenderer=null)}stickBreak(e){this.audio.play("snap"),this.remember("stick-break",e.uid),this.banner("SNAP!",{sub:`#${e.number} broke a $349 stick`,ms:2e3,color:"#5ad0ff",shake:!0}),this.say(`Number ${e.number}'s stick snaps. That was a three hundred and forty nine dollar stick.`);const t=Array.from({length:this.reducedMotion()?4:16},(s,i)=>{const n=i/16*Math.PI*2+i%3*.3,a=60+i%4*22;return{emoji:i%3?"\u{1F4B5}":"\u{1F4B8}",dx:`${Math.round(Math.cos(n)*a)}px`,dy:`${Math.round(Math.sin(n)*a-30)}px`,r:`${(i%2?1:-1)*(90+i*20)}deg`,delay:`${i%5*.08}s`}});this._pip={uid:e.uid,x:e.x,y:e.y,number:e.number,side:e.side,until:performance.now()+2800,money:t},this.pipRenderer=null}drawPip(e,t){const s=this.shadowRoot.querySelector("#pip-canvas");if(!s)return;(!this.pipRenderer||this.pipRenderer.canvas!==s)&&(this.pipRenderer=new te(s,{hud:!1,zoom:5}),this.pipRenderer.setMatch(this.match.rules,this.match.teams));const i=this.entity(this._pip.uid),n=i?{x:i.x,y:i.y}:{x:this._pip.x,y:this._pip.y};this.pipRenderer.draw(e,{dt:t,follow:n})}missedCall(e){const t=U[e.penalty]?U[e.penalty].label:"Something";this.react(e.victim,"angry",3),this.banner("NO CALL?!",{sub:`${t}. The ref missed it.`,ms:1500,color:"#ff5a6e"});const s=this.game;if(this.attract||!s.rules.crowd||!this._opts.brawls||this._overlay||this._brawlPeriod===s.period||Math.random()>.5)return;const i=this.entity(e.uid),n=this.entity(e.victim);!i||!n||(this._brawlPeriod=s.period,globalThis.setTimeout(()=>{this._screen==="playing"&&!this._overlay&&this.game===s&&this.startBrawl(i,n,t)},1e3))}startBrawl(e,t,s){const i=this.game.opts.focusSide||"home",n=e.side===i?e:t,a=n===e?t:e,o=l=>l.player.fans.find(d=>!this._banned.has(d))||l.player.fans[0],r=l=>this.game.teams[l].entities.filter(d=>!d.isGoalie&&d!==n&&d!==a).slice(0,2).map(d=>({seed:d.player.id,crest:this.game.teams[l].def.crest,number:d.player.number}));this._brawl={fight:new ds({rng:ae(`brawl:${this.game.time}:${n.uid}`),toughness:Math.min(1,a.exposure/100)}),you:o(n),them:o(a),mine:n,theirs:a,label:s,jersey:this.match.teams[n.side].kit.jersey,theirTeam:this.match.teams[a.side].short,kids:[{seed:n.player.id,crest:this.game.teams[n.side].def.crest,number:n.player.number},{seed:a.player.id,crest:this.game.teams[a.side].def.crest,number:a.player.number},...r("home"),...r("away")],crowd:[...this._lineup.home||[],...this._lineup.away||[]].map(l=>l.fans[1]||l.fans[0]).filter(l=>l&&!this._banned.has(l)).slice(0,6),hits:{you:0,them:0},state:"idle",line:mt[Math.floor(Math.random()*mt.length)],applied:!1},this._overlay="brawl",this.audio.play("bell"),this.say(`No call on the ${s}. Two parents square off in the stands. You are number ${n.player.number}'s parent. Hold left or right to dodge, down to block, Z to jab, X to hook.`),this.updateComplete.then(()=>{const l=this.shadowRoot.querySelector(".brawl");l&&l.focus({preventScroll:!0})})}brawlStep(e,t){const s=this._brawl;if(!s)return;const i=s.fight;if(i.result)Object.keys(t).some(n=>t[n].confirm||t[n].pause)&&this.closeOverlay();else{const n=Object.keys(t),a=r=>n.some(l=>t[l][r]),o=r=>n.some(l=>r(t[l]));i.update(e,{left:o(r=>r.x<-.5),right:o(r=>r.x>.5),down:o(r=>r.y>.5),up:o(r=>r.y<-.5),jab:a("pass"),hook:a("shoot"),star:a("check")||a("stick")}),(i.hits.you!==s.hits.you||i.hits.them!==s.hits.them)&&this.audio.play("punch"),i.them.state==="tell"&&s.state!=="tell"&&this.audio.play("whoosh"),s.hits=Object.assign({},i.hits),s.state=i.them.state,i.result&&this.brawlOver()}this.requestUpdate()}brawlOver(){const e=this._brawl;if(e.applied)return;e.applied=!0,this.audio.play("bell");const t=this.game;t.crowd.mood=Math.max(0,t.crowd.mood-.2);for(const n of[e.mine,e.theirs])for(const a of["speed","shot","pass","hands"])n.rating[a]=Math.max(20,n.rating[a]-3);this._banned.add(e.you),this._banned.add(e.them);const s=e.fight.result,i=s.winner==="you"?"You win the fight. ":s.winner==="them"?"You lose the fight. ":"A draw. ";this.say(`${i}${e.line} Both kids are rattled.`),this.updateComplete.then(()=>{const n=this.shadowRoot.querySelector(".brawl .go");n&&n.focus({preventScroll:!0})})}startIntermission(e){if(this._intermission=Object.assign({result:null},e),this.audio.startLoop(),e.id!=="quiet"&&this._opts.bookface&&this.game.rules.crowd){this.openBookFace(e.side);return}this._overlay="intermission",this.say(`End of period ${this.game.period}. ${e.title}. ${e.body}`),this.focusOverlay()}openBookFace(e){const t=this.game,s=t.period,i=this._moments.filter(l=>l.period===s),n=fs(i,e,4),a=t.teams[e],o=a.skaters().slice().sort((l,d)=>d.exposure-l.exposure)[0],r=e==="home"?"away":"home";this._book={side:e,period:s,highlights:n,chosen:n.slice(0,2).map((l,d)=>d),posted:!1,drawn:!1,kid:o?o.player.first||o.player.name:"my kid",kidNumber:o?o.player.number:"",poster:o?o.player.fans[0]:"parent",ours:a.score,theirs:t.teams[r].score},this._overlay="bookface",this.say(`End of period ${s}. A parent opens BookFace to post highlights. Pick the clips to post.`),this.focusOverlay()}drawThumbs(){const e=this._book,t=this.shadowRoot.querySelectorAll(".bf .thumb canvas");!t.length&&e.highlights.length||(t.forEach(s=>{const i=e.highlights[parseInt(s.dataset.i,10)];if(!i)return;const n=new te(s,{hud:!1,zoom:3});n.setMatch(this.match.rules,this.match.teams),n.draw(i.snap,{snapCamera:!0,follow:{x:i.x,y:i.y}})}),e.drawn=!0)}toggleHighlight(e){const t=this._book,s=t.chosen.includes(e)?t.chosen.filter(i=>i!==e):[...t.chosen,e].slice(-4);this._book=Object.assign({},t,{chosen:s}),this.audio.play("menu")}bookPost(){const e=this._book;this._book=Object.assign({},e,{posted:!0}),this.audio.play("posted");const t=e.ours-e.theirs;this.say(`Posted. ${ut(t,e.chosen)} likes. ${this.bookText()}`),this.updateComplete.then(()=>{const s=this.shadowRoot.querySelector(".bf .close");s&&s.focus({preventScroll:!0})})}bookText(){const e=this._book;return ms({ours:e.ours,theirs:e.theirs,kid:e.kid,keepScore:this.game.rules.keepScore,chosen:e.chosen.map(t=>e.highlights[t]).filter(Boolean),period:e.period})}closeBookFace(){this._book=null;const e=this._intermission;this._overlay="intermission",this.say(`${e.title}. ${e.body}`),this.focusOverlay()}focusOverlay(){this.updateComplete.then(()=>{const e=this.shadowRoot.querySelector(".overlay button, .overlay [tabindex]");e&&e.focus({preventScroll:!0})})}overlayInput(e){const t=s=>Object.keys(e).some(i=>e[i][s]);if(this._overlay==="penalty"&&(t("pass")||t("confirm")||t("shoot")))this.closeOverlay();else if(this._overlay==="phone"&&(t("pass")||t("confirm")||t("shoot")||t("pause")))this.closeOverlay();else if(this._overlay==="pause"&&t("pause"))this.closeOverlay();else if(this._overlay==="intermission"||this._overlay==="bookface"||this._overlay==="pause"){const s=Object.keys(e).filter(i=>i!=="kb").map(i=>e[i].navY||e[i].navX).find(i=>i);if(s){const i=Array.from(this.shadowRoot.querySelectorAll(".overlay button, .overlay a.btn")),n=i.indexOf(this.shadowRoot.activeElement),a=i[(n+s+i.length)%i.length];a&&a.focus({preventScroll:!0})}if(Object.keys(e).some(i=>i!=="kb"&&e[i].confirm)){const i=this.shadowRoot.activeElement;i&&i.click&&i.click()}}}closeOverlay(){const e=this._overlay;this._overlay=null,this._penalty=null,e==="phone"&&(this._phone=null),e==="brawl"&&(this._brawl=null,this.audio.stopLoop()),this._last=0,this.updateComplete.then(()=>{const t=this.shadowRoot.querySelector(".stage");t&&!this.attract&&t.focus({preventScroll:!0})})}chooseIntermission(e){const t=this.game.chooseIntermission(e);this.handleEvents(this.game.drainEvents()),this._intermission=Object.assign({},this._intermission,{result:t,chosen:e}),this.say(t),this.updateComplete.then(()=>{const s=this.shadowRoot.querySelector(".intermission .continue");s&&s.focus({preventScroll:!0})})}endIntermission(){this._intermission=null,this.audio.stopLoop(),this.closeOverlay()}startPhone(e){const t=this.entity(e);if(!t)return;const s=this.replay.last(3.5);s.length<10||(this._phone={frames:s,i:0,fan:t.player.fans[0],number:t.player.number,line:ft[Math.floor((t.uid*7+this.game.time)%ft.length)],acc:0},globalThis.setTimeout(()=>{this._phone&&this._screen==="playing"&&!this._overlay&&(this._overlay="phone",this.say(`A parent is filming the goal on their phone. "${this._phone.line}"`),this.updateComplete.then(()=>{const i=this.shadowRoot.querySelector("#phone-canvas");i&&(this.phoneRenderer=new te(i,{hud:!1,zoom:3}),this.phoneRenderer.setMatch(this.match.rules,this.match.teams))}))},900))}drawPhone(e){if(this._overlay!=="phone"||!this.phoneRenderer)return;const t=this._phone;t.acc+=e;const s=Math.min(t.frames.length-1,Math.floor(t.acc*30)),i=t.frames[s],n=this.reducedMotion()?0:1.5;this.phoneRenderer.draw(i,{dt:e,snapCamera:s===0,shake:n}),t.acc*30>t.frames.length+30&&this.closeOverlay()}async saveClip(){if(!as()){this.banner("CLIPS NEED CHROME, EDGE OR FIREFOX",{ms:2e3,color:"#ffffff"});return}const e=this.replay.last(10);if(e.length<15)return;this._overlay="clip",this._clip={progress:0,url:null};const t=this.match.teams;try{const s=await ns(e,this.match,{caption:`${t.home.short} VS ${t.away.short} - ${V(this.level).label}`,onFrame:(n,a)=>{this._clip=Object.assign({},this._clip,{progress:Math.round(n/a*100)})}}),i=globalThis.URL.createObjectURL(s.blob);this._clip={progress:100,url:i,name:`youth-sports-27-${t.home.short}-${t.away.short}.${s.ext}`.toLowerCase()},this.say("Clip ready to download.")}catch(s){this._clip={progress:0,error:s.message}}}closeClip(){this._clip&&this._clip.url&&globalThis.URL.revokeObjectURL(this._clip.url),this._clip=null,this.closeOverlay()}quit(){this.game=null,this.renderer=null,this._overlay=null,this._pip=null,this._brawl=null,this._book=null,this.audio.startLoop(),this.goMenu("setup")}toggleMute(){this._muted=!this._muted,this.audio.setMuted(this._muted),this._muted&&this.audio.stopLoop()}static get styles(){return[super.styles,gs]}render(){return m`
      <div class="shell">
        ${this._screen==="intro"&&!this.attract?this.renderIntro():""} ${this._screen==="menu"?this.renderMenu():""}
        ${this._screen==="bracket"?this.renderBracket():""} ${this._screen==="playing"?this.renderGame():""}
        ${this._screen==="final"?this.renderFinal():""} ${this._toast?m`<div class="toast" role="status">${this._toast}</div>`:""}
        <div class="sr-only" aria-live="polite">${this._announce}</div>
      </div>
    `}renderIntro(){return m`
      <div class="intro">
        <canvas id="intro" width="512" height="448" aria-hidden="true"></canvas>
        <button class="skip" aria-label="${this._introStarted?"Youth Sports 27. Press start.":"Turn on the TV: press start"}" @click=${this.introPress}>
          ${this._introStarted?"":"PRESS START"}
        </button>
        ${this._introStarted?"":m`<div class="intro-start" aria-hidden="true">
              <span>&#x23FB; PRESS START</span>
              <small>click, tap, enter or a gamepad button</small>
            </div>`}
      </div>
    `}menuFrame(e,t){const s=X[e.section]||X.title;return m`
      <div class="menu" style="--yh-accent:${s.color}">
        <canvas class="bg" width="400" height="300" aria-hidden="true"></canvas>
        <div class="topbar">
          ${e.back?m`<button @click=${e.back} aria-label="Back">&lt; BACK</button>`:m`<span></span>`}
          <button @click=${this.toggleFullscreen} aria-pressed="${this._fullscreen?"true":"false"}">${this._fullscreen?"EXIT FULL":"FULL SCREEN"}</button>
        </div>
        ${e.title?m`<h2 class="banner">${e.title}</h2>
              ${e.crumb?m`<span class="crumb">${e.crumb}</span>`:""}`:""}
        ${t}
        <div class="hint" aria-hidden="true">${(e.hints||[]).map(i=>m`<span><kbd>${i[0]}</kbd>${i[1]}</span>`)}</div>
      </div>
    `}renderMenu(){switch(this._menu){case"setup":return this.renderSetup();case"options":return this.renderOptionsMenu();case"extras":return this.renderExtras();case"howto":return this.renderHowto();default:return this.renderHub()}}renderHub(){const e=[{id:"setup",name:"PLAY",sub:"Exhibition or tournament. 8U to the Beer League.",icon:"play",section:"play"},{id:"options",name:"OPTIONS",sub:"Sound, full screen, brawls and BookFace.",icon:"options",section:"options"},{id:"extras",name:"EXTRAS",sub:"Cheat codes, guest stars, big heads.",icon:"extras",section:"extras"},{id:"howto",name:"HOW TO PLAY",sub:"Controls, rules and what the parents do.",icon:"howto",section:"howto"}],t="YOUTH SPORTS 27".split("");return this.menuFrame({section:"title",hints:[["ARROWS","MOVE"],["ENTER","SELECT"],["F","FULL SCREEN"]]},m`
        <h2 class="logo">
          <span class="small">THE YOUTH HOCKEY EXPERIENCE</span>
          <span class="sr-only">${this.t.title}</span>
          <span aria-hidden="true">${t.map((s,i)=>s===" "?m`<span> </span>`:m`<span class="ch" style="animation-delay:${-i*.16}s">${s}</span>`)}</span>
        </h2>
        <div class="hub">
          ${e.map(s=>{const i=X[s.section];return m`<button
              class="tile"
              data-nav
              data-cols="2"
              style="--c:${i.color};--d:${i.dark}"
              @click=${()=>{this.audio.start(),this.audio.play("select"),this.goMenu(s.id)}}
            >
              <img src="${cs(s.icon,"#ffffff",i.lit)}" alt="" width="64" height="64" />
              <span><span class="name">${s.name}</span><span class="sub">${s.sub}</span></span>
            </button>`})}
        </div>
      `)}renderRow(e,t){return m`<li>
      <button
        class="row"
        data-nav
        data-cycle="${e.cycle===!1?"":e.id}"
        ?disabled=${e.disabled}
        aria-label="${e.label}: ${e.value}${e.off?", not available":""}"
        @click=${t}
      >
        <span>${e.dot?m`<span aria-hidden="true" style="color:${e.dot}">&#x25CF;</span> `:""}${e.label}</span>
        <span class="val">
          ${e.img?m`<img src="${e.img}" alt="" width="18" height="18" />`:""}${e.off?m`<span style="opacity:.5">${e.value}</span>`:e.value}
          ${e.off||e.cycle===!1?"":m`<span class="arrows" aria-hidden="true">&#x25C2;&#x25B8;</span>`}
        </span>
      </button>
    </li>`}renderSetup(){const e=this.setupRows(),t=this.venueRules(),s=V(this.level),i=G[this.venue],n=P(this.home),a=P(this.away),o=Object.values(this.humans()),r=this.loadout(),l=r[this.yourSide()]||{};return this.menuFrame({section:"play",title:"PLAY",crumb:"MAIN / PLAY",back:()=>this.menuBack(),hints:[["\u2191\u2193","MOVE"],["\u2190\u2192","CHANGE"],["ENTER","SELECT"],["ESC","BACK"]]},m`
        <div class="panels">
          <section class="panel">
            <h3>SETUP</h3>
            <ul class="rows">
              ${e.map(d=>this.renderRow(d,()=>this.cycleRow(d.id,1)))}
            </ul>
          </section>
          <section class="panel">
            <h3>MATCHUP</h3>
            <div class="matchup">
              <div><img src="${Z(n.crest)}" alt="" />${n.name}</div>
              <div class="vs" aria-hidden="true">VS</div>
              <div><img src="${Z(a.crest)}" alt="" />${a.name}</div>
            </div>
            <p class="note">
              <strong>${s.label} at the ${i.label.toLowerCase()}: ${t.surface.label}, ${t.skaters} on ${t.skaters}${t.goalies?"":", no goalies"}.</strong>
              ${t.checking?"Body checking.":"No body checking."} ${t.offsides?"Offsides and icing.":"No offsides or icing."}
              ${t.keepScore?"Score is kept.":"No scoreboard."} Three 5 minute periods.
            </p>
            <p class="note">${i.crowd?s.blurb:"Nobody comes to watch. No refs, no parents, no pressure: everybody plays way better."}</p>
            ${l.guest||l.equipment||r.modifiers.length?m`<p class="note">
                  CHEATS: ${[l.guest?re[l.guest].name:"",l.equipment?he[l.equipment].name:"",...r.modifiers.map(d=>Xe[d].name)].filter(Boolean).join(" / ")}
                </p>`:""}
            ${o.length===0?m`<p class="note warn">Everyone is on CPU: you'll be watching.</p>`:""}
            ${this._pads.length?"":m`<p class="note">Plug in up to four gamepads and press a button to add them.</p>`}
            <p style="margin:16px 0 0">
              <button class="go" data-nav @click=${this.startFromSelect} ?disabled=${this.home===this.away}>DROP THE PUCK &#x25B8;</button>
            </p>
          </section>
        </div>
      `)}renderOptionsMenu(){return this.menuFrame({section:"options",title:"OPTIONS",crumb:"MAIN / OPTIONS",back:()=>this.menuBack(),hints:[["\u2191\u2193","MOVE"],["ENTER","TOGGLE"],["ESC","BACK"]]},m`
        <div class="panels">
          <section class="panel">
            <h3>SETTINGS</h3>
            <ul class="rows">
              ${this.optionRows().map(e=>this.renderRow(Object.assign({cycle:!1},e),()=>this.toggleOption(e.id)))}
            </ul>
          </section>
          <section class="panel">
            <h3>ABOUT</h3>
            <p class="note">Youth Sports 27 is a made-up league with made-up kids. Any resemblance to your association's group chat is a coincidence.</p>
            <p class="note">Parent brawls start when a ref misses a call. BookFace posts happen between periods. Turn either off here.</p>
            <p class="note">Settings and unlocked cheats are saved in this browser only.</p>
          </section>
        </div>
      `)}renderExtras(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),t=je.filter(s=>this.unlocks.has(s)).map(Qe);return this.menuFrame({section:"extras",title:"EXTRAS",crumb:"MAIN / EXTRAS",back:()=>this.menuBack(),hints:[["TYPE","A CODE"],["ENTER","TRY IT"],["ESC","BACK"]]},m`
        <div class="panels">
          <section class="panel">
            <h3>CHEAT CODES</h3>
            <form
              class="cheat"
              @submit=${s=>{s.preventDefault(),this.enterCode(this._cheat)}}
            >
              <label class="note" for="code" style="margin:0">Enter a code</label>
              <input
                id="code"
                data-nav
                autocomplete="off"
                spellcheck="false"
                maxlength="16"
                .value=${this._cheat}
                @input=${s=>{this._cheat=s.target.value.toUpperCase()}}
                @keydown=${s=>{s.key==="ArrowDown"?(s.preventDefault(),this.menuMove("down")):s.key==="Escape"&&(s.preventDefault(),this.menuBack())}}
              />
              <div class="keys" role="group" aria-label="On-screen keyboard">
                ${e.map(s=>m`<button
                    type="button"
                    data-nav
                    data-cols="10"
                    @click=${()=>{this._cheat=(this._cheat+s).slice(0,16),this.audio.play("menu")}}
                  >
                    ${s}
                  </button>`)}
                <button
                  type="button"
                  class="wide"
                  data-nav
                  data-cols="10"
                  aria-label="Delete"
                  @click=${()=>{this._cheat=this._cheat.slice(0,-1)}}
                >
                  DEL
                </button>
                <button type="submit" class="wide go" data-nav data-cols="10">OK</button>
              </div>
            </form>
            <p class="note">A gamepad works too. Old gamers know a certain button code.</p>
          </section>
          <section class="panel">
            <h3>UNLOCKED ${t.length}/${je.length}</h3>
            ${t.length?m`<ul class="unlocked">
                  ${t.map(s=>s.type==="modifier"?this.renderRow({id:s.key,label:s.name,value:this.unlocks.isActive(s.id)?"ON":"OFF",cycle:!1},()=>{this.unlocks.toggle(s.id),this.audio.play("menu"),this.requestUpdate()}):this.renderRow({id:s.key,label:s.name,value:s.type==="guest"?"GUEST":"GEAR",cycle:!1},()=>{s.type==="guest"?this._guest=s.id:this._equipment=s.id,this.audio.play("select"),this.goMenu("setup")}))}
                </ul>
                <p class="note">Guest stars and equipment go to your team: pick them on the PLAY screen.</p>`:m`<p class="note">Nothing yet. HOW TO PLAY has a few hints.</p>`}
          </section>
        </div>
      `)}renderHowto(){const e=Ge[this._howto]||Ge[0];return this.menuFrame({section:"howto",title:"HOW TO PLAY",crumb:"MAIN / HOW TO PLAY",back:()=>this.menuBack(),hints:[["\u2191\u2193","MOVE"],["ESC","BACK"]]},m`
        <div class="list">
          <section class="panel">
            <h3>TOPICS</h3>
            <ul class="rows">
              ${Ge.map((t,s)=>m`<li>
                  <button
                    class="row ${s===this._howto?"on":""}"
                    data-nav
                    aria-current="${s===this._howto?"true":"false"}"
                    @focus=${()=>{this._howto=s}}
                    @click=${()=>{this._howto=s}}
                  >
                    <span>${t.title}</span>
                  </button>
                </li>`)}
            </ul>
          </section>
          <section class="panel detail" aria-live="polite">
            <h3>${e.title.toUpperCase()}</h3>
            <h4>${e.title}</h4>
            ${e.body.map(t=>m`<p>${t}</p>`)}
          </section>
        </div>
      `)}renderStands(){if(this.game&&!this.game.rules.crowd)return m`<div class="stands empty" aria-hidden="true">
        <span>${this.game.rules.venue==="pond"?"Snowbanks. A dog. Nobody else.":"Empty driveway. Somebody yells CAR!"}<br />Nobody came to watch. Everybody plays better.</span>
      </div>`;const e=s=>s.fans.filter(i=>!this._banned.has(i)).map(i=>{const n=this._fx[s.uid],a=this._fanFx[i]?"fight":n?n.kind:"";let o="";a==="fight"?o="fight":a==="wild"||a==="jump"?o=s.superFans?"wild":"jump":a==="money"&&(o="jump");const r=a==="angry"||a==="fight"?"angry":a==="wild"||a==="jump"?"happy":"none";return m`
            <div class="fan ${o}">
              ${a==="money"&&(s.superFans||this.game&&!this.game.rules.keepScore)?m`<span class="bill">$</span>`:""}
              <rpg-character seed="${i}" height="46" width="36" expression="${r}" pose="${o==="wild"?"cheer":"none"}" reduce-motion></rpg-character>
            </div>
          `}),t=s=>m`<div class="side ${s}">
        ${(this._lineup[s]||[]).map(i=>m`<div class="section">${e(i)}<span class="tag">#${i.number}</span></div>`)}
      </div>`;return m`<div class="stands" aria-hidden="true">${t("home")}${t("away")}</div>`}renderGame(){const e=this._touch&&!this.attract;return m`
      ${this.attract?"":this.renderStands()}
      <div class="stage" tabindex="0" role="application" aria-label="Hockey rink. ${this.t.controlsHelp}">
        <canvas id="rink" width="256" height="224"></canvas>
        ${this.renderPip()} ${this.renderOverlay()}
      </div>
      ${this.attract?"":m`
            <div
              class="touch ${e||this._touchVisible()?"on":""}"
              @pointerdown=${this.touchDown}
              @pointermove=${this.touchMove}
              @pointerup=${this.touchUp}
              @pointercancel=${this.touchUp}
            >
              <div class="joy" data-joy><div class="knob"></div></div>
              <div class="pad-buttons">
                <button data-btn="pass">PASS</button>
                <button data-btn="shoot">SHOOT</button>
                <button data-btn="check">CHECK</button>
                <button data-btn="stick">STICK</button>
              </div>
            </div>
            <div class="toolbar">
              <button
                @click=${()=>{this._overlay="pause",this.focusOverlay()}}
              >
                ${this.t.pause}
              </button>
              <button @click=${this.saveClip}>${this.t.saveClip}</button>
              <button @click=${this.toggleMute}>${this._muted?this.t.unmute:this.t.mute}</button>
              <button @click=${this.toggleFullscreen}>${this._fullscreen?this.t.exitFullscreen:this.t.fullscreen}</button>
              <span class="spacer"></span>
              <button @click=${this.quit}>${this.t.quit}</button>
            </div>
            <p class="help">${this._touchVisible()?this.t.touchHelp:this.t.controlsHelp}</p>
          `}
    `}renderPip(){const e=this._pip;return e?m`<div class="pip" aria-hidden="true">
      <canvas id="pip-canvas" width="96" height="72"></canvas>
      <div class="burst"></div>
      <div class="half a"></div>
      <div class="half b"></div>
      ${e.money.map(t=>m`<span class="money" style="--dx:${t.dx};--dy:${t.dy};--r:${t.r};animation-delay:${t.delay}">${t.emoji}</span>`)}
      <div class="cap"><strong>SNAP!</strong> #${e.number} &middot; $349</div>
    </div>`:""}_touchVisible(){return globalThis.matchMedia&&globalThis.matchMedia("(pointer: coarse)").matches}touchDown(e){this._touch||(this._touch=!0,this.input.touch.active=!0,this.game&&!this.game.controllers.kb&&(this._assign=Object.assign({},this._assign,{kb:"home"}),this.game.controllers.kb="home",this.game.reassignControllers()));const t=e.target.closest?e.target.closest("[data-btn]"):null;if(t){this.input.touch[t.dataset.btn]=!0,this.input.tap(t.dataset.btn),e.preventDefault();return}if(e.target.closest&&e.target.closest("[data-joy]")){this._joyId=e.pointerId;try{e.target.setPointerCapture(e.pointerId)}catch{}this.touchMove(e)}}touchMove(e){if(e.pointerId!==this._joyId)return;const t=this.shadowRoot.querySelector("[data-joy]"),s=t.getBoundingClientRect();let i=(e.clientX-(s.left+s.width/2))/(s.width/2),n=(e.clientY-(s.top+s.height/2))/(s.height/2);const a=Math.hypot(i,n);a>1&&(i/=a,n/=a),this.input.touch.x=Math.abs(i)<.15?0:i,this.input.touch.y=Math.abs(n)<.15?0:n;const o=t.querySelector(".knob");o.style.transform=`translate(${i*36}px, ${n*36}px)`}touchUp(e){const t=e.target.closest?e.target.closest("[data-btn]"):null;if(t&&(this.input.touch[t.dataset.btn]=!1),e.pointerId===this._joyId){this._joyId=null,this.input.touch.x=0,this.input.touch.y=0;const s=this.shadowRoot.querySelector(".knob");s&&(s.style.transform="")}}renderBrawl(){const e=this._brawl;if(!e)return"";const t=e.fight,s=t.them,i=t.you,n=t.result,a=n&&n.winner==="you"?"down":s.state,o=n&&n.winner==="you"?"sleepy":s.state==="stunned"?"surprised":"angry",r=[i.dodge||"",i.block?"block":"",i.stun>0?"stun":""].join(" "),l=i.punch,d=t.messages.length&&t.messages[t.messages.length-1].at-t.time<.8?t.messages[t.messages.length-1].text:"";return m`<div class="brawl" tabindex="-1" role="dialog" aria-label="Brawl in the stands">
      <div class="hud">
        <div>
          <div class="who">#${e.mine.player.number}'S PARENT <span class="stars">${"\u2605".repeat(i.stars)}</span></div>
          <div class="bar"><span style="transform:scaleX(${i.hp/100})"></span></div>
        </div>
        <div class="clock">${Math.ceil(t.time)}</div>
        <div>
          <div class="who">${e.theirTeam} PARENT</div>
          <div class="bar them"><span style="transform:scaleX(${s.hp/100})"></span></div>
        </div>
      </div>
      <div class="bleachers" aria-hidden="true">
        ${e.crowd.map((c,u)=>m`<div class="fan ${u%2?"fight":"wild"}"><rpg-character seed="${c}" height="56" width="44" expression="angry" reduce-motion></rpg-character></div>`)}
      </div>
      <div class="them ${a}" aria-hidden="true">
        ${s.state==="tell"?m`<span class="bang">!</span>`:""} ${s.state==="stunned"?m`<span class="dizzy">&#x2605;</span>`:""}
        <rpg-character seed="${e.them}" height="240" width="190" expression="${o}" reduce-motion></rpg-character>
      </div>
      <div class="kids" aria-hidden="true">
        ${e.kids.map(c=>m`<div style="position:relative"><span class="tear">#${c.number}</span><rpg-character seed="${c.seed}" preset="${c.crest}" height="58" width="46" expression="sad" reduce-motion></rpg-character></div>`)}
      </div>
      <div class="you ${r}" style="--jersey:${e.jersey}" aria-hidden="true">
        <div class="body"></div>
        <div class="head"></div>
        <div class="fist l ${l&&(l.kind==="jab"||l.kind==="star")?"go":""} ${l&&l.high?"high":""}"></div>
        <div class="fist r ${l&&(l.kind==="hook"||l.kind==="star")?"go":""} ${l&&l.high?"high":""}"></div>
      </div>
      ${d&&!n?m`<div class="msg" aria-hidden="true">${d}</div>`:""}
      ${n?m`<div class="overlay">
            <div class="card" role="alert">
              <span class="kicker">NO CALL ON THE ${e.label.toUpperCase()}</span>
              <h3>${n.how==="KO"?n.winner==="you"?"K.O.! You win.":"K.O.! You lose.":n.winner==="draw"?"Time. A draw.":n.winner==="you"?"Time. You win on points.":"Time. You lose on points."}</h3>
              <p>Nobody wins this one. ${e.line}</p>
              <p>The crowd sours. #${e.mine.player.number} and #${e.theirs.player.number} are rattled for the rest of the game. Both parents are banned from the stands.</p>
              <div class="actions"><button class="go" @click=${this.closeOverlay}>Back to the game</button></div>
            </div>
          </div>`:m`<div class="hint">
            <span><kbd>&#x2190;&#x2192;</kbd>DODGE</span><span><kbd>&#x2193;</kbd>BLOCK</span><span><kbd>Z</kbd>JAB</span><span><kbd>X</kbd>HOOK</span><span><kbd>&#x2191;</kbd>HIGH</span><span
              ><kbd>C</kbd>STAR</span
            >
          </div>`}
    </div>`}renderBookFace(){const e=this._book;if(!e)return"";const t=e.ours-e.theirs,s=this.bookText(),i=this.match.teams[e.side];return m`<div class="overlay">
      <div class="bf" role="dialog" aria-labelledby="bf-title">
        <header><span id="bf-title">bookface</span><small>End of period ${e.period}</small></header>
        <div class="post">
          <div class="who">
            <rpg-character seed="${e.poster}" height="44" width="36" expression="happy" reduce-motion aria-hidden="true"></rpg-character>
            <span>${i.short} Hockey Parent<small>${e.posted?"Just now \xB7 Public":"Draft \xB7 Public"}</small></span>
          </div>
          <div class="text">${s}</div>
          ${e.highlights.length?m`<div class="grid">
                ${e.highlights.map((n,a)=>m`<button class="thumb" aria-pressed="${e.chosen.includes(a)?"true":"false"}" ?disabled=${e.posted} @click=${()=>this.toggleHighlight(a)}>
                    <canvas data-i="${a}" width="96" height="72" aria-hidden="true"></canvas>
                    <span>${e.chosen.includes(a)?"\u2714 ":""}${ct(n)}</span>
                  </button>`)}
              </div>`:m`<p>No highlights this period. Posting anyway.</p>`}
          ${e.posted?m`<div class="likes"><span>&#x1F44D;&#x2764;&#xFE0F;&#x1F621; ${ut(t,e.chosen)}</span><span>${dt(t).length} comments</span></div>
                ${dt(t).map(n=>m`<div class="comment">
                    <div><b>${n[0]}</b>${n[1]}</div>
                  </div>`)}`:""}
        </div>
        <div class="actions">
          ${e.posted?m`<button class="close" @click=${this.closeBookFace}>Close BookFace</button>`:m`<button class="plain" @click=${this.closeBookFace}>Don't post</button><button @click=${this.bookPost}>Post</button>`}
        </div>
      </div>
    </div>`}renderOverlay(){if(this._overlay==="brawl")return this.renderBrawl();if(this._overlay==="bookface")return this.renderBookFace();if(this._overlay==="pause")return m`<div class="overlay">
        <div class="card" role="dialog" aria-label="${this.t.pause}">
          <span class="kicker">PAUSED</span>
          <h3>${this.t.pause}</h3>
          <p>${this.t.controlsHelp}</p>
          <div class="actions">
            <button class="go" @click=${this.closeOverlay}>${this.t.resume}</button>
            <button @click=${this.saveClip}>${this.t.saveClip}</button>
            <button @click=${this.toggleFullscreen}>${this._fullscreen?this.t.exitFullscreen:this.t.fullscreen}</button>
            <button @click=${this.toggleMute}>${this._muted?this.t.unmute:this.t.mute}</button>
            <button @click=${this.quit}>${this.t.quit}</button>
          </div>
        </div>
      </div>`;if(this._overlay==="penalty"&&this._penalty){const e=this._penalty;return m`<div class="overlay" @click=${this.closeOverlay}>
        <div class="card penalty" role="alert">
          <div class="label">${e.label}</div>
          <p><strong>#${e.number} ${e.name}</strong>, ${e.team}. Two minutes.</p>
          <p>Ref signal: ${e.signal}.</p>
          <p>${e.explain}</p>
          <p class="kicker">Press pass to continue.</p>
        </div>
      </div>`}if(this._overlay==="intermission"&&this._intermission){const e=this._intermission,t=e.subject?this.entity(e.subject):null,s=this.game.teams[e.side];return m`<div class="overlay">
        <div class="card intermission" role="dialog" aria-labelledby="int-title">
          ${t?m`<div class="people" aria-hidden="true">
                <rpg-character seed="${t.player.fans[0]}" height="72" width="56" expression="${e.result?"happy":"none"}"></rpg-character>
                <rpg-character seed="${t.player.id}" preset="${s.def.crest}" height="72" width="56"></rpg-character>
              </div>`:""}
          <span class="kicker">END OF PERIOD ${this.game.period-(e.result?1:0)}</span>
          <h3 id="int-title">${e.title}</h3>
          <p>${e.body}</p>
          ${e.result?m`<p><strong>${e.result}</strong></p>
                <div class="actions">
                  <button class="go continue" @click=${this.endIntermission}>Start period ${this.game.period}</button>
                </div>`:m`<div class="actions stack">${e.choices.map((i,n)=>m`<button @click=${()=>this.chooseIntermission(n)}>${i}</button>`)}</div>`}
        </div>
      </div>`}if(this._overlay==="phone"&&this._phone)return m`<div class="overlay" @click=${this.closeOverlay}>
        <div class="phone-wrap">
          <div class="caller" aria-hidden="true">
            <rpg-character seed="${this._phone.fan}" item="phone" height="82" width="64" expression="happy"></rpg-character>
          </div>
          <div class="phone">
            <span class="rec">REC #${this._phone.number}</span>
            <canvas id="phone-canvas" width="120" height="200"></canvas>
          </div>
          <div class="bubble">${this._phone.line}</div>
        </div>
      </div>`;if(this._overlay==="clip"&&this._clip){const e=this._clip;return m`<div class="overlay">
        <div class="card" role="dialog" aria-label="${this.t.saveClip}">
          <h3>${this.t.saveClip}</h3>
          ${e.error?m`<p>${e.error}</p>`:e.url?m`<p>Your last 10 seconds are ready to share.</p>`:m`<p>Recording the replay… ${e.progress}%</p>
                  <progress max="100" .value=${e.progress}></progress>`}
          <div class="actions">
            ${e.url?m`<a class="btn go" href="${e.url}" download="${e.name}">Download clip</a>`:""}
            <button @click=${this.closeClip} ?disabled=${!e.url&&!e.error}>Back to the game</button>
          </div>
        </div>
      </div>`}return""}renderFinal(){const e=this._final;if(!e||!this.match)return"";const t=e.result,s=this.match.teams,i=t.reason&&t.reason.startsWith("called");let n="FINAL";i?n="GAME CALLED":t.keepScore?t.reason==="overtime"?n="FINAL / OT":t.reason==="shootout"&&(n="FINAL / SO"):n="GOOD GAME!";const a=this.tournament;return this.menuFrame({section:"gold",title:n,crumb:i?"Not enough players left":t.keepScore?"":"Nobody kept score",hints:[["ENTER","SELECT"],["ESC","MENU"]]},m`
        <div class="panels">
          <section class="panel">
            <h3>SCORE</h3>
            <div class="scoreline">
              <div><img src="${Z(s.home.crest)}" alt="" />${s.home.name}</div>
              <div class="big">${t.keepScore?m`${t.home}&ndash;${t.away}`:"\u{1F3C5}"}</div>
              <div><img src="${Z(s.away.crest)}" alt="" />${s.away.name}</div>
            </div>
            <table class="stats">
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">${s.home.short}</th>
                  <th scope="col">${s.away.short}</th>
                </tr>
              </thead>
              <tbody>
                ${[["Shots","shots"],["Passes","passes"],["Hits","hits"],["PIM","pim"]].map(o=>m`<tr>
                    <th scope="row">${o[0]}</th>
                    <td>${e.stats.home[o[1]]}</td>
                    <td>${e.stats.away[o[1]]}</td>
                  </tr>`)}
              </tbody>
            </table>
          </section>
          <section class="panel">
            <h3>AWARDS</h3>
            <ul class="awards">
              ${e.awards.map(o=>m`<li><strong>${o.label}</strong>${o.who}</li>`)}
            </ul>
            <div class="actions" style="display:flex;flex-wrap:wrap;gap:8px">
              ${a?m`<button
                    class="go"
                    data-nav
                    @click=${()=>{this._screen="bracket",this.focusFirst()}}
                  >
                    ${a.done?a.jamboree?"MEDALS FOR EVERYONE":"RESULTS":a.jamboree?"NEXT GAME":"BRACKET"}
                  </button>`:m`<button class="go" data-nav @click=${()=>this.newGame(this.game.opts.home,this.game.opts.away)}>PLAY AGAIN</button>`}
              <button data-nav @click=${this.quit}>CHANGE TEAMS</button>
            </div>
          </section>
        </div>
      `)}renderBracket(){const e=this.tournament;if(!e)return"";const t=i=>i?P(i).name:"TBD",s=e.next();return this.menuFrame({section:"play",title:e.jamboree?`${V(this.level).label} JAMBOREE`:`${V(this.level).label} TOURNAMENT`,crumb:G[this.venue].label,back:()=>this.menuBack(),hints:[["ENTER","PLAY"],["ESC","MENU"]]},m`
        <section class="panel round" style="margin-top:16px">
          <h3>${e.jamboree?"NO STANDINGS":"BRACKET"}</h3>
          ${e.jamboree?m`<p class="note">Three games, no standings, no bracket. Everybody plays, everybody gets a medal. Somebody's parent is still keeping score in a notebook.</p>`:""}
          ${e.rounds.map(i=>m`
              <h3 style="position:static;background:none;color:inherit;clip-path:none;padding:0">${i.name}</h3>
              <ul>
                ${i.games.map(n=>m`<li class="${n.user?"mine":""}">
                    <span>${t(n.home)} vs ${t(n.away)}</span>
                    <span>${n.played?e.jamboree?"Played":`${n.score.home}\u2013${n.score.away}${n.winner?`, ${P(n.winner).short} advance`:""}`:n.user?"Your game":""}</span>
                  </li>`)}
              </ul>
            `)}
          ${e.done?m`<p class="note">${e.jamboree?"Everybody gets a medal \u{1F3C5}":e.champion===e.team?`${t(e.champion)} are champions! \u{1F3C6}`:`${t(e.champion)} win the tournament.`}</p>`:""}
          <p style="margin:16px 0 0;display:flex;gap:8px;flex-wrap:wrap">
            ${s?m`<button class="go" data-nav @click=${this.playNextTournamentGame}>PLAY ${P(s.home).short} VS ${P(s.away).short}</button>`:""}
            <button data-nav @click=${this.quit}>BACK TO THE MENU</button>
          </p>
        </section>
      `)}static get haxProperties(){return{canScale:!0,canEditSource:!0,gizmo:{title:"Youth Sports 27",description:"A 16-bit youth hockey game. Set attract mode to embed a CPU vs CPU demo of an age level.",icon:"maps:directions-run",color:"pink",tags:["Interactive","game","hockey"],handles:[],meta:{author:"btopro"}},settings:{configure:[{property:"level",title:"Age level",inputMethod:"select",options:ie.reduce((e,t)=>Object.assign(e,{[t.id]:t.label}),{})},{property:"venue",title:"Venue",inputMethod:"select",options:Object.values(G).reduce((e,t)=>Object.assign(e,{[t.id]:t.label}),{})},{property:"home",title:"Home team",inputMethod:"select",options:Y.reduce((e,t)=>Object.assign(e,{[t.id]:t.name}),{})},{property:"away",title:"Away team",inputMethod:"select",options:Y.reduce((e,t)=>Object.assign(e,{[t.id]:t.name}),{})},{property:"attract",title:"Attract mode (CPU demo)",inputMethod:"boolean"},{property:"skipIntro",title:"Skip the title intro",inputMethod:"boolean"}],advanced:[]},demoSchema:[{tag:"youth-hockey-27",properties:{level:"8U",attract:!0},content:""}]}}}globalThis.customElements.define(gt.tag,gt);
