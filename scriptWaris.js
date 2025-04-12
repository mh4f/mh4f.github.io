// --- Konfigurasi Wizard ---
const steps = document.querySelectorAll(".form-step");
const progressBar = document.querySelector(".progress-bar");
const form = document.getElementById("formWarisWizard");
const hasilKalkulasiDiv = document.getElementById("hasilKalkulasi");
const detailPembagianPre = document.getElementById("detailPembagian");

// Referensi ke input utama (yg mempengaruhi kondisi lain) - lebih selektif
const inputAnakLaki = document.getElementById("jumlahAnakLaki");
const inputCucuLaki = document.getElementById("jumlahCucuLaki");
const inputAdaBapak = document.getElementById("adaBapak");
const inputAdaKakek = document.getElementById("adaKakek");
const inputAdaIbu = document.getElementById("adaIbu");
const inputSdrLakiKandung = document.getElementById("jumlahSaudaraLakiKandung");
const inputSdrLakiBapak = document.getElementById("jumlahSaudaraLakiBapak");
const inputKeponakanLakiKandung = document.getElementById("jumlahKeponakanLakiKandung");
const inputKeponakanLakiBapak = document.getElementById("jumlahKeponakanLakiBapak");
const inputPamanKandung = document.getElementById("jumlahPamanKandung");
const inputPamanBapak = document.getElementById("jumlahPamanBapak");
const inputSepupuLakiKandung = document.getElementById("jumlahSepupuLakiKandung");
const inputJenisPasangan = document.getElementById("jenisPasangan");
// Tambahkan input lain yang relevan jika diperlukan untuk kondisi yang lebih kompleks

// Referensi ke SEMUA group kondisional agar mudah diakses
const conditionalGroups = document.querySelectorAll(".conditional-group");

let currentStep = 1;
const totalSteps = steps.length; // 13 langkah
// Inisialisasi formData
let formData = {
    jumlahAnakLaki: 0,
    jumlahAnakPerempuan: 0,
    jumlahCucuLaki: 0,
    jumlahCucuPerempuan: 0,
    adaBapak: "tidak",
    adaKakek: "tidak",
    adaIbu: "tidak",
    adaNenekIbu: "tidak",
    adaNenekAyah: "tidak",
    jenisPasangan: "tidak",
    jumlahIstri: 0,
    jumlahSaudaraLakiKandung: 0,
    jumlahSaudaraPerempuanKandung: 0,
    jumlahSaudaraLakiBapak: 0,
    jumlahSaudaraPerempuanBapak: 0,
    jumlahSaudaraLakiIbu: 0,
    jumlahSaudaraPerempuanIbu: 0,
    jumlahKeponakanLakiKandung: 0,
    jumlahKeponakanLakiBapak: 0,
    jumlahPamanKandung: 0,
    jumlahPamanBapak: 0,
    jumlahSepupuLakiKandung: 0,
    jumlahSepupuLakiBapak: 0,
    totalHarta: 0,
    biayaPengurusan: 0,
    totalHutang: 0,
    wasiat: 0,
};

// Helper untuk toggle class visibility pada conditional group
function setGroupVisibility(groupElement, shouldBeVisible) {
    if (!groupElement) return;
    const isVisible = groupElement.classList.contains("visible");
    if (shouldBeVisible && !isVisible) {
        groupElement.style.display = "block"; // Ensure display is block before animating
        setTimeout(() => {
            groupElement.classList.add("visible");
        }, 10); // Small delay for transition
    } else if (!shouldBeVisible && isVisible) {
        groupElement.classList.remove("visible");
        // Optional: set display none after transition if needed, but max-height 0 usually suffices
        // groupElement.addEventListener('transitionend', () => {
        //     if (!groupElement.classList.contains('visible')) {
        //          groupElement.style.display = 'none';
        //     }
        // }, { once: true });
    }
}

// --- Fungsi Kondisi untuk Show Field & Reset Data ---
// Fungsi ini dipanggil setiap kali ada perubahan atau pindah step
function checkAndResetConditions() {
    // 1. Ambil data terbaru langsung dari form (lebih reliable saat change event)
    const currentData = {};
    const formInputs = form.querySelectorAll("input, select");
    formInputs.forEach((input) => {
        if (input.name) {
            if (input.type === "number") currentData[input.name] = parseInt(input.value) || 0;
            else if (input.type === "radio" || input.type === "checkbox")
                currentData[input.name] = input.checked; // Jika ada radio/checkbox
            else currentData[input.name] = input.value;
        }
    });
    // Pastikan data default jika elemen tidak ada (misal, saat hidden)
    Object.keys(formData).forEach((key) => {
        if (currentData[key] === undefined) {
            currentData[key] = formData[key]; // Ambil dari state lama jika tidak ada di form
        }
    });

    // 2. Tentukan kondisi berdasarkan data terbaru
    const c = currentData; // Alias
    const adaAnakLaki = c.jumlahAnakLaki > 0;
    const adaCucuLaki = !adaAnakLaki && c.jumlahCucuLaki > 0;
    const adaBapakHidup = c.adaBapak === "ya";
    const adaKakekHidup = !adaBapakHidup && c.adaKakek === "ya";
    const adaIbuHidup = c.adaIbu === "ya";

    const adaFuruWarits = adaAnakLaki || c.jumlahAnakPerempuan > 0 || adaCucuLaki || c.jumlahCucuPerempuan > 0;
    const adaFuruWaritsLaki = adaAnakLaki || adaCucuLaki;
    const adaUsulWaritsLaki = adaBapakHidup || adaKakekHidup;

    // 3. Atur visibilitas dan reset data jika perlu
    // Kakek & Nenek
    setGroupVisibility(document.getElementById("kakekGroup"), !adaBapakHidup);
    if (adaBapakHidup && document.getElementById("adaKakek")) document.getElementById("adaKakek").value = "tidak";
    setGroupVisibility(document.getElementById("nenekIbuGroup"), !adaIbuHidup);
    if (adaIbuHidup && document.getElementById("adaNenekIbu")) document.getElementById("adaNenekIbu").value = "tidak";
    setGroupVisibility(document.getElementById("nenekAyahGroup"), !adaIbuHidup);
    if (adaIbuHidup && document.getElementById("adaNenekAyah")) document.getElementById("adaNenekAyah").value = "tidak";

    // Cucu
    const showCucu = !adaAnakLaki;
    setGroupVisibility(document.getElementById("cucuLakiGroup"), showCucu);
    setGroupVisibility(document.getElementById("cucuPerempuanGroup"), showCucu);
    if (!showCucu) {
        if (document.getElementById("jumlahCucuLaki")) document.getElementById("jumlahCucuLaki").value = 0;
        if (document.getElementById("jumlahCucuPerempuan")) document.getElementById("jumlahCucuPerempuan").value = 0;
    }

    // Saudara Kandung
    const showSdrKandung = !adaFuruWaritsLaki && !adaUsulWaritsLaki;
    setGroupVisibility(document.getElementById("saudaraKandungLakiGroup"), showSdrKandung);
    setGroupVisibility(document.getElementById("saudaraKandungPerempuanGroup"), showSdrKandung);
    if (!showSdrKandung) {
        if (document.getElementById("jumlahSaudaraLakiKandung")) document.getElementById("jumlahSaudaraLakiKandung").value = 0;
        if (document.getElementById("jumlahSaudaraPerempuanKandung")) document.getElementById("jumlahSaudaraPerempuanKandung").value = 0;
    }
    const adaSdrLakiKandungHidup = showSdrKandung && c.jumlahSaudaraLakiKandung > 0;

    // Saudara Sebapak
    const showSdrBapak = showSdrKandung && !adaSdrLakiKandungHidup;
    setGroupVisibility(document.getElementById("saudaraBapakLakiGroup"), showSdrBapak);
    setGroupVisibility(document.getElementById("saudaraBapakPerempuanGroup"), showSdrBapak);
    if (!showSdrBapak) {
        if (document.getElementById("jumlahSaudaraLakiBapak")) document.getElementById("jumlahSaudaraLakiBapak").value = 0;
        if (document.getElementById("jumlahSaudaraPerempuanBapak")) document.getElementById("jumlahSaudaraPerempuanBapak").value = 0;
    }
    const adaSdrLakiBapakHidup = showSdrBapak && c.jumlahSaudaraLakiBapak > 0;

    // Saudara Seibu
    const showSdrIbu = !adaFuruWarits && !adaUsulWaritsLaki;
    setGroupVisibility(document.getElementById("saudaraIbuLakiGroup"), showSdrIbu);
    setGroupVisibility(document.getElementById("saudaraIbuPerempuanGroup"), showSdrIbu);
    if (!showSdrIbu) {
        if (document.getElementById("jumlahSaudaraLakiIbu")) document.getElementById("jumlahSaudaraLakiIbu").value = 0;
        if (document.getElementById("jumlahSaudaraPerempuanIbu")) document.getElementById("jumlahSaudaraPerempuanIbu").value = 0;
    }

    // Keponakan Kandung
    const showKeponakanKandung = showSdrBapak && !adaSdrLakiBapakHidup;
    setGroupVisibility(document.getElementById("keponakanKandungGroup"), showKeponakanKandung);
    if (!showKeponakanKandung && document.getElementById("jumlahKeponakanLakiKandung"))
        document.getElementById("jumlahKeponakanLakiKandung").value = 0;
    const adaKeponakanKandungHidup = showKeponakanKandung && c.jumlahKeponakanLakiKandung > 0;

    // Keponakan Sebapak
    const showKeponakanBapak = showKeponakanKandung && !adaKeponakanKandungHidup;
    setGroupVisibility(document.getElementById("keponakanBapakGroup"), showKeponakanBapak);
    if (!showKeponakanBapak && document.getElementById("jumlahKeponakanLakiBapak"))
        document.getElementById("jumlahKeponakanLakiBapak").value = 0;
    const adaKeponakanBapakHidup = showKeponakanBapak && c.jumlahKeponakanLakiBapak > 0;

    // Paman Kandung
    const showPamanKandung = showKeponakanBapak && !adaKeponakanBapakHidup;
    setGroupVisibility(document.getElementById("pamanKandungGroup"), showPamanKandung);
    if (!showPamanKandung && document.getElementById("jumlahPamanKandung")) document.getElementById("jumlahPamanKandung").value = 0;
    const adaPamanKandungHidup = showPamanKandung && c.jumlahPamanKandung > 0;

    // Paman Sebapak
    const showPamanBapak = showPamanKandung && !adaPamanKandungHidup;
    setGroupVisibility(document.getElementById("pamanBapakGroup"), showPamanBapak);
    if (!showPamanBapak && document.getElementById("jumlahPamanBapak")) document.getElementById("jumlahPamanBapak").value = 0;
    const adaPamanBapakHidup = showPamanBapak && c.jumlahPamanBapak > 0;

    // Sepupu Kandung
    const showSepupuKandung = showPamanBapak && !adaPamanBapakHidup;
    setGroupVisibility(document.getElementById("sepupuKandungGroup"), showSepupuKandung);
    if (!showSepupuKandung && document.getElementById("jumlahSepupuLakiKandung"))
        document.getElementById("jumlahSepupuLakiKandung").value = 0;
    const adaSepupuKandungHidup = showSepupuKandung && c.jumlahSepupuLakiKandung > 0;

    // Sepupu Sebapak
    const showSepupuBapak = showSepupuKandung && !adaSepupuKandungHidup;
    setGroupVisibility(document.getElementById("sepupuBapakGroup"), showSepupuBapak);
    if (!showSepupuBapak && document.getElementById("jumlahSepupuLakiBapak")) document.getElementById("jumlahSepupuLakiBapak").value = 0;

    // Jumlah Istri
    const showJumlahIstri = c.jenisPasangan === "istri";
    setGroupVisibility(document.getElementById("jumlahIstriGroup"), showJumlahIstri);
    const jumlahIstriInput = document.getElementById("jumlahIstri");
    if (!showJumlahIstri && jumlahIstriInput) jumlahIstriInput.value = 1; // Reset ke 1 jika disembunyikan
    if (jumlahIstriInput) jumlahIstriInput.required = showJumlahIstri;

    // 4. Simpan state terakhir ke formData global setelah update
    saveStepData();
}

