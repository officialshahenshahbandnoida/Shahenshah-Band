(() => {
"use strict";
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const phone="+91 93106 24387", wa="https://wa.me/919310624387", maps="https://maps.app.goo.gl/vBuiUvpbxHpA6QyG9?g_st=aw";
const safeStore=(type,key,val)=>{try{if(val===undefined)return window[type+"Storage"].getItem(key);window[type+"Storage"].setItem(key,val)}catch(e){return null}};
const toast=(msg,type="Info")=>{const r=$("#toastRegion"),t=document.createElement("div");t.className="toast";t.setAttribute("role","status");t.innerHTML=`<b>${type}</b><small>${msg}</small>`;r.append(t);setTimeout(()=>t.remove(),3200)};
const today=()=>new Date().toISOString().slice(0,10);
$$('input[type="date"]').forEach(i=>i.min=today());
$("#year").textContent=new Date().getFullYear();

let progressRAF=false,lastY=scrollY;
function scrollUI(){const y=scrollY, max=document.documentElement.scrollHeight-innerHeight;$("#scrollProgress").style.width=(max?y/max*100:0)+"%";$("#siteHeader").classList.toggle("scrolled",y>20);$("#backTop").classList.toggle("show",y>650);lastY=y;progressRAF=false}
addEventListener("scroll",()=>{if(!progressRAF){requestAnimationFrame(scrollUI);progressRAF=true}},{passive:true});scrollUI();

const revealObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.12});
$$(".reveal").forEach(e=>revealObs.observe(e));

const pre=$("#preloader"), bar=$("#loadBar"), pct=$("#loadPct");
if(safeStore("session","shah-preloaded")){pre.classList.add("done")}else{
 let p=0;const tick=setInterval(()=>{p=Math.min(96,p+Math.random()*12);bar.style.width=p+"%";pct.textContent=Math.round(p)+"%";if(document.readyState==="complete"&&p>85){clearInterval(tick);bar.style.width="100%";pct.textContent="100%";setTimeout(()=>{pre.classList.add("done");safeStore("session","shah-preloaded","1")},250)}},70);
 addEventListener("load",()=>{setTimeout(()=>{pre.classList.add("done");safeStore("session","shah-preloaded","1")},700)},{once:true});
}

const menu=$("#mobileNav"),toggle=$("#menuToggle");
function closeMenu(){menu.classList.remove("open");menu.setAttribute("aria-hidden","true");toggle.setAttribute("aria-expanded","false")}
toggle.onclick=()=>{const open=!menu.classList.contains("open");menu.classList.toggle("open",open);menu.setAttribute("aria-hidden",String(!open));toggle.setAttribute("aria-expanded",String(open))};
$("#mobileClose").onclick=closeMenu;$$(".mobile-links a").forEach(a=>a.onclick=closeMenu);

const navLinks=$$(".desktop-nav a:not(.nav-cta)");
const sections=$$("main section[id]");
const navObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){navLinks.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+e.target.id))}}),{rootMargin:"-35% 0px -55% 0px"});
sections.forEach(s=>navObs.observe(s));

