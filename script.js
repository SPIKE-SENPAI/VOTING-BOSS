// ======================================
// URL GOOGLE APPS SCRIPT
// ======================================

const API_URL =
    "https://script.google.com/macros/s/AKfycbwQcyiGUnVjIveJ6LEpxF8y7RyryMGUZUz7gVpfbMm1hO0k_cGSYi9BfatPynDCccHB/exec";


// ======================================
// DATA SEMENTARA
// ======================================

let kodePemilih = "";
let kandidatTerpilih = "";


// ======================================
// CEK KODE PEMILIH
// ======================================

async function cekKode() {

    const kodeInput =
        document.getElementById("kode");

    const message =
        document.getElementById("loginMessage");

    const kode =
        kodeInput.value.trim();


    if (!kode) {

        message.textContent =
            "Masukkan kode pemilih.";

        return;
    }


    message.textContent =
        "Memeriksa kode...";


    try {

        const response = await fetch(
            API_URL +
            "?action=check&kode=" +
            encodeURIComponent(kode)
        );


        const data =
            await response.json();


        if (data.status === "success") {

            kodePemilih = kode;

            document
                .getElementById("loginSection")
                .classList.add("hidden");


            document
                .getElementById("votingSection")
                .classList.remove("hidden");


            document
                .getElementById("kodeTampil")
                .textContent = kode;


            loadCandidates();

        } else {

            message.textContent =
                data.message;

        }


    } catch (error) {

        message.textContent =
            "Gagal terhubung ke server.";

        console.error(error);

    }
}


// ======================================
// AMBIL KANDIDAT
// ======================================

async function loadCandidates() {

    const container =
        document.getElementById("candidates");


    container.innerHTML =
        "<p>Memuat pilihan...</p>";


    try {

        const response = await fetch(
            API_URL +
            "?action=candidates"
        );


        const data =
            await response.json();


        if (data.status !== "success") {

            container.innerHTML =
                "<p>Gagal mengambil pilihan.</p>";

            return;
        }


        container.innerHTML = "";


        data.candidates.forEach(candidate => {

            const div =
                document.createElement("div");


            div.className =
                "candidate";


            div.innerHTML = `
                <div class="candidate-title">
                    NAMA ANGKATAN #${candidate.id}
                </div>
            `;


            div.onclick = function () {

                document
                    .querySelectorAll(".candidate")
                    .forEach(el => {
                        el.classList.remove("selected");
                    });


                div.classList.add("selected");


                kandidatTerpilih =
                    candidate.id;


                document
                    .getElementById("voteButton")
                    .disabled = false;
            };


            container.appendChild(div);

        });


    } catch (error) {

        container.innerHTML =
            "<p>Gagal terhubung ke server.</p>";

        console.error(error);

    }
}


// ======================================
// KIRIM VOTE
// ======================================

async function kirimVote() {

    if (!kodePemilih) {
        return;
    }


    if (!kandidatTerpilih) {

        alert(
            "Silakan pilih kandidat terlebih dahulu."
        );

        return;
    }


    const nama =
        document
            .getElementById("nama")
            .value
            .trim();


    const yakin =
        confirm(
            "Apakah kamu yakin dengan pilihanmu?"
        );


    if (!yakin) {
        return;
    }


    const button =
        document.getElementById("voteButton");


    const message =
        document.getElementById("voteMessage");


    button.disabled = true;

    button.textContent =
        "Mengirim...";


    try {

        const response =
            await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type":
                        "text/plain;charset=utf-8"
                },

                body: JSON.stringify({

                    action: "vote",

                    kode: kodePemilih,

                    nama: nama,

                    kandidat_id:
                        kandidatTerpilih

                })

            });


        const data =
            await response.json();


        if (data.status === "success") {

            message.textContent =
                "✓ Voting berhasil!";

            message.style.color =
                "green";


            button.textContent =
                "SUDAH VOTING";


            document
                .querySelectorAll(".candidate")
                .forEach(el => {
                    el.onclick = null;
                });


        } else {

            message.textContent =
                data.message;

            button.disabled = false;

            button.textContent =
                "VOTE";

        }


    } catch (error) {

        message.textContent =
            "Terjadi kesalahan saat mengirim suara.";

        button.disabled = false;

        button.textContent =
            "VOTE";

        console.error(error);

    }
}