// Cek apakah suatu step HARUS ditampilkan (bukan hanya field di dalamnya)
function shouldShowStepOverall(stepNumber) {
    // Gunakan data TERSIMPAN (formData) untuk konsistensi antar step
    const c = formData;

    // Kondisi dasar penghalang (sama seperti di checkAndResetConditions)
    const adaAnakLaki = c.jumlahAnakLaki > 0;
    const adaCucuLaki = !adaAnakLaki && c.jumlahCucuLaki > 0;
    const adaBapakHidup = c.adaBapak === "ya";
    const adaKakekHidup = !adaBapakHidup && c.adaKakek === "ya";
    const adaFuruWarits = adaAnakLaki || c.jumlahAnakPerempuan > 0 || adaCucuLaki || c.jumlahCucuPerempuan > 0;
    const adaFuruWaritsLaki = adaAnakLaki || adaCucuLaki;
    const adaUsulWaritsLaki = adaBapakHidup || adaKakekHidup;

    switch (stepNumber) {
        case 3:
            return !adaAnakLaki; // Cucu
        case 7:
            return !adaFuruWaritsLaki && !adaUsulWaritsLaki; // Sdr Kandung
        case 8:
            return shouldShowStepOverall(7) && !(c.jumlahSaudaraLakiKandung > 0); // Sdr Bapak
        case 9:
            return !adaFuruWarits && !adaUsulWaritsLaki; // Sdr Ibu
        case 10: // Keponakan
            return shouldShowStepOverall(8) && !(c.jumlahSaudaraLakiBapak > 0);
        case 11: // Paman
            return shouldShowStepOverall(10) && !(c.jumlahKeponakanLakiKandung > 0) && !(c.jumlahKeponakanLakiBapak > 0);
        case 12: // Sepupu
            return shouldShowStepOverall(11) && !(c.jumlahPamanKandung > 0) && !(c.jumlahPamanBapak > 0);
        default:
            return true; // Step 1, 2, 4, 5, 6, 13 selalu tampil strukturnya
    }
}

// --- Fungsi Navigasi Baru ---
function findNextStep(current) {
    saveStepData(); // Pastikan data terbaru sebelum mencari
    let next = current + 1;
    while (next <= totalSteps) {
        if (shouldShowStepOverall(next)) {
            return next;
        }
        next++;
    }
    return current; // Return current if no next step is valid
}

function findPrevStep(current) {
    saveStepData(); // Pastikan data terbaru sebelum mencari
    let prev = current - 1;
    while (prev >= 1) {
        if (shouldShowStepOverall(prev)) {
            return prev;
        }
        prev--;
    }
    return current; // Return current if no previous step is valid
}

// --- Fungsi Bantu Lainnya ---
function updateProgressBar() {
    const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
    const percentage = Math.round(progress) + "%";
    progressBar.style.width = percentage;
    progressBar.setAttribute("aria-valuenow", progress);
    progressBar.setAttribute("data-progress-text", percentage);
}

function showStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > totalSteps) return;

    const currentActiveStep = document.querySelector(".form-step.active");
    const nextStepElement = document.getElementById(`step-${stepNumber}`);

    if (!nextStepElement) {
        console.error("Step element not found:", stepNumber);
        return;
    }

    // Sembunyikan area hasil jika pindah dari step terakhir
    if (currentActiveStep && currentActiveStep.id === `step-${totalSteps}` && stepNumber !== totalSteps) {
        hasilKalkulasiDiv.style.display = "none";
    }
    // Sembunyikan juga jika memuat step BUKAN terakhir
    if (stepNumber !== totalSteps) {
        hasilKalkulasiDiv.style.display = "none";
    }

    if (currentActiveStep && currentActiveStep !== nextStepElement) {
        currentActiveStep.classList.add("exiting");
        currentActiveStep.addEventListener(
            "animationend",
            () => {
                if (currentActiveStep.classList.contains("exiting")) {
                    currentActiveStep.classList.remove("active", "exiting");
                    currentActiveStep.style.display = "none"; // Sembunyikan setelah animasi
                }
            },
            { once: true }
        );
    }

    setTimeout(
        () => {
            nextStepElement.style.display = "block";
            void nextStepElement.offsetWidth; // Reflow
            nextStepElement.classList.add("active");
            currentStep = stepNumber;
            updateProgressBar();
            checkAndResetConditions(); // Update visibility & reset data field dalam step ini

            // Update tombol previous
            const prevButton = nextStepElement.querySelector(".prev-btn");
            if (prevButton) {
                const firstOverallValidStep = findNextStep(0);
                prevButton.disabled = stepNumber <= firstOverallValidStep;
            }
            // Update tombol next
            const nextButton = nextStepElement.querySelector(".next-btn");
            if (nextButton) {
                const nextValidStep = findNextStep(stepNumber);
                nextButton.disabled = nextValidStep === stepNumber;
            }
        },
        currentActiveStep && currentActiveStep !== nextStepElement ? 150 : 0
    ); // Delay jika ada animasi keluar
}

function validateStep(stepNumber) {
    // Validasi sama
    const stepElement = document.getElementById(`step-${stepNumber}`);
    if (!stepElement || !stepElement.classList.contains("active")) return true;
    const inputs = stepElement.querySelectorAll("input[required], select[required]");
    let isValid = true;
    inputs.forEach((input) => {
        let parentGroup = input.closest(".conditional-group");
        let isVisible = !parentGroup || parentGroup.classList.contains("visible");
        if (isVisible) {
            if (
                !input.value ||
                (input.type === "number" && parseFloat(input.value) < parseFloat(input.min)) ||
                (input.type === "select-one" && !input.value)
            ) {
                input.classList.add("is-invalid");
                isValid = false;
            } else {
                input.classList.remove("is-invalid");
            }
        } else {
            input.classList.remove("is-invalid");
        }
    });
    if (!isValid) {
        alert("Mohon isi semua field yang wajib di langkah ini.");
    }
    return isValid;
}

