let daftarHutang = {};
let daftarPelanggan = [];

document.addEventListener("DOMContentLoaded", loadHutang);

function loadHutang() {
    const storedHutang = JSON.parse(localStorage.getItem('daftarHutang')) || {};
    const storedPelanggan = JSON.parse(localStorage.getItem('daftarPelanggan')) || [];
    daftarHutang = storedHutang;
    daftarPelanggan = storedPelanggan;
    displayDashboard();
}

function displayDashboard() {
    const dashboard = document.getElementById('daftarHutang');
    dashboard.innerHTML = `
        <button onclick="tambahPelanggan()">Tambah Pelanggan</button>
        <button onclick="displayPelanggan()">Daftar Pelanggan</button>
    `;
}

function displayPelanggan() {
    const dashboard = document.getElementById('daftarHutang');
    dashboard.innerHTML = '';
    
    daftarPelanggan.forEach(pelanggan => {
        const button = document.createElement('button');
        button.textContent = pelanggan;
        button.onclick = () => showHutang(pelanggan);
        dashboard.appendChild(button);
    });

    const kembaliButton = document.createElement('button');
    kembaliButton.textContent = 'Kembali';
    kembaliButton.onclick = displayDashboard;
    dashboard.appendChild(kembaliButton);
}

function tambahPelanggan() {
    const namaPelanggan = prompt("Masukkan nama pelanggan:");
    if (namaPelanggan) {
        if (!daftarHutang[namaPelanggan]) {
            daftarHutang[namaPelanggan] = [];
            daftarPelanggan.push(namaPelanggan);
            saveHutang();
            savePelanggan();
            alert("Pelanggan berhasil ditambahkan.");
        } else {
            alert("Pelanggan sudah ada.");
        }
    } else {
        alert("Masukkan nama pelanggan.");
    }
}

function showHutang(nama) {
    const dashboard = document.getElementById('daftarHutang');
    dashboard.innerHTML = `
        <h3>${nama}</h3>
        <input type="text" placeholder="Harga Beli" id="hargaBeli-${nama}">
        <input type="text" placeholder="Harga Jual" id="hargaJual-${nama}">
        <button onclick="tambahHutang('${nama}')">Tambah Hutang</button>
        <button onclick="hapusHutang('${nama}')">Hapus Hutang</button>
        <button onclick="kembaliKeDaftarPelanggan()">Kembali ke Daftar Pelanggan</button>
        <div id="rincianHutang-${nama}"></div>
    `;
    displayHutang(nama);
}

function displayHutang(nama) {
    const rincianDiv = document.getElementById(`rincianHutang-${nama}`);
    rincianDiv.innerHTML = `
        <table>
            <tr>
                <th>Tanggal</th>
                <th>Harga Beli</th>
                <th>Harga Jual</th>
                <th>Aksi</th>
            </tr>
            ${daftarHutang[nama].map(hutang => `
                <tr>
                    <td>${hutang.tanggal}</td>
                    <td>${hutang.hargaBeli}</td>
                    <td>${hutang.hargaJual}</td>
                    <td><button onclick="bayarHutang('${nama}', ${hutang.hargaJual})">Bayar</button></td>
                </tr>
            `).join('')}
        </table>
    `;
}

function tambahHutang(nama) {
    const hargaBeli = parseInt(document.getElementById(`hargaBeli-${nama}`).value);
    const hargaJual = parseInt(document.getElementById(`hargaJual-${nama}`).value);
    const tanggal = new Date().toLocaleDateString();

    if (!isNaN(hargaBeli) && hargaBeli > 0 && !isNaN(hargaJual) && hargaJual > 0) {
        daftarHutang[nama].push({ tanggal, hargaBeli, hargaJual });
        updateSaldo(hargaBeli);
        displayHutang(nama);
        saveHutang();
    } else {
        alert("Masukkan harga beli dan harga jual yang valid.");
    }
}

function updateSaldo(hargaBeli) {
    let saldoPulsa = parseInt(document.getElementById('saldoPulsa').value.replace(/\D/g, '')) || 0;
    saldoPulsa -= hargaBeli;
    document.getElementById('saldoPulsa').value = saldoPulsa;
    saveSaldo('saldoPulsa', saldoPulsa);
    updateTotalKas();
}

function bayarHutang(nama, hargaJual) {
    let uangTunai = parseInt(document.getElementById('uangTunai').value.replace(/\D/g, '')) || 0;
    uangTunai += hargaJual;
    document.getElementById('uangTunai').value = uangTunai;
    saveSaldo('uangTunai', uangTunai);
    updateTotalKas();

    daftarHutang[nama] = daftarHutang[nama].filter(hutang => hutang.hargaJual !== hargaJual);
    displayHutang(nama);
    saveHutang();
}

function hapusHutang(nama) {
    if (confirm("Apakah Anda yakin ingin menghapus semua hutang untuk pelanggan ini?")) {
        delete daftarHutang[nama];
        daftarPelanggan = daftarPelanggan.filter(pelanggan => pelanggan !== nama);
        saveHutang();
        savePelanggan();
        displayPelanggan();
        alert("Hutang pelanggan telah dihapus.");
    }
}

function savePelanggan() {
    localStorage.setItem('daftarPelanggan', JSON.stringify(daftarPelanggan));
}

function saveHutang() {
    localStorage.setItem('daftarHutang', JSON.stringify(daftarHutang));
}

function loadHutang() {
    const storedHutang = JSON.parse(localStorage.getItem('daftarHutang')) || {};
    const storedPelanggan = JSON.parse(localStorage.getItem('daftarPelanggan')) || [];
    daftarHutang = storedHutang;
    daftarPelanggan = storedPelanggan;
    displayDashboard();
}

function kembaliKeDaftarPelanggan() {
    displayPelanggan();
}

// Tambahkan fungsi untuk mereset data hutang
function resetHutang() {
    daftarHutang = {};
    daftarPelanggan = [];
    saveHutang();
    savePelanggan();
    alert("Data hutang telah direset.");
}