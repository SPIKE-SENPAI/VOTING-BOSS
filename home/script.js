const nav = document.querySelector(".navbar");
const menu = document.querySelector(".menu");
const links = document.querySelectorAll("nav a");
const progress = document.querySelector(".progress");

menu?.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  document.querySelector(".navbar nav").classList.toggle("open", open);
  menu.setAttribute("aria-expanded", String(open));
});
links.forEach(a => a.addEventListener("click", () => {
  menu?.classList.remove("open");
  document.querySelector(".navbar nav")?.classList.remove("open");
  menu?.setAttribute("aria-expanded","false");
}));

function updateScrollUI(){
  nav?.classList.toggle("scrolled", window.scrollY > 12);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = max > 0 ? `${(window.scrollY / max) * 100}%` : "0%";
}
window.addEventListener("scroll", updateScrollUI, {passive:true});
updateScrollUI();

const observer = new IntersectionObserver((entries)=>{
  entries.forEach((entry)=>{
    if(entry.isIntersecting){
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
},{threshold:.1});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener("click",(e)=>{
    const target=document.querySelector(a.getAttribute("href"));
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior:"smooth",block:"start"});
    }
  });
});


const sectionMembers = {
  kesekretariatan: ["Anti Diah Utami", "Chatya Nur Annahari", "Fatiah Kirana", "Itsna Mar'atus Sholihah", "Langit Ramadhani Sutrisno Putri", "Sakinah Rafifah  Hasanah", "Siren Khafifah Arrahman", "Yayan", "Zazkia Faustine Hery", "Aldan Maulana", "M. Fatikhurrizki", "M. Cholid Al-Farich", "Faiq Fairussani Noriz", "Rijal Nur Faizin", "Naja Misbahul Munir"],
  dokumentasi: ["Ayu Rahmania", "Fien Sa'adatu Nayla", "Khilyatun Nawa Al-islah", "Lita Aprilia Safitri", "Nabila Khoirunnisa", "Zakkya Maulin", "Farid Irsyadi", "M. Ali Mahfuzi", "Fiqh Cahyono", "M. Fatih Izzul Hikam", "Abrisam Abbasi A.", "Wahyu Nur Hidayat"],
  perlengkapan: ["Agesya Alifatil Chasanah", "Dhini Ramadani", "Dwi Safitri", "Fina Damara Elusia", "Kaffa Nur Mazidah", "Nihayatur Rizqi", "Syarifah Hanun Azzahra", "Masmu'nida", "Razid Adnan Alfarizi", "Alfitrasalam", "Arkan Tsakib", "M.Khusnul Adib M."],
  konsumsi: ["Andin Naila Azkia", "Farikhatussholikhah", "Fathin Farsani", "Faza Nifana Sofa", "Kusuma Diana Hapsari", "Marchelia Novita Sari", "Nawang Lulu Zam Zami", "M. Budi Musyaffaq", "Ibrahim Nauval Z.", "Gufron Da'i Saputra", "Azzam Almas S. J.", "M. Arfan Alfarizi"],
  keamanan: ["Hasna Masfufah", "Hikmatul Illahiyah", "Hilwa Maulidiya Rahmatika", "Khansa Cantika Al-latifah", "Lulu Izatul Ilma", "Nabila Adhwa", "Nur Rizki", "Mulkan Zamrotul Fuad", "Jaron Putra Aditya", "Mahaldico Fadhil A.", "M. Zufi Dylan Firdaus", "Ahmad Faiz Al-Ghifari", "M. Mafkhul Khobir", "M. Zakiya Sa'id"],
  humas: ["Azka Layly Khaq", "Rashifatul Chusna", "Khansa Khairana", "Maghfirotur Rohmah", "Ririn Nopia Lestari", "Salasa Khusna", "Zulfa Diatama", "M. Irhas Anandiawan", "Zidni Ula", "Nazal Faiqoh Wijiatmoko", "Hilmansyah Arrofudin M."],
  acara: ["Asyifatun Nur Aini", "Qaisya Nur Aulia", "Risma Isnaini Sholehah", "Syifa' Ajwah Al-madani", "Tara Mei Liana", "Ulya Siana", "Wafa Yuna Nurani", "Lintang Akbar Ibrahim", "M. Nur Alim", "Halilintar Putra A.", "M. Mutawakkil Alallah", "M. Syauqilah Yusuf"]
};
const memberPopover=document.querySelector("#memberPopover"), memberTitle=document.querySelector("#memberTitle"), memberList=document.querySelector("#memberList");
const divisionButtons=document.querySelectorAll(".division[data-section]");
function closeMembers(){memberPopover?.classList.remove("show");memberPopover?.setAttribute("aria-hidden","true");document.body.classList.remove("modal-open");divisionButtons.forEach(b=>b.setAttribute("aria-expanded","false"));}
function openMembers(button){const key=button.dataset.section, members=sectionMembers[key]||[]; memberTitle.textContent=button.querySelector("h3")?.textContent.trim()||"Anggota Seksi"; memberList.innerHTML=""; members.forEach((name,i)=>{const li=document.createElement("li");li.innerHTML=`<span>${String(i+1).padStart(2,"0")}</span><strong></strong>`;li.querySelector("strong").textContent=name;memberList.appendChild(li)}); divisionButtons.forEach(b=>b.setAttribute("aria-expanded","false"));button.setAttribute("aria-expanded","true");memberPopover.classList.add("show");memberPopover.setAttribute("aria-hidden","false");document.body.classList.add("modal-open");}
divisionButtons.forEach(b=>b.addEventListener("click",()=>openMembers(b)));document.querySelectorAll("[data-close-members]").forEach(e=>e.addEventListener("click",closeMembers));document.addEventListener("keydown",e=>{if(e.key==="Escape"&&memberPopover?.classList.contains("show"))closeMembers();});
