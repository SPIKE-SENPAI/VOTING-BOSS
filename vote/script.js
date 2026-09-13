// HALAMAN HASIL AKHIR — voting ditutup dari sisi tampilan.
// Code.gs sengaja tidak diubah.
const API_URL = "https://script.google.com/macros/s/AKfycbwQcyiGUnVjIveJ6LEpxF8y7RyryMGUZUz7gVpfbMm1hO0k_cGSYi9BfatPynDCccHB/exec";

const winnerCard = document.getElementById("winnerCard");
const winnerImage = document.getElementById("winnerImage");
const winnerFallback = document.getElementById("winnerFallback");
const winnerName = document.getElementById("winnerName");
const winnerVotes = document.getElementById("winnerVotes");
const winnerPercent = document.getElementById("winnerPercent");
const loading = document.getElementById("loading");
const errorBox = document.getElementById("errorBox");
const errorText = document.getElementById("errorText");

async function loadWinner() {
  try {
    const [resultResponse, designResponse] = await Promise.all([
      fetch(`${API_URL}?action=hasil`),
      fetch(`${API_URL}?action=desain`)
    ]);
    const resultData = await resultResponse.json();
    const designData = await designResponse.json();
    if (!resultData.success) throw new Error(resultData.message || "Gagal memuat hasil voting.");
    if (!designData.success) throw new Error(designData.message || "Gagal memuat data desain.");
    if (!resultData.results || !resultData.results.length) throw new Error("Belum ada hasil voting.");

    // Code.gs mengurutkan hasil dari suara terbanyak ke paling sedikit.
    const winner = resultData.results[0];
    const design = designData.designs.find(item => String(item.id) === String(winner.id));

    winnerName.textContent = winner.nama;
    winnerVotes.textContent = winner.suara;
    winnerPercent.textContent = `${winner.persen}%`;

    if (design && design.gambar) {
      winnerImage.src = design.gambar;
      winnerImage.alt = `Desain pemenang: ${winner.nama}`;
      winnerImage.onload = () => {
        winnerImage.style.display = "block";
        winnerFallback.classList.add("hidden");
      };
      winnerImage.onerror = showImageFallback;
    } else showImageFallback();

    loading.classList.add("hidden");
    winnerCard.classList.add("ready");
  } catch (err) {
    loading.classList.add("hidden");
    winnerCard.classList.add("hidden");
    errorText.textContent = err.message;
    errorBox.classList.remove("hidden");
  }
}

function showImageFallback() {
  winnerImage.style.display = "none";
  winnerFallback.classList.remove("hidden");
}

loadWinner();
