// GANTI bagian ini dengan URL Web App Google Apps Script kamu.
const API_URL = "https://script.google.com/macros/s/AKfycbwQcyiGUnVjIveJ6LEpxF8y7RyryMGUZUz7gVpfbMm1hO0k_cGSYi9BfatPynDCccHB/exec";

const nameSearch = document.getElementById("nameSearch");
const searchResults = document.getElementById("searchResults");
const selectedVoterBox = document.getElementById("selectedVoter");
const designSection = document.getElementById("designSection");
const designGrid = document.getElementById("designGrid");
const voteButton = document.getElementById("voteButton");
const message = document.getElementById("message");
const modal = document.getElementById("modal");
const confirmText = document.getElementById("confirmText");

let selectedVoter = null;
let selectedDesign = null;
let searchTimer = null;

nameSearch.addEventListener("input", () => {
  clearTimeout(searchTimer);
  selectedVoter = null;
  selectedDesign = null;
  selectedVoterBox.classList.add("hidden");
  designSection.classList.add("hidden");
  voteButton.disabled = true;
  searchResults.innerHTML = "";

  const q = nameSearch.value.trim();
  if (q.length < 2) return;

  searchTimer = setTimeout(() => searchVoters(q), 250);
});

async function searchVoters(q) {
  searchResults.innerHTML = "<div class='hint'>Mencari...</div>";

  try {
    const res = await fetch(`${API_URL}?action=cari&q=${encodeURIComponent(q)}`);
    const data = await res.json();

    if (!data.success) throw new Error(data.message || "Pencarian gagal.");

    if (!data.voters.length) {
      searchResults.innerHTML = "<div class='hint'>Nama tidak ditemukan.</div>";
      return;
    }

    searchResults.innerHTML = data.voters.map(v => `
      <button class="name-option" data-nama="${escapeAttr(v.nama)}" data-kelas="${escapeAttr(v.kelas)}">
        <strong>${escapeHtml(v.nama)}</strong>
        <span>${escapeHtml(v.kelas)}</span>
      </button>
    `).join("");

    document.querySelectorAll(".name-option").forEach(btn => {
      btn.addEventListener("click", () => {
        selectedVoter = {
          nama: btn.dataset.nama,
          kelas: btn.dataset.kelas
        };
        nameSearch.value = selectedVoter.nama;
        searchResults.innerHTML = "";
        selectedVoterBox.textContent =
          `✓ ${selectedVoter.nama} — ${selectedVoter.kelas}`;
        selectedVoterBox.classList.remove("hidden");
        loadDesigns();
      });
    });
  } catch (err) {
    searchResults.innerHTML = `<div class="error">${escapeHtml(err.message)}</div>`;
  }
}

async function loadDesigns() {
  designSection.classList.remove("hidden");
  designGrid.innerHTML = "<div class='hint'>Memuat desain...</div>";

  try {
    const res = await fetch(`${API_URL}?action=desain`);
    const data = await res.json();

    if (!data.success) throw new Error(data.message || "Gagal memuat desain.");

    designGrid.innerHTML = data.designs.map(d => `
      <article class="design-card" data-id="${escapeAttr(d.id)}" data-name="${escapeAttr(d.nama)}">
        <img class="design-image" src="${escapeAttr(d.gambar)}" alt="${escapeAttr(d.nama)}"
             onerror="this.src='images/placeholder.svg'">
        <div class="design-info">
          <strong>${escapeHtml(d.nama)}</strong>
          <span>Klik untuk memilih</span>
        </div>
      </article>
    `).join("");

    document.querySelectorAll(".design-card").forEach(card => {
      card.addEventListener("click", () => {
        document.querySelectorAll(".design-card").forEach(x => x.classList.remove("selected"));
        card.classList.add("selected");
        selectedDesign = {
          id: card.dataset.id,
          nama: card.dataset.name
        };
        voteButton.disabled = false;
      });
    });
  } catch (err) {
    designGrid.innerHTML = `<div class="error">${escapeHtml(err.message)}</div>`;
  }
}

voteButton.addEventListener("click", () => {
  if (!selectedVoter || !selectedDesign) return;

  confirmText.textContent =
    `Kamu akan memilih ${selectedDesign.nama}. Pastikan pilihanmu sudah benar karena suara hanya dapat diberikan satu kali.`;
  modal.classList.remove("hidden");
});

document.getElementById("cancelButton").addEventListener("click", () => {
  modal.classList.add("hidden");
});

document.getElementById("confirmButton").addEventListener("click", submitVote);

async function submitVote() {
  modal.classList.add("hidden");
  voteButton.disabled = true;
  message.className = "message";
  message.textContent = "Mengirim suara...";

  // URLSearchParams sengaja dipakai agar tidak memicu CORS preflight.
  const body = new URLSearchParams({
    action: "vote",
    nama: selectedVoter.nama,
    kelas: selectedVoter.kelas,
    desain_id: selectedDesign.id
  });

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body
    });

    const data = await res.json();

    if (!data.success) throw new Error(data.message || "Gagal menyimpan suara.");

    message.className = "message success";
    message.textContent = "✓ Suara berhasil dicatat. Terima kasih!";
    nameSearch.disabled = true;
    designSection.classList.add("hidden");
    selectedVoterBox.classList.add("hidden");
    searchResults.innerHTML = "";
  } catch (err) {
    message.className = "message error";
    message.textContent = err.message;
    voteButton.disabled = false;
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[c]));
}

function escapeAttr(value) {
  return escapeHtml(value);
}
