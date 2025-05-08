let pengeluaranList = [];
let penjualanList = [];
let hutangList = [];

// Load data dari localStorage ketika halaman diload
document.addEventListener("DOMContentLoaded", () => {
    loadData();
});

// Fungsi untuk menyimpan data ke localStorage
function saveData() {
    localStorage.setItem('pengeluaranList', JSON.stringify(pengeluaranList));
    localStorage.setItem('penjualanList', JSON.stringify(penjualanList));
    localStorage.setItem('hutangList', JSON.stringify(hutangList));
}

function loadData() {
    pengeluaranList = JSON.parse(localStorage.getItem('pengeluaranList')) || [];
    penjualanList = JSON.parse(localStorage.getItem('penjualanList')) || [];
    hutangList = JSON.parse(localStorage.getItem('hutangList')) || [];
    
    updateDaftarPengeluaran();
    updateDaftarPenjualan();
    updateDaftarHutang();
}

// Fungsi untuk menambah pengeluaran
function tambahPengeluaran() {
    const pengeluaran = parseInt(document.getElementById('pengeluaran').value);
    const tanggal = document.getElementById('tanggalPengeluaran').value;

    if (!isNaN(pengeluaran) && pengeluaran > 0 && tanggal) {
        pengeluaranList.push({ pengeluaran, tanggal });
        document.getElementById('pengeluaran').value = '';
        document.getElementById('tanggalPengeluaran').value = '';
        updateDaftarPengeluaran();
        saveData(); // Simpan data setelah ditambahkan
    } else {
        alert("Masukkan pengeluaran dan tanggal yang valid.");
    }
}

// Fungsi untuk menampilkan daftar pengeluaran
function updateDaftarPengeluaran() {
    const daftar = document.getElementById('daftarPengeluaran');
    daftar.innerHTML = '';
    pengeluaranList.forEach(item => {
        const li = document.createElement('li');
        li.innerText = `Rp ${item.pengeluaran} pada ${item.tanggal}`;
        daftar.appendChild(li);
    });
}

// Fungsi untuk mereset pengeluaran
function resetPengeluaran() {
    pengeluaranList = [];
    updateDaftarPengeluaran();
    localStorage.removeItem('pengeluaranList'); // Hapus dari localStorage
}

// Fungsi untuk menambah penjualan
function tambahPenjualan() {
    const hargaBeli = parseInt(document.getElementById('hargaBeli').value);
    const hargaJual = parseInt(document.getElementById('hargaJual').value);
    const tanggal = document.getElementById('tanggalPenjualan').value;

    if (!isNaN(hargaBeli) && hargaBeli > 0 && !isNaN(hargaJual) && hargaJual > 0 && tanggal) {
        penjualanList.push({ hargaBeli, hargaJual, tanggal });
        document.getElementById('hargaBeli').value = '';
        document.getElementById('hargaJual').value = '';
        document.getElementById('tanggalPenjualan').value = '';
        updateDaftarPenjualan();
        saveData(); // Simpan data setelah ditambahkan
        
        // Mengurangi saldo jika harga beli valid
        let saldoPulsa = parseInt(document.getElementById('saldoPulsa').value.replace(/\D/g, '')) || 0;
        saldoPulsa -= hargaBeli;
        document.getElementById('saldoPulsa').value = saldoPulsa;
        saveSaldo('saldoPulsa', saldoPulsa); // Simpan saldo
    } else {
        alert("Masukkan harga beli, harga jual, dan tanggal yang valid.");
    }
}

// Fungsi untuk menampilkan daftar penjualan
function updateDaftarPenjualan() {
    const daftar = document.getElementById('daftarPenjualan');
    daftar.innerHTML = '';
    penjualanList.forEach(item => {
        const li = document.createElement('li');
        li.innerText = `Harga Beli: Rp ${item.hargaBeli}, Harga Jual: Rp ${item.hargaJual} pada ${item.tanggal}`;
        daftar.appendChild(li);
    });
}

// Fungsi untuk mereset penjualan
function resetPenjualan() {
    penjualanList = [];
    updateDaftarPenjualan();
    localStorage.removeItem('penjualanList'); // Hapus dari localStorage
}

// Fungsi untuk menambah hutang
function tambahHutang() {
    const nama = document.getElementById('namaPelanggan').value;
    const hargaBeli = parseInt(document.getElementById('hargaBeliHutang').value);
    const tanggal = document.getElementById('tanggalHutang').value;

    if (nama && !isNaN(hargaBeli) && hargaBeli > 0 && tanggal) {
        hutangList.push({ nama, hargaBeli, tanggal });
        document.getElementById('namaPelanggan').value = '';
        document.getElementById('hargaBeliHutang').value = '';
        document.getElementById('tanggalHutang').value = '';
        updateDaftarHutang();
        saveData(); // Simpan data setelah ditambahkan
        
        // Mengurangi saldo jika harga beli valid
        let saldoPulsa = parseInt(document.getElementById('saldoPulsa').value.replace(/\D/g, '')) || 0;
        saldoPulsa -= hargaBeli;
        document.getElementById('saldoPulsa').value = saldoPulsa;
        saveSaldo('saldoPulsa', saldoPulsa); // Simpan saldo
    } else {
        alert("Masukkan nama pelanggan, harga beli, dan tanggal yang valid.");
    }
}

// Fungsi untuk menampilkan daftar hutang
function updateDaftarHutang() {
    const daftar = document.getElementById('daftarHutang');
    daftar.innerHTML = '';
    hutangList.forEach(item => {
        const li = document.createElement('li');
        li.innerText = `Nama: ${item.nama}, Harga Beli: Rp ${item.hargaBeli} pada ${item.tanggal}`;
        daftar.appendChild(li);
    });
}

// Fungsi untuk mereset hutang
function resetHutang() {
    hutangList = [];
    updateDaftarHutang();
    localStorage.removeItem('hutangList'); // Hapus dari localStorage
}