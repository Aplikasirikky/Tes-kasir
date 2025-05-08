let totalKas = 0;
let keuntungan = 0;

document.addEventListener("DOMContentLoaded", () => {
    loadSaldo();
    updateTotalKas();
});

function formatRupiah(angka) {
    const format = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
    });
    return format.format(angka);
}

function addSaldo(id) {
    const input = document.getElementById(id);
    const amount = parseInt(prompt("Masukkan jumlah:"));
    
    if (!isNaN(amount) && amount > 0) {
        let currentValue = parseInt(input.value.replace(/\D/g, '')) || 0;
        currentValue += amount;
        input.value = currentValue; // Simpan nilai mentah untuk pengolahan
        saveSaldo(id, currentValue);
        updateTotalKas();
        alert("Saldo berhasil ditambahkan.");
    } else {
        alert("Masukkan angka yang valid.");
    }
}

function subtractTabungan() {
    const input = document.getElementById('tabunganInvestor');
    const amount = parseInt(prompt("Masukkan jumlah:"));
    
    if (!isNaN(amount) && amount > 0) {
        let currentValue = parseInt(input.value.replace(/\D/g, '')) || 0;
        currentValue -= amount; // Mengurangi tabungan investor
        input.value = currentValue; // Simpan nilai mentah untuk pengolahan
        saveSaldo('tabunganInvestor', currentValue);
        updateTotalKas();
        alert("Tabungan investor berhasil dikurangi.");
    } else {
        alert("Masukkan angka yang valid.");
    }
}

function addPenjualan() {
    const hargaBeli = parseInt(prompt("Masukkan Harga Beli:"));
    const hargaJual = parseInt(prompt("Masukkan Harga Jual:"));

    if (!isNaN(hargaBeli) && hargaBeli > 0 && !isNaN(hargaJual) && hargaJual > 0) {
        // Update saldo pulsa
        let saldoPulsa = parseInt(document.getElementById('saldoPulsa').value.replace(/\D/g, '')) || 0;
        saldoPulsa -= hargaBeli; // Mengurangi saldo pulsa dengan harga beli
        document.getElementById('saldoPulsa').value = saldoPulsa; // Update saldo pulsa
        
        // Menambah uang tunai dari harga jual
        let currentUangTunai = parseInt(document.getElementById('uangTunai').value.replace(/\D/g, '')) || 0;
        currentUangTunai += hargaJual; // Menambah uang tunai dengan harga jual
        document.getElementById('uangTunai').value = currentUangTunai; // Update nilai uang tunai

        // Simpan uang tunai ke localStorage
        saveSaldo('uangTunai', currentUangTunai);

        // Hitung keuntungan menggunakan fungsi terpisah
        calculateKeuntungan(hargaBeli, hargaJual);
        
        // Simpan saldo pulsa dan keuntungan ke localStorage
        saveSaldo('saldoPulsa', saldoPulsa);
        saveSaldo('keuntungan', keuntungan);
        
        updateTotalKas();
        alert("Penjualan berhasil ditambahkan.");
    } else {
        alert("Masukkan harga beli dan harga jual yang valid.");
    }
}

function calculateKeuntungan(hargaBeli, hargaJual) {
    // Menghitung keuntungan dari selisih harga jual dan beli
    keuntungan += (hargaJual - hargaBeli);
}

function updateTotalKas() {
    const saldoPulsa = parseInt(document.getElementById('saldoPulsa').value.replace(/\D/g, '')) || 0;
    const saldoBank = parseInt(document.getElementById('saldoBank').value.replace(/\D/g, '')) || 0;
    const tabunganInvestor = parseInt(document.getElementById('tabunganInvestor').value.replace(/\D/g, '')) || 0;
    const uangTunai = parseInt(document.getElementById('uangTunai').value.replace(/\D/g, '')) || 0;

    totalKas = calculateTotalKas(saldoPulsa, saldoBank, tabunganInvestor, uangTunai);
    displayResults(); // Menampilkan hasil total kas
}

function calculateTotalKas(saldoPulsa, saldoBank, tabunganInvestor, uangTunai) {
    return saldoPulsa + saldoBank + uangTunai - tabunganInvestor; // Total kas
}

function displayResults() {
    document.getElementById('totalKas').innerText = formatRupiah(totalKas);
    document.getElementById('keuntungan').innerText = formatRupiah(keuntungan); // Menampilkan keuntungan
}

function saveSaldo(id, value) {
    localStorage.setItem(id, value);
}

function loadSaldo() {
    const saldoPulsa = localStorage.getItem('saldoPulsa') || 0;
    const saldoBank = localStorage.getItem('saldoBank') || 0;
    const tabunganInvestor = localStorage.getItem('tabunganInvestor') || 0;
    const keuntunganStored = localStorage.getItem('keuntungan') || 0;
    const uangTunaiStored = localStorage.getItem('uangTunai') || 0; // Memuat uang tunai dari localStorage

    document.getElementById('saldoPulsa').value = saldoPulsa;
    document.getElementById('saldoBank').value = saldoBank;
    document.getElementById('tabunganInvestor').value = tabunganInvestor;
    document.getElementById('uangTunai').value = uangTunaiStored; // Memuat nilai uang tunai
    keuntungan = parseInt(keuntunganStored) || 0; // Memuat keuntungan dari localStorage

    // Update total kas berdasarkan data yang dimuat
    updateTotalKas();
}

function resetData() {
    document.getElementById('saldoPulsa').value = 0;
    document.getElementById('saldoBank').value = 0;
    document.getElementById('tabunganInvestor').value = 0;
    document.getElementById('uangTunai').value = 0; // Reset uang tunai
    totalKas = 0; // Reset total kas
    keuntungan = 0; // Reset keuntungan
    localStorage.clear();
    updateTotalKas();
    alert("Data telah direset.");
}

function downloadData() {
    const data = {
        saldoPulsa: document.getElementById('saldoPulsa').value,
        saldoBank: document.getElementById('saldoBank').value,
        tabunganInvestor: document.getElementById('tabunganInvestor').value,
        uangTunai: document.getElementById('uangTunai').value, // Menyimpan uang tunai dalam data yang diunduh
        totalKas: totalKas, // Menyimpan total kas dalam data yang diunduh
        keuntungan: keuntungan // Menyimpan keuntungan dalam data yang diunduh
    };
    const jsonData = JSON.stringify(data, null, 4);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function uploadData(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = JSON.parse(e.target.result);
            document.getElementById('saldoPulsa').value = data.saldoPulsa || 0;
            document.getElementById('saldoBank').value = data.saldoBank || 0;
            document.getElementById('tabunganInvestor').value = data.tabunganInvestor || 0;
            document.getElementById('uangTunai').value = data.uangTunai || 0; // Memuat uang tunai dari file yang diunggah
            totalKas = data.totalKas || 0; // Memuat total kas dari file yang diunggah
            keuntungan = data.keuntungan || 0; // Memuat keuntungan dari file yang diunggah

            saveSaldo('saldoPulsa', data.saldoPulsa);
            saveSaldo('saldoBank', data.saldoBank);
            saveSaldo('tabunganInvestor', data.tabunganInvestor);
            saveSaldo('uangTunai', data.uangTunai); // Menyimpan uang tunai yang diunggah
            saveSaldo('keuntungan', keuntungan); // Menyimpan keuntungan yang diunggah

            updateTotalKas();
            alert("Data berhasil diunggah.");
        };
        reader.readAsText(file);
    }
}