function saveStepData() {
    // Fungsi save data diperbarui untuk semua field baru
    formData.jumlahAnakLaki = parseInt(inputAnakLaki?.value) || 0;
    formData.jumlahAnakPerempuan = parseInt(document.getElementById("jumlahAnakPerempuan")?.value) || 0;
    formData.adaBapak = inputAdaBapak?.value ?? "tidak";
    formData.adaIbu = inputAdaIbu?.value ?? "tidak";
    formData.jenisPasangan = inputJenisPasangan?.value ?? "tidak";
    formData.totalHarta = parseFloat(document.getElementById("totalHarta")?.value) || 0;
    formData.biayaPengurusan = parseFloat(document.getElementById("biayaPengurusan")?.value) || 0;
    formData.totalHutang = parseFloat(document.getElementById("totalHutang")?.value) || 0;
    formData.wasiat = parseFloat(document.getElementById("wasiat")?.value) || 0;

    // Conditional fields (gunakan visibility class)
    formData.jumlahCucuLaki = document.getElementById("cucuLakiGroup")?.classList.contains("visible")
        ? parseInt(inputCucuLaki?.value) || 0
        : 0;
    formData.jumlahCucuPerempuan = document.getElementById("cucuPerempuanGroup")?.classList.contains("visible")
        ? parseInt(document.getElementById("jumlahCucuPerempuan")?.value) || 0
        : 0;
    formData.adaKakek = document.getElementById("kakekGroup")?.classList.contains("visible") ? inputAdaKakek?.value ?? "tidak" : "tidak";
    formData.adaNenekIbu = document.getElementById("nenekIbuGroup")?.classList.contains("visible")
        ? document.getElementById("adaNenekIbu")?.value ?? "tidak"
        : "tidak";
    formData.adaNenekAyah = document.getElementById("nenekAyahGroup")?.classList.contains("visible")
        ? document.getElementById("adaNenekAyah")?.value ?? "tidak"
        : "tidak";
    formData.jumlahIstri = document.getElementById("jumlahIstriGroup")?.classList.contains("visible")
        ? parseInt(document.getElementById("jumlahIstri")?.value) || 1
        : 0;

    formData.jumlahSaudaraLakiKandung = document.getElementById("s")?.classList.contains("visible")
        ? parseInt(inputSdrLakiKandung?.value) || 0
        : 0;
    formData.jumlahSaudaraPerempuanKandung = document.getElementById("saudaraKandungPerempuanGroup")?.classList.contains("visible")
        ? parseInt(document.getElementById("jumlahSaudaraPerempuanKandung")?.value) || 0
        : 0;
    formData.jumlahSaudaraLakiBapak = document.getElementById("saudaraBapakLakiGroup")?.classList.contains("visible")
        ? parseInt(inputSdrLakiBapak?.value) || 0
        : 0;
    formData.jumlahSaudaraPerempuanBapak = document.getElementById("saudaraBapakPerempuanGroup")?.classList.contains("visible")
        ? parseInt(document.getElementById("jumlahSaudaraPerempuanBapak")?.value) || 0
        : 0;
    formData.jumlahSaudaraLakiIbu = document.getElementById("saudaraIbuLakiGroup")?.classList.contains("visible")
        ? parseInt(document.getElementById("jumlahSaudaraLakiIbu")?.value) || 0
        : 0;
    formData.jumlahSaudaraPerempuanIbu = document.getElementById("saudaraIbuPerempuanGroup")?.classList.contains("visible")
        ? parseInt(document.getElementById("jumlahSaudaraPerempuanIbu")?.value) || 0
        : 0;

    formData.jumlahKeponakanLakiKandung = document.getElementById("keponakanKandungGroup")?.classList.contains("visible")
        ? parseInt(inputKeponakanLakiKandung?.value) || 0
        : 0;
    formData.jumlahKeponakanLakiBapak = document.getElementById("keponakanBapakGroup")?.classList.contains("visible")
        ? parseInt(inputKeponakanLakiBapak?.value) || 0
        : 0;
    formData.jumlahPamanKandung = document.getElementById("pamanKandungGroup")?.classList.contains("visible")
        ? parseInt(inputPamanKandung?.value) || 0
        : 0;
    formData.jumlahPamanBapak = document.getElementById("pamanBapakGroup")?.classList.contains("visible")
        ? parseInt(inputPamanBapak?.value) || 0
        : 0;
    formData.jumlahSepupuLakiKandung = document.getElementById("sepupuKandungGroup")?.classList.contains("visible")
        ? parseInt(inputSepupuLakiKandung?.value) || 0
        : 0;
    formData.jumlahSepupuLakiBapak = document.getElementById("sepupuBapakGroup")?.classList.contains("visible")
        ? parseInt(document.getElementById("jumlahSepupuLakiBapak")?.value) || 0
        : 0;
    // console.log("Data Tersimpan:", JSON.stringify(formData));
    formData.jumlahSaudara =
        formData.jumlahSaudaraLakiKandung +
        formData.jumlahSaudaraLakiBapak +
        formData.jumlahSaudaraLakiIbu +
        formData.jumlahSaudaraPerempuanKandung +
        formData.jumlahSaudaraPerempuanBapak +
        formData.jumlahSaudaraPerempuanIbu;
}

// --- Event Listeners ---
// Tombol "Berikutnya"
document.querySelectorAll(".next-btn").forEach((button) => {
    button.addEventListener("click", () => {
        if (validateStep(currentStep)) {
            saveStepData();
            const nextStepNumber = findNextStep(currentStep);
            if (nextStepNumber > currentStep) {
                showStep(nextStepNumber);
            } else {
                console.log("Sudah di langkah terakhir yang valid.");
            }
        }
    });
});

// Tombol "Sebelumnya"
document.querySelectorAll(".prev-btn").forEach((button) => {
    button.addEventListener("click", () => {
        saveStepData();
        const prevStepNumber = findPrevStep(currentStep);
        if (prevStepNumber < currentStep) {
            showStep(prevStepNumber);
        } else {
            console.log("Sudah di langkah pertama yang valid.");
        }
    });
});

// Listener untuk Input yang Mempengaruhi Kondisi
const conditionalTriggers = [
    /* ... daftar input sama seperti sebelumnya ... */ inputAnakLaki,
    inputCucuLaki,
    inputAdaBapak,
    inputAdaKakek,
    inputAdaIbu,
    inputSdrLakiKandung,
    inputSdrLakiBapak,
    inputKeponakanLakiKandung,
    inputKeponakanLakiBapak,
    inputPamanKandung,
    inputPamanBapak,
    inputSepupuLakiKandung,
    inputJenisPasangan,
];
conditionalTriggers.forEach((input) => {
    if (input) {
        input.addEventListener("change", () => {
            // Panggil checkAndResetConditions yg sudah termasuk saveStepData di dalamnya
            checkAndResetConditions();
        });
    } else {
        console.warn("Optional input element not found for listener.");
    }
});