if(matchMedia("(pointer:fine)").matches&&!matchMedia("(prefers-reduced-motion: reduce)").matches){
 const dot=document.createElement("div");dot.className="cursor-dot";const ring=document.createElement("div");ring.className="cursor-ring";document.body.append(dot,ring);
 const st=document.createElement("style");st.textContent=".cursor-dot,.cursor-ring{position:fixed;pointer-events:none;z-index:1000;transform:translate(-50%,-50%);border-radius:50%;transition:width .2s,height .2s,border-color .2s;}.cursor-dot{width:5px;height:5px;background:#D8B4A0}.cursor-ring{width:30px;height:30px;border:1px solid #D8B4A0}.cursor-ring.big{width:54px;height:54px;border-color:#F5EBDD;background:rgba(216,180,160,.06)}";document.head.append(st);
 addEventListener("pointermove",e=>{dot.style.left=e.clientX+"px";dot.style.top=e.clientY+"px";ring.style.left=e.clientX+"px";ring.style.top=e.clientY+"px"},{passive:true});
 addEventListener("pointerover",e=>{if(e.target.closest("a,button,.gallery-item"))ring.classList.add("big")});addEventListener("pointerout",e=>{if(e.target.closest("a,button,.gallery-item"))ring.classList.remove("big")});
}
$$(".tilt").forEach(card=>{card.addEventListener("pointermove",e=>{if(!matchMedia("(pointer:fine)").matches||matchMedia("(prefers-reduced-motion: reduce)").matches)return;const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(700px) rotateX(${(-y*5).toFixed(2)}deg) rotateY(${(x*5).toFixed(2)}deg) translateY(-3px)`});card.addEventListener("pointerleave",()=>card.style.transform="")});

const serviceData={
"Wedding Band":["A wedding-focused music experience for the celebration.","Wedding celebrations, family gatherings and reception-related occasions."],
"Baraat Band":["A lively traditional atmosphere for a wedding procession.","Baraat processions and wedding arrival celebrations."],
"Wedding Procession":["Music and movement for memorable wedding procession moments.","Wedding processions and related celebrations."],
"Family Celebrations":["Bring celebration energy to family occasions.","Family functions, gatherings and festive moments."],
"Special Events":["Discuss the requirements of your special event directly.","Special occasions and event enquiries."],
"Custom Event Enquiry":["Tell us what you are planning and start a conversation.","Custom requirements across weddings, baraats and special events."]
};
let activeModal=null;
function openModal(backdrop,focusEl){backdrop.classList.add("open");backdrop.setAttribute("aria-hidden","false");activeModal=focusEl||backdrop.querySelector(".modal-close");activeModal?.focus()}
function closeModal(backdrop){backdrop.classList.remove("open");backdrop.setAttribute("aria-hidden","true");activeModal?.focus();activeModal=null}
$$(".service-open").forEach(b=>b.onclick=()=>{const name=b.closest("[data-service]").dataset.service,d=serviceData[name];$("#modalTitle").textContent=name;$("#modalText").textContent=d[0];$("#modalOccasions").textContent=d[1];openModal($("#modalBackdrop"),b)});
$("#modalClose").onclick=()=>closeModal($("#modalBackdrop"));$("#modalEnquire").onclick=()=>{closeModal($("#modalBackdrop"));setTimeout(()=>$("#contact").scrollIntoView({behavior:"smooth"}),100)};
$("#videoOpen").onclick=()=>openModal($("#videoBackdrop"),$("#videoOpen"));$("#videoClose").onclick=()=>closeModal($("#videoBackdrop"));

const gallery=$$(".gallery-item"), galleryState={items:[],index:0};
function renderGallery(){const f=$(".filter.active").dataset.filter;gallery.forEach(x=>x.hidden=f!=="all"&&x.dataset.cat!==f);galleryState.items=gallery.filter(x=>!x.hidden)}
$$(".filter").forEach(b=>b.onclick=()=>{$$(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderGallery()});renderGallery();
function openGallery(i){galleryState.index=i;const item=galleryState.items[i];$("#lbArt span").textContent=item.querySelector("span").textContent;$("#lbArt small").textContent="Image placeholder • "+item.dataset.title;$("#lbCaption").textContent=`${i+1} / ${galleryState.items.length} — ${item.dataset.title}`;openModal($("#lightboxBackdrop"),item)}
gallery.forEach(g=>g.onclick=()=>openGallery(galleryState.items.indexOf(g)));
function moveGallery(n){if(!galleryState.items.length)return;galleryState.index=(galleryState.index+n+galleryState.items.length)%galleryState.items.length;openGallery(galleryState.index)}
$("#lbPrev").onclick=()=>moveGallery(-1);$("#lbNext").onclick=()=>moveGallery(1);$("#lightboxClose").onclick=()=>closeModal($("#lightboxBackdrop"));

const planner=$("#plannerForm"), booking=$("#bookingForm");
$("#plannerUse").onclick=()=>{["event","date","location","guests","contact"].forEach(n=>{const a=planner.elements[n],b=booking.elements[n];if(a&&b)b.value=a.value});booking.scrollIntoView({behavior:"smooth",block:"center"});toast("Planner details added to the booking form.","Success")};

function serializeForm(form){return Object.fromEntries(new FormData(form).entries())}
function restoreForm(){const saved=safeStore("session","shah-booking");if(!saved)return;try{const d=JSON.parse(saved);Object.entries(d).forEach(([k,v])=>{if(booking.elements[k])booking.elements[k].value=v});$("#charCounter").textContent=`${(booking.elements.message.value||"").length} / 600`}catch{}}
restoreForm();
booking.addEventListener("input",()=>{safeStore("session","shah-booking",JSON.stringify(serializeForm(booking)));$("#charCounter").textContent=`${booking.elements.message.value.length} / 600`});
function validate(){let ok=true;$$("label",booking).forEach(l=>{$(".error",l).textContent=""});const d=serializeForm(booking);const set=(n,m)=>{const e=booking.elements[n],er=$(".error",e.closest("label"));er.textContent=m;ok=false};
if(!d.name.trim())set("name","Please enter your name.");if(!/^[0-9+ ()-]{8,20}$/.test(d.phone.trim()))set("phone","Enter a valid phone number.");if(!d.event)set("event","Choose an event type.");if(!d.date||d.date<today())set("date","Choose today or a future date.");if(!d.location.trim())set("location","Enter the event location.");if(!d.guests)set("guests","Choose a guest count.");return ok}
let bookingData=null;
booking.onsubmit=e=>{e.preventDefault();if(!validate()){const er=$(".error:not(:empty)",booking);er?.closest("label")?.querySelector("input,select,textarea")?.focus();toast("Please check the highlighted fields.","Error");return}bookingData=serializeForm(booking);const rows=[["Name",bookingData.name],["Phone",bookingData.phone],["Event",bookingData.event],["Date",bookingData.date],["Location",bookingData.location],["Guests",bookingData.guests],["Message",bookingData.message||"—"]];$("#previewContent").replaceChildren(...rows.map(([a,b])=>{const d=document.createElement("div");d.innerHTML=`<b>${a}</b><span></span>`;d.querySelector("span").textContent=b;return d}));openModal($("#bookingBackdrop"),$("#submitBtn"))};
$("#previewClose").onclick=()=>closeModal($("#bookingBackdrop"));$("#editBooking").onclick=()=>closeModal($("#bookingBackdrop"));
function summary(){if(!bookingData)return"";return`Hello Shahenshah Band Noida,

I would like to enquire about booking.

Name: ${bookingData.name}
Phone: ${bookingData.phone}
Event: ${bookingData.event}
Date: ${bookingData.date}
Location: ${bookingData.location}
Guests: ${bookingData.guests}
Preferred Contact: ${bookingData.contact}
Message: ${bookingData.message||"—"}

Please share availability and booking details.

Thank you.`}
$("#sendWhatsApp").onclick=()=>{location.href=wa+"?text="+encodeURIComponent(summary());safeStore("session","shah-booking",null);toast("Opening WhatsApp with your enquiry.","Success");closeModal($("#bookingBackdrop"))};
$("#copySummary").onclick=async()=>{await copyText(summary());toast("Booking summary copied.","Success")};
$("#clearForm").onclick=()=>{if(confirm("Clear the unfinished booking form?")){booking.reset();safeStore("session","shah-booking",null);$("#charCounter").textContent="0 / 600";toast("Booking form cleared.","Info")}};

async function copyText(text){try{await navigator.clipboard.writeText(text)}catch{const t=document.createElement("textarea");t.value=text;document.body.append(t);t.select();document.execCommand("copy");t.remove()}}
$$(".copy-btn").forEach(b=>b.onclick=async()=>{await copyText(b.dataset.copy);toast("Copied to clipboard.","Success")});
$("#shareBtn").onclick=async()=>{const data={title:"Shahenshah Band Noida",text:"Explore Shahenshah Band Noida — wedding, baraat and event band services.",url:location.href};try{if(navigator.share)await navigator.share(data);else{await copyText(location.href);toast("Website link copied.","Success")}}catch{}};

const assistant=$("#assistantPanel"), chat=$("#chatLog");
function chatAdd(text,who="bot"){const d=document.createElement("div");d.className="bubble "+who;d.textContent=text;chat.append(d);chat.scrollTop=chat.scrollHeight}
function botReply(q){const x=q.toLowerCase();if(x.includes("location"))return"Salarpur, Noida, Uttar Pradesh 201304. Service enquiries are welcomed across Noida, Greater Noida and Delhi NCR.";if(x.includes("contact"))return`Call +91 93106 24387 or WhatsApp the same number.`;if(x.includes("booking")||x.includes("enquire"))return"Use the booking form on this page, or send an enquiry on WhatsApp. Final pricing depends on event requirements.";if(x.includes("baraat"))return"We accept baraat band enquiries. Share your date, location and guest details through the booking form.";return"We cover wedding, baraat, family celebration and special event enquiries. Need more help? WhatsApp us."}
function openAssistant(){assistant.classList.add("open");assistant.setAttribute("aria-hidden","false");if(!chat.children.length)chatAdd("Hello! I’m the Shahenshah Assistant. I can answer basic questions about services, booking and contact details.");$("#assistantOpen")?.focus()}
$("#assistantOpen").onclick=openAssistant;$("#assistantClose").onclick=()=>{assistant.classList.remove("open");assistant.setAttribute("aria-hidden","true")};$("#clearChat").onclick=()=>{chat.replaceChildren();chatAdd("Chat cleared. How can I help?")};$$(".quick-replies button").forEach(b=>b.onclick=()=>{chatAdd(b.textContent,"user");setTimeout(()=>chatAdd(botReply(b.textContent)),350)});

const commands=[["Home","#home"],["About","#about"],["Services","#services"],["Experience","#experience"],["Gallery","#gallery"],["Videos","#videos"],["Why Us","#why"],["FAQ","#faq"],["Contact","#contact"],["Book Now","#contact"],["Call","tel:+919310624387"],["WhatsApp",wa],["Maps",maps]];
const cmdBack=$("#commandBackdrop"),cmdInput=$("#commandInput"),cmdList=$("#commandList");let cmdIndex=0;
function drawCommands(){const q=cmdInput.value.toLowerCase();const arr=commands.filter(c=>c[0].toLowerCase().includes(q));cmdList.replaceChildren(...arr.map((c,i)=>{const b=document.createElement("button");b.className="command-item"+(i===cmdIndex?" selected":"");b.innerHTML=`<b></b><small>${c[1].startsWith("#")?"Section":"Action"}</small>`;b.querySelector("b").textContent=c[0];b.onclick=()=>runCommand(c);return b}))}
function runCommand(c){cmdBack.classList.remove("open");cmdBack.setAttribute("aria-hidden","true");if(c[1].startsWith("#"))document.querySelector(c[1])?.scrollIntoView({behavior:"smooth"});else location.href=c[1]}
function openCommand(){cmdBack.classList.add("open");cmdBack.setAttribute("aria-hidden","false");cmdInput.value="";cmdIndex=0;drawCommands();setTimeout(()=>cmdInput.focus(),20)}
cmdInput.oninput=()=>{cmdIndex=0;drawCommands()};cmdInput.onkeydown=e=>{const items=$$(".command-item");if(e.key==="ArrowDown"){e.preventDefault();cmdIndex=Math.min(cmdIndex+1,items.length-1);drawCommands()}else if(e.key==="ArrowUp"){e.preventDefault();cmdIndex=Math.max(0,cmdIndex-1);drawCommands()}else if(e.key==="Enter"&&items[cmdIndex])items[cmdIndex].click()};
addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();openCommand()}if(e.key==="Escape"){closeMenu();[...$$(".modal-backdrop.open")].forEach(b=>closeModal(b));cmdBack.classList.remove("open");cmdBack.setAttribute("aria-hidden","true");assistant.classList.remove("open") }if((e.key==="ArrowRight"||e.key==="ArrowLeft")&&$("#lightboxBackdrop").classList.contains("open"))moveGallery(e.key==="ArrowRight"?1:-1)});

$("#fabMain").onclick=()=>{$("#fab").classList.toggle("open");$("#fabMain").setAttribute("aria-expanded",String($("#fab").classList.contains("open")))};
$("#backTop").onclick=()=>scrollTo({top:0,behavior:"smooth"});

let touchX=0;$("#lightboxBackdrop").addEventListener("touchstart",e=>touchX=e.changedTouches[0].clientX,{passive:true});$("#lightboxBackdrop").addEventListener("touchend",e=>{const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>50)moveGallery(dx<0?1:-1)},{passive:true});

document.addEventListener("click",e=>{if(e.target.classList.contains("modal-backdrop")&&e.target.classList.contains("open"))closeModal(e.target);if(e.target.classList.contains("command-backdrop")){e.target.classList.remove("open");e.target.setAttribute("aria-hidden","true")}});
})();