// Form Submission
form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (validateStep(currentStep)) {
        saveStepData();

        // Validasi Kewajiban & Hitung Harta Netto
        const hartaSetelahKewajiban = formData.totalHarta - formData.biayaPengurusan - formData.totalHutang;
        if (hartaSetelahKewajiban < 0) {
            alert("Harta tidak cukup untuk biaya jenazah dan hutang.");
            hasilKalkulasiDiv.style.display = "none";
            return;
        }
        const maksimalWasiat = Math.max(0, hartaSetelahKewajiban / 3);
        let wasiatValid = Math.max(0, formData.wasiat);
        if (wasiatValid > maksimalWasiat) {
            alert(
                `Wasiat (Rp ${formatRupiah(wasiatValid)}) melebihi batas maksimal (Rp ${formatRupiah(maksimalWasiat)}). Wasiat disesuaikan.`
            );
            wasiatValid = maksimalWasiat;
            const wi = document.getElementById("wasiat");
            if (wi) wi.value = wasiatValid;
            formData.wasiat = wasiatValid;
        } else {
            formData.wasiat = wasiatValid;
        }
        const hartaNetto = hartaSetelahKewajiban - wasiatValid;
        if (hartaNetto < 0) {
            alert("Terjadi kesalahan, harta netto negatif setelah wasiat.");
            hasilKalkulasiDiv.style.display = "none";
            return;
        }

        // ==============================================================
        // === TEMPATKAN MEKANISME PERHITUNGAN FARAID ANDA DI SINI ===
        // ==============================================================
        // Gunakan: `formData` dan `hartaNetto`

        const Perhitungan = (formData, hartaNetto) => {
            Warisan = {
                ["1 Anak Laki Laki"]: 0,
                ["1 Anak Perempuan"]: 0,
                ["1 Cucu Laki Laki"]: 0,
                ["1 Cucu Perempuan"]: 0,
                Bapak: 0,
                Ibu: 0,
                Kakek: 0,
                Nenek: 0,
                ["1 Pasangan"]: 0,
                ["1 Saudara Kandung"]: 0,
                ["1 Saudari Kandung"]: 0,
                ["1 Saudara Sebapak"]: 0,
                ["1 Saudari Sebapak"]: 0,
                ["1 Saudara Seibu"]: 0,
                ["1 Saudari Seibu"]: 0,
                ["1 Anak Saudara Kandung"]: 0,
                ["1 Anak Saudara Sebapak"]: 0,
                ["1 Paman Kandung"]: 0,
                ["1 Paman Sebapak"]: 0,
                ["1 Anak Paman Kandung"]: 0,
                ["1 Anak Paman Sebapak"]: 0,
            };
            const Sudah = {};
            const jumlahNenek = formData.adaNenekAyah !== "tidak" && formData.adaNenekIbu !== "tidak" ? 2 : 1;

            if (formData.jumlahAnakLaki > 0) {
                Warisan["1 Anak Laki Laki"] = "Ashabah";
            } else {
                if (formData.jumlahCucuLaki > 0) {
                    Warisan["1 Cucu Laki Laki"] = "Ashabah";
                } else {
                    if (formData.adaBapak !== "tidak") {
                        Warisan.Bapak = "Ashabah";
                    } else {
                        if (formData.adaKakek !== "tidak") {
                            Warisan.Kakek = "Ashabah";
                        } else {
                            if (formData.jumlahSaudaraLakiKandung > 0) {
                                Warisan["1 Saudara Kandung"] = "Ashabah";
                            } else {
                                if (formData.jumlahSaudaraLakiBapak > 0) {
                                    Warisan["1 Saudara Sebapak"] = "Ashabah";
                                } else {
                                    if (formData.jumlahKeponakanLakiKandung > 0) {
                                        Warisan["1 Anak Saudara Kandung"] = "Ashabah";
                                    } else {
                                        if (formData.jumlahKeponakanLakiBapak) {
                                            Warisan["1 Anak Saudara Sebapak"] = "Ashabah";
                                        } else {
                                            if (formData.jumlahPamanKandung > 0) {
                                                Warisan["1 Paman Kandung"] = "Ashabah";
                                            } else {
                                                if (formData.jumlahPamanBapak > 0) {
                                                    Warisan["1 Paman Sebapak"] = "Ashabah";
                                                } else {
                                                    if (formData.jumlahSepupuLakiKandung > 0) {
                                                        Warisan["1 Anak Paman Kandung"] = "Ashabah";
                                                    } else {
                                                        if (formData.jumlahSepupuLakiBapak > 0) {
                                                            Warisan["1 Anak Paman Sebapak"] = "Ashabah";
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if (formData.jumlahAnakPerempuan > 0) {
                if (formData.jumlahAnakLaki > 0) {
                    Warisan["1 Anak Perempuan"] = "Ashabah Bersama";
                } else {
                    Warisan["1 Anak Perempuan"] = formData.jumlahAnakPerempuan == 1 ? hartaNetto / 2 : (hartaNetto / 3) * 2;
                }
            }

            if (formData.jumlahCucuPerempuan > 0 && formData.jumlahAnakPerempuan <= 1 && formData.jumlahAnakLaki == 0) {
                if (formData.jumlahCucuLaki > 0) {
                    Warisan["1 Cucu Perempuan"] = "Ashabah Bersama";
                } else {
                    if (formData.jumlahAnakPerempuan === 1) {
                        Warisan["1 Cucu Perempuan"] = hartaNetto / 6;
                    } else if (formData.jumlahAnakPerempuan === 0) {
                        Warisan["1 Cucu Perempuan"] = formData.jumlahCucuPerempuan === 1 ? hartaNetto / 2 : (hartaNetto / 3) * 2;
                    }
                }
            }

            if (formData.adaBapak !== "tidak") {
                if (formData.jumlahAnakLaki > 0) {
                    Warisan.Bapak = hartaNetto / 6;
                } else {
                    Warisan.Bapak = formData.jumlahAnakPerempuan > 0 || formData.jumlahCucuPerempuan > 0 ? "1 / 6 + Ashabah" : "Ashabah";
                }
            }

            if (formData.adaIbu === "tidak") {
                Warisan.Ibu = 0;
            } else {
                if (
                    formData.jumlahAnakLaki === 0 &&
                    formData.jumlahCucuLaki === 0 &&
                    formData.jumlahAnakPerempuan === 0 &&
                    formData.jumlahCucuPerempuan === 0 &&
                    formData.jumlahSaudara <= 1
                ) {
                    Warisan.Ibu = formData.jenisPasangan !== "tidak" && Warisan.Bapak === "Ashabah" ? "1 / 3 dari Ashabah" : hartaNetto / 3;
                } else {
                    Warisan.Ibu = hartaNetto / 6;
                }
            }

            if (formData.jenisPasangan !== "tidak") {
                if (formData.jenisPasangan === "Suami") {
                    Warisan["1 Pasangan"] =
                        formData.jumlahAnakLaki === 0 &&
                        formData.jumlahCucuLaki === 0 &&
                        formData.jumlahAnakPerempuan === 0 &&
                        formData.jumlahCucuPerempuan === 0
                            ? hartaNetto / 2
                            : hartaNetto / 4;
                } else {
                    Warisan["1 Pasangan"] =
                        formData.jumlahAnakLaki === 0 &&
                        formData.jumlahCucuLaki === 0 &&
                        formData.jumlahAnakPerempuan === 0 &&
                        formData.jumlahCucuPerempuan === 0
                            ? hartaNetto / 4 / formData.jumlahIstri
                            : hartaNetto / 8 / formData.jumlahIstri;
                }
            }

            if (formData.adaKakek !== "tidak") {
                if (formData.adaBapak === "tidak") {
                    if (formData.jumlahAnakLaki > 0) {
                        Warisan.Kakek = hartaNetto / 6;
                    } else {
                        Warisan.Kakek =
                            formData.jumlahAnakPerempuan > 0 || formData.jumlahCucuPerempuan > 0 ? "1 / 6 + Ashabah" : "Ashabah";
                    }
                } else {
                    Warisan.Kakek = 0;
                }
            }

            if (formData.adaIbu === "tidak") {
                if (formData.adaNenekAyah !== "tidak" || formData.adaNenekIbu !== "tidak") {
                    Warisan.Nenek = hartaNetto / 6 / jumlahNenek;
                }
            } else {
                Warisan.Nenek = 0;
            }

            let penghalangSaudara;
            if (
                formData.adaBapak === "tidak" &&
                formData.adaKakek === "tidak" &&
                formData.jumlahAnakLaki === 0 &&
                formData.jumlahCucuLaki === 0
            ) {
                penghalangSaudara = false;
            } else {
                penghalangSaudara = true;
            }

            if (formData.jumlahSaudaraPerempuanKandung > 0) {
                if (!penghalangSaudara) {
                    if (formData.jumlahSaudaraLakiKandung > 0) {
                        Warisan["1 Saudari Kandung"] = "Ashabah Bersama";
                    } else {
                        if (formData.jumlahAnakPerempuan > 0 || formData.jumlahCucuPerempuan > 0) {
                            Warisan["1 Saudari Kandung"] = "Ashabah Karena";
                        } else {
                            Warisan["1 Saudari Kandung"] =
                                formData.jumlahSaudaraPerempuanKandung === 1
                                    ? hartaNetto / 2
                                    : ((hartaNetto / 3) * 2) / formData.jumlahSaudaraPerempuanKandung;
                        }
                    }
                }
            }

            if (formData.jumlahSaudaraPerempuanBapak > 0) {
                if (
                    !penghalangSaudara &&
                    formData.jumlahSaudaraLakiKandung === 0 &&
                    formData.jumlahSaudaraPerempuanKandung <= 1 &&
                    Warisan["1 Saudari Kandung"] !== "Ashabah Karena"
                ) {
                    if (formData.jumlahSaudaraPerempuanKandung === 1) {
                        Warisan["1 Saudari Sebapak"] = hartaNetto / 6 / formData.jumlahSaudaraPerempuanBapak;
                    } else {
                        if (formData.jumlahSaudaraLakiBapak > 0) {
                            Warisan["1 Saudari Kandung"] = "Ashabah Bersama";
                        } else {
                            if (formData.jumlahAnakPerempuan > 0 || formData.jumlahCucuPerempuan > 0) {
                                Warisan["1 Saudari Sebapak"] = "Ashabah Karena";
                            } else {
                                Warisan["1 Saudari Kandung"] =
                                    formData.jumlahSaudaraPerempuanBapak === 1
                                        ? hartaNetto / 2
                                        : ((hartaNetto / 3) * 2) / formData.jumlahSaudaraPerempuanBapak;
                            }
                        }
                    }
                }
            }

            if (formData.jumlahSaudaraLakiIbu > 0 || formData.jumlahSaudaraPerempuanIbu > 0) {
                if (!penghalangSaudara && formData.jumlahAnakPerempuan === 0 && formData.jumlahCucuPerempuan === 0) {
                    const saudaraSeibu = formData.jumlahSaudaraLakiIbu + formData.jumlahSaudaraPerempuanIbu;
                    if (saudaraSeibu === 1) {
                        if (formData.jumlahSaudaraLakiIbu > 0) {
                            Warisan["1 Saudara Seibu"] = hartaNetto / 3;
                        } else {
                            Warisan["1 Saudari Seibu"] = hartaNetto / 3;
                        }
                    } else {
                        const bagianSaudaraSeibu = hartaNetto / 2 / saudaraSeibu;
                        Warisan["1 Saudara Seibu"] = bagianSaudaraSeibu;
                        Warisan["1 Saudari Seibu"] = bagianSaudaraSeibu;
                    }
                }
            }

            Sudah.Nenek = Warisan.Nenek * jumlahNenek;
            Sudah["Jumlah Bagian Pasangan"] =
                formData.jenisPasangan === "Istri" ? Warisan["1 Pasangan"] * formData.jumlahIstri : Warisan["1 Pasangan"];
            Sudah["Jumlah Bagian Saudara Seibu"] = Warisan["1 Saudara Seibu"] * formData.jumlahSaudaraLakiIbu;
            Sudah["Jumlah Bagian Saudari Seibu"] = Warisan["1 Saudari Seibu"] * formData.jumlahSaudaraPerempuanIbu;

            // Mencari Sisa Harta
            const totalPembagian = Object.values(Warisan).reduce((accumulator, currentValue) => {
                // Pastikan currentValue adalah angka sebelum menjumlahkan
                const nilaiAngka = Number(currentValue);
                return accumulator + (isNaN(nilaiAngka) ? 0 : nilaiAngka); // Tambahkan nilai jika valid, jika tidak tambahkan 0
            }, 0); // 0 adalah nilai awal accumulator
            const sisaHarta = hartaNetto - totalPembagian;

            // Mencari sang Ashabah
            const kunci = Object.keys(Warisan);
            const Ashabah = kunci.find((key) => Warisan[key] === "Ashabah");
            const AshabahBapakKakek = kunci.find((key) => Warisan[key] === "1 / 6 + Ashabah");
            const AshabahIbu = kunci.find((key) => Warisan[key] === "1 / 3 dari Ashabah");
            const AshabahBersama = kunci.find((key) => Warisan[key] === "Ashabah Bersama");
            const AshabahKarena = kunci.find((key) => Warisan[key] === "Ashabah Karena");

            // Memberikan sisa harta kepada Ashabah yang berhak
            if (AshabahKarena) {
                switch (AshabahKarena) {
                    case "1 Saudari Kandung":
                        Warisan["1 Saudari Kandung"] = sisaHarta / formData.jumlahSaudaraPerempuanKandung;
                        Sudah["Jumlah Saudari Kandung"] = Warisan["1 Saudari Kandung"] * formData.jumlahSaudaraPerempuanBapak;
                        break;
                    case "1 Saudari Sebapak":
                        Warisan["1 Saudari Sebapak"] = sisaHarta / formData.jumlahSaudaraPerempuanBapak;
                        Sudah["Jumlah Saudari Sebapak"] = Warisan["1 Saudari Sebapak"] * formData.jumlahSaudaraPerempuanBapak;
                        break;
                }
            } else {
                if (AshabahIbu) {
                    Warisan.Ibu = sisaHarta / 3;
                    Warisan.Bapak = sisaHarta - sisaHarta / 3;
                } else {
                    if (AshabahBapakKakek) {
                        switch (AshabahBapakKakek) {
                            case "Bapak":
                                Warisan.Bapak = sisaHarta;
                                break;
                            case "Kakek":
                                Warisan.Kakek = sisaHarta;
                                break;
                        }
                    } else {
                        if (AshabahBersama) {
                            switch (AshabahBersama) {
                                case "1 Anak Perempuan":
                                    const bagianAnak = sisaHarta / (formData.jumlahAnakLaki * 2 + formData.jumlahAnakPerempuan);
                                    Warisan["1 Anak Laki Laki"] = bagianAnak * 2;
                                    Warisan["1 Anak Perempuan"] = bagianAnak;
                                    Sudah["Jumlah Bagian Anak Perempuan"] = Warisan["1 Anak Perempuan"] * formData.jumlahAnakPerempuan;

                                    break;
                                case "1 Cucu Perempuan":
                                    const bagianCucu = sisaHarta / (formData.jumlahCucuLaki * 2 + formData.jumlahCucuPerempuan);
                                    Warisan["1 Cucu Laki Laki"] = bagianCucu * 2;
                                    Warisan["1 Cucu Perempuan"] = bagianCucu;
                                    Sudah["Jumlah Bagian Cucu Perempuan"] = Warisan["1 Cucu Perempuan"] * formData.jumlahCucuPerempuan;
                                    break;
                                case "1 Saudari Kandung":
                                    const bagianSaudaraKandung =
                                        sisaHarta / (formData.jumlahSaudaraLakiKandung * 2 + formData.jumlahSaudaraPerempuanKandung);
                                    Warisan["1 Saudara Kandung"] = bagianSaudaraKandung * 2;
                                    Warisan["1 Saudari Kandung"] = bagianSaudaraKandung;
                                    Sudah["Jumlah Saudari Kandung"] = Warisan["1 Saudari Kandung"] * formData.jumlahSaudaraPerempuanKandung;
                                    break;
                                case "1 Saudari Sebapak":
                                    const bagianSaudaraSeibu =
                                        sisaHarta / (formData.jumlahSaudaraLakiBapak * 2 + formData.jumlahSaudaraPerempuanBapak);
                                    Warisan["1 Saudara Sebapak"] = bagianSaudaraSeibu * 2;
                                    Warisan["1 Saudari Sebapak"] = bagianSaudaraSeibu;
                                    Sudah["Jumlah Saudari Sebapak"] = Warisan["1 Saudari Sebapak"] * formData.jumlahSaudaraPerempuanBapak;
                                    break;
                            }
                        } else {
                            if (Ashabah) {
                                switch (Ashabah) {
                                    case "1 Anak Laki Laki":
                                        Warisan["1 Anak Laki Laki"] = sisaHarta / formData.jumlahAnakLaki;
                                        break;
                                    case "1 Cucu Laki Laki":
                                        Warisan["1 Cucu Laki Laki"] = sisaHarta / formData.jumlahAnakPerempuan;
                                        break;
                                    case "Bapak":
                                        Warisan.Bapak = sisaHarta;
                                        break;
                                    case "Kakek":
                                        Warisan.Kakek = sisaHarta;
                                        break;
                                    case "1 Saudara Kandung":
                                        Warisan["1 Saudara Kandung"] = sisaHarta / formData.jumlahSaudaraLakiKandung;
                                        break;
                                    case "1 Saudara Sebapak":
                                        Warisan["1 Saudara Sebapak"] = sisaHarta / formData.jumlahSaudaraLakiBapak;
                                        break;
                                    case "1 Anak Saudara Kandung":
                                        Warisan["1 Anak Saudara Kandung"] = sisaHarta / formData.jumlahKeponakanLakiKandung;
                                        break;
                                    case "1 Anak Saudara Sebapak":
                                        Warisan["1 Anak Saudara Sebapak"] = sisaHarta / formData.jumlahKeponakanLakiBapak;
                                        break;
                                    case "1 Paman Kandung":
                                        Warisan["1 Paman Kandung"] = sisaHarta / formData.jumlahPamanKandung;
                                        break;
                                    case "1 Paman Sebapak":
                                        Warisan["1 Paman Sebapak"] = sisaHarta / formData.jumlahPamanBapak;
                                        break;
                                    case "1 Anak Paman Kandung":
                                        Warisan["1 Anak Paman Kandung"] = sisaHarta / formData.jumlahSepupuLakiKandung;
                                        break;
                                    case "1 Anak Paman Sebapak":
                                        Warisan["1 Anak Paman Sebapak"] = sisaHarta / formData.jumlahSepupuLakiBapak;
                                        break;
                                }
                            } else {
                                // Memasukkan Sistem 'Aul & Radd
                                let Bagian = {
                                    "Anak Perempuan": {
                                        Penyebut: 0,
                                        Pembilang: 0,
                                    },
                                    "Cucu Perempuan": {
                                        Penyebut: 0,
                                        Pembilang: 0,
                                    },
                                    Ibu: {
                                        Penyebut: 0,
                                        Pembilang: 0,
                                    },
                                    Nenek: {
                                        Penyebut: 0,
                                        Pembilang: 0,
                                    },
                                    Pasangan: {
                                        Penyebut: 0,
                                        Pembilang: 0,
                                    },
                                    "Saudari Kandung": {
                                        Penyebut: 0,
                                        Pembilang: 0,
                                    },
                                    "Saudari Sebapak": {
                                        Penyebut: 0,
                                        Pembilang: 0,
                                    },
                                    "Saudara/i Seibu": {
                                        Penyebut: 0,
                                        Pembilang: 0,
                                    },
                                };

                                if (formData.jumlahAnakPerempuan > 0) {
                                    if (formData.jumlahAnakPerempuan === 1) {
                                        Bagian["Anak Perempuan"].Pembilang = 1;
                                        Bagian["Anak Perempuan"].Penyebut = 2;
                                    } else if (formData.jumlahAnakPerempuan > 1) {
                                        Bagian["Anak Perempuan"].Pembilang = 2;
                                        Bagian["Anak Perempuan"].Penyebut = 3;
                                    }
                                }

                                if (formData.jumlahCucuPerempuan > 0 && formData.jumlahAnakPerempuan <= 1) {
                                    if (formData.jumlahAnakPerempuan === 1) {
                                        Bagian["Cucu Perempuan"].Pembilang = 1;
                                        Bagian["Cucu Perempuan"].Penyebut = 6;
                                    } else {
                                        if (formData.jumlahCucuPerempuan === 1) {
                                            Bagian["Cucu Perempuan"].Pembilang = 1;
                                            Bagian["Cucu Perempuan"].Penyebut = 2;
                                        } else if (formData.jumlahCucuPerempuan > 1) {
                                            Bagian["Cucu Perempuan"].Pembilang = 2;
                                            Bagian["Cucu Perempuan"].Penyebut = 3;
                                        }
                                    }
                                }

                                if (formData.adaIbu !== "tidak") {
                                    if (
                                        formData.jumlahAnakLaki === 0 &&
                                        formData.jumlahCucuLaki === 0 &&
                                        formData.jumlahAnakPerempuan === 0 &&
                                        formData.jumlahCucuPerempuan === 0 &&
                                        formData.jumlahSaudara <= 1
                                    ) {
                                        Bagian.Ibu.Pembilang = 1;
                                        Bagian.Ibu.Penyebut = 3;
                                    } else {
                                        Bagian.Ibu.Pembilang = 1;
                                        Bagian.Ibu.Penyebut = 6;
                                    }
                                }

                                if (formData.adaIbu === "tidak") {
                                    if (formData.adaNenekAyah !== "tidak" || formData.adaNenekIbu !== "tidak") {
                                        Bagian.Nenek.Pembilang = 1;
                                        Bagian.Nenek.Penyebut = 6;
                                    }
                                }

                                if (formData.jenisPasangan !== "tidak") {
                                    if (formData.jenisPasangan === "Suami") {
                                        if (
                                            formData.jumlahAnakLaki === 0 &&
                                            formData.jumlahCucuLaki === 0 &&
                                            formData.jumlahAnakPerempuan === 0 &&
                                            formData.jumlahCucuPerempuan === 0
                                        ) {
                                            Bagian.Pasangan.Pembilang = 1;
                                            Bagian.Pasangan.Penyebut = 2;
                                        } else {
                                            Bagian.Pasangan.Pembilang = 1;
                                            Bagian.Pasangan.Penyebut = 4;
                                        }
                                    } else {
                                        if (
                                            formData.jumlahAnakLaki === 0 &&
                                            formData.jumlahCucuLaki === 0 &&
                                            formData.jumlahAnakPerempuan === 0 &&
                                            formData.jumlahCucuPerempuan === 0
                                        ) {
                                            Bagian.Pasangan.Pembilang = 1;
                                            Bagian.Pasangan.Penyebut = 4;
                                        } else {
                                            Bagian.Pasangan.Pembilang = 1;
                                            Bagian.Pasangan.Penyebut = 8;
                                        }
                                    }
                                }

                                if (!penghalangSaudara) {
                                    if (formData.jumlahSaudaraPerempuanKandung > 0) {
                                        if (formData.jumlahSaudaraPerempuanKandung === 1) {
                                            Bagian["Saudari Kandung"].Pembilang = 1;
                                            Bagian["Saudari Kandung"].Penyebut = 2;
                                        } else if (formData.jumlahAnakPerempuan > 1) {
                                            Bagian["Saudari Kandung"].Pembilang = 2;
                                            Bagian["Saudari Kandung"].Penyebut = 3;
                                        }
                                    }

                                    if (formData.jumlahSaudaraPerempuanBapak > 0 && formData.jumlahSaudaraPerempuanKandung <= 1) {
                                        if (formData.jumlahSaudaraPerempuanKandung === 1) {
                                            Bagian["Saudari Sebapak"].Pembilang = 1;
                                            Bagian["Saudari Sebapak"].Penyebut = 6;
                                        } else {
                                            if (formData.jumlahCucuPerempuan === 1) {
                                                Bagian["Saudari Sebapak"].Pembilang = 1;
                                                Bagian["Saudari Sebapak"].Penyebut = 2;
                                            } else if (formData.jumlahCucuPerempuan > 1) {
                                                Bagian["Saudari Sebapak"].Pembilang = 2;
                                                Bagian["Saudari Sebapak"].Penyebut = 3;
                                            }
                                        }
                                    }

                                    if (formData.jumlahSaudaraLakiIbu > 0 || formData.jumlahSaudaraPerempuanIbu > 0) {
                                        if (formData.jumlahAnakPerempuan === 0 && formData.jumlahCucuPerempuan === 0) {
                                            const saudaraSeibu = formData.jumlahSaudaraLakiIbu + formData.jumlahSaudaraPerempuanIbu;
                                            if (saudaraSeibu === 1) {
                                                Bagian["Saudara/i Seibu"].Pembilang = 1;
                                                Bagian["Saudara/i Seibu"].Penyebut = 3;
                                            } else {
                                                Bagian["Saudara/i Seibu"].Pembilang = 1;
                                                Bagian["Saudara/i Seibu"].Penyebut = 2;
                                            }
                                        }
                                    }
                                }

                                // Menjumlahkan semua pembilang dan menemukan "Majmu' Siham"
                                // Ambil semua nilai detail bagian
                                const semuaDetailBagian = Object.values(Bagian);

                                // Ambil hanya nilai Pembilang
                                const semuaPembilang = semuaDetailBagian.map((detail) => detail.Pembilang); // -> [1, 0, 1, 0, 1, 0, 0, 0]

                                // Filter hanya yang lebih besar dari 0
                                const pembilangValid = semuaPembilang.filter((pb) => pb > 0); // -> [1, 1, 1]

                                // Jumlahkan pembilang yang valid
                                const totalPembilangAwal = pembilangValid.reduce((accumulator, currentValue) => {
                                    return accumulator + currentValue;
                                }, 0); // 0 adalah nilai awal

                                console.log("Array Pembilang (>0):", pembilangValid);
                                console.log("Total Penjumlahan Pembilang (>0):", totalPembilangAwal);

                                // Mencari KPK Penyebut
                                // --- Fungsi Helper untuk KPK (Wajib Ada) ---
                                function gcd(a, b) {
                                    // Greatest Common Divisor (FPB)
                                    return b === 0 ? a : gcd(b, a % b);
                                }
                                function lcm(a, b) {
                                    // Least Common Multiple (KPK)
                                    if (a === 0 || b === 0) return 0;
                                    a = Math.abs(a);
                                    b = Math.abs(b);
                                    // Hindari pembagian dengan nol jika gcd menghasilkan 0 (seharusnya tidak terjadi jika a,b > 0)
                                    const divisor = gcd(a, b);
                                    return divisor === 0 ? 0 : (a * b) / divisor;
                                }
                                function findArrayLCM(arr) {
                                    if (!arr || arr.length === 0) return 1;
                                    const validNumbers = arr.map((n) => Number(n)).filter((n) => Number.isInteger(n) && n > 0);
                                    if (validNumbers.length === 0) return 1;
                                    // Mulai reduce dengan angka pertama agar benar jika array hanya 1 elemen
                                    return validNumbers.reduce((acc, val) => lcm(acc, val), validNumbers[0]);
                                }
                                // --- Akhir Fungsi Helper ---

                                // Ambil semua nilai detail bagian lagi
                                const semuaDetailBagianLagi = Object.values(Bagian);

                                // Ambil hanya nilai Penyebut
                                const semuaPenyebutLagi = semuaDetailBagianLagi.map((detail) => detail.Penyebut); // -> [2, 0, 6, 0, 8, 0, 0, 0]

                                // Filter hanya yang lebih besar dari 0
                                const penyebutValidUntukKPK = semuaPenyebutLagi.filter((p) => p > 0); // -> [2, 6, 8]

                                // Cari KPK dari penyebut yang valid
                                const ashlulMasalahAwal = findArrayLCM(penyebutValidUntukKPK);

                                console.log("Array Penyebut (>0):", penyebutValidUntukKPK);
                                console.log("KPK dari Penyebut (>0) ('Ashlul Masalah Awal):", ashlulMasalahAwal); // Output: 24 (KPK dari 2, 6, 8)

                                let majmuSiham = 0;
                                let sahamPerAhliWaris = {};

                                for (const ahliWaris in Bagian) {
                                    if (Object.hasOwnProperty.call(Bagian, ahliWaris)) {
                                        const detail = Bagian[ahliWaris];
                                        if (detail.Penyebut > 0) {
                                            // Hitung saham (pembilang baru berdasarkan ashlul masalah)
                                            const saham = (ashlulMasalahAwal / detail.Penyebut) * detail.Pembilang;
                                            sahamPerAhliWaris[ahliWaris] = saham; // Simpan saham per orang
                                            majmuSiham += saham; // Jumlahkan saham ini
                                        }
                                    }
                                }

                                console.log("Saham per ahli waris (berdasarkan Ashlul Masalah):", sahamPerAhliWaris);
                                // Contoh Output (jika ashlulMasalahAwal=24): { 'Anak Perempuan': 12, Ibu: 4, Pasangan: 3 }

                                console.log("Total Saham (Majmu Siham):", majmuSiham);
                                // Contoh Output: 19 (dari 12 + 4 + 3)

                                const ashlulMasalah = majmuSiham;

                                if (Bagian["Anak Perempuan"].Pembilang !== 0) {
                                    Sudah["Jumlah Bagian Anak Perempuan"] =
                                        (hartaNetto / ashlulMasalah) * sahamPerAhliWaris["Anak Perempuan"];
                                    Warisan["1 Anak Perempuan"] = Sudah["Jumlah Bagian Anak Perempuan"] / formData.jumlahAnakPerempuan;
                                }

                                if (Bagian["Cucu Perempuan"].Pembilang !== 0) {
                                    Sudah["Jumlah Bagian Cucu Perempuan"] =
                                        (hartaNetto / ashlulMasalah) * sahamPerAhliWaris["Cucu Perempuan"];
                                    Warisan["1 Cucu Perempuan"] = Sudah["Jumlah Bagian Cucu Perempuan"] / formData.jumlahCucuPerempuan;
                                }

                                if (Bagian.Ibu.Pembilang !== 0) {
                                    Warisan.Ibu = (hartaNetto / ashlulMasalah) * sahamPerAhliWaris.Ibu;
                                    Sudah.Ibu = Warisan.Ibu;
                                }

                                if (Bagian.Nenek.Pembilang !== 0) {
                                    Sudah.Nenek = (hartaNetto / ashlulMasalah) * sahamPerAhliWaris.Nenek;
                                    Warisan.Nenek = Sudah.Nenek / jumlahNenek;
                                }

                                if (Bagian.Pasangan.Pembilang !== 0) {
                                    if (formData.jenisPasangan === "suami") {
                                        Warisan.Pasangan = (hartaNetto / ashlulMasalah) * sahamPerAhliWaris.Pasangan;
                                        Sudah.Pasangan = Warisan.Pasangan;
                                    } else {
                                        Sudah.Pasangan = (hartaNetto / ashlulMasalah) * sahamPerAhliWaris["Pasangan"];
                                        Warisan["1 Pasangan"] = Sudah.Pasangan / formData.jumlahIstri;
                                    }
                                }

                                if (Bagian["Saudari Kandung"].Pembilang !== 0) {
                                    Sudah["Jumlah Bagian Saudari Kandung"] =
                                        (hartaNetto / ashlulMasalah) * sahamPerAhliWaris["Saudari Kandung"];
                                    Warisan["1 Saudari Kandung"] =
                                        Sudah["Jumlah Bagian Saudari Kandung"] / formData.jumlahSaudaraPerempuanKandung;
                                }

                                if (Bagian["Saudari Sebapak"].Pembilang !== 0) {
                                    Sudah["Jumlah Bagian Saudari Sebapak"] =
                                        (hartaNetto / ashlulMasalah) * sahamPerAhliWaris["Saudari Sebapak"];
                                    Warisan["1 Saudari Sebapak"] =
                                        Sudah["Jumlah Bagian Saudari Sebapak"] / formData.jumlahSaudaraPerempuanBapak;
                                }

                                if (Bagian["Saudara/i Seibu"].Pembilang !== 0) {
                                    if (formData.jumlahSaudaraLakiIbu > 0) {
                                        Sudah["Jumlah Bagian Saudara Seibu"] =
                                            (hartaNetto / ashlulMasalah) * sahamPerAhliWaris["Saudara Seibu"];
                                        Warisan["1 Saudara Seibu"] = Sudah["Jumlah Bagian Saudara Seibu"] / formData.jumlahSaudaraLakiIbu;
                                    }
                                    if (formData.jumlahSaudaraPerempuanIbu > 0) {
                                        Sudah["Jumlah Bagian Saudari Seibu"] =
                                            (hartaNetto / ashlulMasalah) * sahamPerAhliWaris["Saudari Seibu"];
                                        Warisan["1 Saudari Seibu"] =
                                            Sudah["Jumlah Bagian Saudari Seibu"] / formData.jumlahSaudaraPerempuanIbu;
                                    }
                                }

                                // --- BARU BANDINGKAN majmuSiham dengan ashlulMasalahAwal ---
                                if (majmuSiham > ashlulMasalahAwal) {
                                    console.log("Terjadi 'Aul");
                                    // ... logika 'Aul ...
                                } else if (majmuSiham < ashlulMasalahAwal) {
                                    console.log("Terjadi Radd");
                                    // ... logika Radd ...
                                } else {
                                    console.log("Normal");
                                }
                            }
                        }
                    }
                }
            }

            Sudah["Jumlah Bagian Anak Laki Laki"] = Warisan["1 Anak Laki Laki"] * formData.jumlahAnakLaki;
            Sudah["Jumlah Bagian Cucu Laki Laki"] = Warisan["1 Cucu Laki Laki"] * formData.jumlahCucuLaki;

            Sudah.Bapak = Warisan.Bapak;
            Sudah.Ibu = Warisan.Ibu;
            Sudah.Kakek = Warisan.Kakek;

            Sudah["Jumlah Bagian Saudara Kandung"] = Warisan["1 Saudara Kandung"] * formData.jumlahSaudaraLakiKandung;
            Sudah["Jumlah Bagian Saudara Sebapak"] = Warisan["1 Saudara Sebapak"] * formData.jumlahSaudaraLakiBapak;
            Sudah["Jumlah Bagian Anak Saudara Kandung"] = Warisan["1 Anak Saudara Kandung"] * formData.jumlahKeponakanLakiKandung;
            Sudah["Jumlah Bagian Anak Saudara Sebapak"] = Warisan["1 Anak Saudara Sebapak"] * formData.jumlahKeponakanLakiBapak;
            Sudah["Jumlah Bagian Paman Kandung"] = Warisan["1 Paman Kandung"] * formData.jumlahPamanKandung;
            Sudah["Jumlah Bagian Paman Sebapak"] = Warisan["1 Paman Sebapak"] * formData.jumlahPamanBapak;
            Sudah["Jumlah Bagian Anak Paman Kandung"] = Warisan["1 Anak Paman Kandung"] * formData.jumlahSepupuLakiKandung;
            Sudah["Jumlah Bagian Anak Paman Sebapak"] = Warisan["1 Anak Paman Sebapak"] * formData.jumlahSepupuLakiBapak;

            console.log(Sudah);
            console.log(Warisan);
            console.log(sisaHarta);

            return [Warisan, Sudah];
        };
        const BagianFinal = Perhitungan(formData, hartaNetto);

        // --- GUNAKAN BagianFinal[0] untuk TAMPILAN, BagianFinal[1] untuk TOTAL ---
        let hasilPerhitunganTeks = "";
        let errorPerhitungan = null; // Ambil dari try-catch jika ada

        if (errorPerhitungan) {
            hasilPerhitunganTeks = errorPerhitungan;
        } else if (Array.isArray(BagianFinal) && BagianFinal.length >= 2) {
            // Pastikan BagianFinal adalah Array dan punya minimal 2 elemen

            const dataTampilPerOrang = BagianFinal[0]; // Objek untuk ditampilkan ke user
            const dataUntukTotal = BagianFinal[1]; // Objek untuk menghitung total verifikasi

            // Cek apakah kedua data adalah objek yang valid
            const tampilValid = dataTampilPerOrang && typeof dataTampilPerOrang === "object";
            const totalValid = dataUntukTotal && typeof dataUntukTotal === "object";

            if (tampilValid && Object.keys(dataTampilPerOrang).length > 0) {
                // --- Format Tampilan berdasarkan data Per Orang (BagianFinal[0]) ---
                hasilPerhitunganTeks = "Rincian Pembagian (Per Orang):\n";
                hasilPerhitunganTeks += "------------------------------\n";

                for (const orangKey in dataTampilPerOrang) {
                    if (Object.hasOwnProperty.call(dataTampilPerOrang, orangKey)) {
                        const jumlahBagianOrang = Number(dataTampilPerOrang[orangKey]);

                        if (jumlahBagianOrang > 0 && Number.isFinite(jumlahBagianOrang)) {
                            // Tampilkan key (misal "1 Anak Laki Laki") dan jumlahnya
                            hasilPerhitunganTeks += `- ${orangKey}: ${formatRupiah(jumlahBagianOrang)}\n`;
                        } else if (dataTampilPerOrang[orangKey] != null && dataTampilPerOrang[orangKey] !== 0) {
                            hasilPerhitunganTeks += `- ${orangKey}: [Hasil Tidak Valid: ${dataTampilPerOrang[orangKey]}]\n`;
                        }
                        // Jika jumlah 0, tidak ditampilkan
                    }
                }

                // --- Hitung Total Terbagi berdasarkan data Per Klasifikasi (BagianFinal[1]) ---
                let totalTerbagi = 0;
                if (totalValid) {
                    for (const klasifikasiKey in dataUntukTotal) {
                        if (Object.hasOwnProperty.call(dataUntukTotal, klasifikasiKey)) {
                            const jumlahBagianKlasifikasi = Number(dataUntukTotal[klasifikasiKey]);
                            if (Number.isFinite(jumlahBagianKlasifikasi)) {
                                // Jumlahkan semua angka valid
                                totalTerbagi += jumlahBagianKlasifikasi;
                            }
                        }
                    }
                } else {
                    console.warn("Data per klasifikasi (BagianFinal[1]) tidak valid untuk menghitung total.");
                    // Mungkin hitung total dari data per orang sebagai fallback?
                    // totalTerbagi = Object.values(dataTampilPerOrang).reduce((sum, val) => sum + (Number.isFinite(Number(val)) ? Number(val) : 0), 0);
                }

                // --- Tambahkan Total dan Cek Selisih ---
                hasilPerhitunganTeks += `\nTotal Terbagi (Verifikasi): ${formatRupiah(totalTerbagi)}`;
                if (Math.abs(totalTerbagi - hartaNetto) > 1) {
                    // Toleransi pembulatan 1 rupiah
                    hasilPerhitunganTeks += `\n(Perhatian: Ada selisih pembulatan atau error perhitungan!)`;
                }
            } else {
                // Kasus jika dataTampilPerOrang (BagianFinal[0]) kosong atau tidak valid
                hasilPerhitunganTeks = "Tidak ada ahli waris yang berhak atau perhitungan tidak menghasilkan bagian.";
                if (hartaNetto > 0 && !errorPerhitungan) {
                    hasilPerhitunganTeks += "\nHarta mungkin diserahkan ke Baitul Mal.";
                }
            }
        } else {
            // Kasus jika BagianFinal bukan array, atau elemennya kurang dari 2
            hasilPerhitunganTeks = "Format data hasil perhitungan tidak sesuai (bukan array/kurang dari 2 elemen).";
            if (hartaNetto > 0 && !errorPerhitungan) {
                hasilPerhitunganTeks += "\nHarta mungkin diserahkan ke Baitul Mal.";
            }
        }
        // --- Akhir penggunaan BagianFinal ---

        // Kode setelah ini akan menggabungkan hasilPerhitunganTeks dengan ringkasan data

        // --- Tampilkan Hasil ---
        let ringkasanText = "RINGKASAN DATA MASUKAN:\n" + `--------------------------\n`;
        // (Logika ringkasan data sama, pastikan cek dengan shouldShowStepOverall atau visibility class)
        ringkasanText += `Anak Laki: ${formData.jumlahAnakLaki}\n` + `Anak Perempuan: ${formData.jumlahAnakPerempuan}\n`;
        if (shouldShowStepOverall(3)) {
            ringkasanText += `Cucu Laki: ${formData.jumlahCucuLaki}\n` + `Cucu Perempuan: ${formData.jumlahCucuPerempuan}\n`;
        }
        ringkasanText += `Bapak: ${formData.adaBapak === "ya" ? "Ada" : "Tidak Ada"}\n`;
        if (document.getElementById("kakekGroup")?.classList.contains("visible")) {
            ringkasanText += `Kakek: ${formData.adaKakek === "ya" ? "Ada" : "Tidak Ada"}\n`;
        }
        ringkasanText += `Ibu: ${formData.adaIbu === "ya" ? "Ada" : "Tidak Ada"}\n`;
        if (document.getElementById("nenekIbuGroup")?.classList.contains("visible"))
            ringkasanText += `Nenek (dari Ibu): ${formData.adaNenekIbu === "ya" ? "Ada" : "Tidak Ada"}\n`;
        if (document.getElementById("nenekAyahGroup")?.classList.contains("visible"))
            ringkasanText += `Nenek (dari Ayah): ${formData.adaNenekAyah === "ya" ? "Ada" : "Tidak Ada"}\n`;
        if (formData.jenisPasangan === "suami") ringkasanText += `Pasangan: Suami\n`;
        else if (formData.jenisPasangan === "istri") ringkasanText += `Pasangan: Istri (${formData.jumlahIstri})\n`;
        else ringkasanText += `Pasangan: Tidak Ada\n`;
        if (shouldShowStepOverall(7)) {
            ringkasanText +=
                `Sdr Laki Kandung: ${formData.jumlahSaudaraLakiKandung}\n` + `Sdr Pr Kandung: ${formData.jumlahSaudaraPerempuanKandung}\n`;
        }
        if (shouldShowStepOverall(8)) {
            ringkasanText +=
                `Sdr Laki Bapak: ${formData.jumlahSaudaraLakiBapak}\n` + `Sdr Pr Bapak: ${formData.jumlahSaudaraPerempuanBapak}\n`;
        }
        if (shouldShowStepOverall(9)) {
            ringkasanText += `Sdr Laki Ibu: ${formData.jumlahSaudaraLakiIbu}\n` + `Sdr Pr Ibu: ${formData.jumlahSaudaraPerempuanIbu}\n`;
        }
        if (shouldShowStepOverall(10)) {
            ringkasanText +=
                `Keponakan Lk Kandung: ${formData.jumlahKeponakanLakiKandung}\n` +
                `Keponakan Lk Bapak: ${formData.jumlahKeponakanLakiBapak}\n`;
        }
        if (shouldShowStepOverall(11)) {
            ringkasanText += `Paman Kandung: ${formData.jumlahPamanKandung}\n` + `Paman Bapak: ${formData.jumlahPamanBapak}\n`;
        }
        if (shouldShowStepOverall(12)) {
            ringkasanText +=
                `Sepupu Lk Kandung: ${formData.jumlahSepupuLakiKandung}\n` + `Sepupu Lk Bapak: ${formData.jumlahSepupuLakiBapak}\n`;
        }

        ringkasanText += `\nDATA HARTA & KEWAJIBAN:\n` + `--------------------------\n`;
        ringkasanText +=
            `Total Harta: ${formatRupiah(formData.totalHarta)}\n` +
            `Biaya Jenazah: ${formatRupiah(formData.biayaPengurusan)}\n` +
            `Total Hutang: ${formatRupiah(formData.totalHutang)}\n` +
            `Wasiat (Maks. 1/3): ${formatRupiah(formData.wasiat)}\n` +
            `Harta Bersih Siap Dibagi: ${formatRupiah(hartaNetto)}\n`;
        ringkasanText += `\nHASIL PERHITUNGAN:\n` + `=================================\n`;
        // ringkasanText += hasilPerhitunganTeks;
        ringkasanText += hasilPerhitunganTeks;

        detailPembagianPre.textContent = ringkasanText;
        hasilKalkulasiDiv.style.display = "block"; // Tampilkan hasil HANYA setelah submit
        hasilKalkulasiDiv.scrollIntoView({ behavior: "smooth", block: "start" });
    }
});

// Inisialisasi
document.addEventListener("DOMContentLoaded", () => {
    steps.forEach((step) => {
        if (!step.classList.contains("active")) {
            step.style.display = "none";
        }
    });
    // Panggil checkAndReset untuk inisialisasi visibility dan data awal
    checkAndResetConditions();
    const initialStep = findNextStep(0);
    showStep(initialStep);
});

// Fungsi format Rupiah
function formatRupiah(angka) {
    if (isNaN(angka) || angka === null) return "Rp 0";
    angka = Math.round(angka);
    if (angka < 0) angka = 0;
    var number_string = angka.toString(),
        sisa = number_string.length % 3,
        rupiah = number_string.substr(0, sisa),
        ribuan = number_string.substr(sisa).match(/\d{3}/g);
    if (ribuan) {
        var separator = sisa ? "." : "";
        rupiah += separator + ribuan.join(".");
    }
    return "Rp " + rupiah;
}
