let daftarHutang = {};

document.addEventListener("DOMContentLoaded", loadHutang);

function loadHutang() {
    const storedHutang = JSON.parse(localStorage.getItem('daftarHutang')) || {};
    daftarHutang = storedHutang;
    displayHutang();
}

function tambahPelanggan() {
    const namaPelanggan = document.getElementById('namaPelanggan').value;
    if (namaPelanggan) {
        if (!daftarHutang[namaPelanggan]) {
            daftarHutang[namaPelanggan] = [];
        }
        document.getElementById('namaPelanggan').value = '';
        displayHutang();
    } else {
        alert("Masukkan nama pelanggan.");
    }
}

function displayHutang() {
    const daftarHutangDiv = document.getElementById('daftarHutang');
    daftarHutangDiv.innerHTML = '';

    for (const nama in daftarHutang) {
        const hutangDiv = document.createElement('div');
        hutangDiv.innerHTML = `
            <h3>${nama}</h3>
            <input type="text" placeholder="Harga Beli" id="hargaBeli-${nama}">
            <input type="text" placeholder="Harga Jual" id="hargaJual-${nama}">
            <button onclick="tambahHutang('${nama}')">Tambah Hutang</button>
            <button onclick="lihatHutang('${nama}')">Lihat Hutang</button>
            <div id="rincianHutang-${nama}"></div>
        `;
        daftarHutangDiv.appendChild(hutangDiv);
    }
    saveHutang();
}

function tambahHutang(nama) {
    const hargaBeli = parseInt(document.getElementById(`hargaBeli-${nama}`).value);
    const hargaJual = parseInt(document.getElementById(`hargaJual-${nama}`).value);
    const tanggal = new Date().toLocaleDateString();

    if (!isNaN(hargaBeli) && hargaBeli > 0 && !isNaN(hargaJual) && hargaJual > 0) {
        daftarHutang[nama].push({ tanggal, hargaBeli, hargaJual });
        updateSaldo(hargaBeli);
        displayHutang();
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

function lihatHutang(nama) {
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

function bayarHutang(nama, hargaJual) {
    let uangTunai = parseInt(document.getElementById('uangTunai').value.replace(/\D/g, '')) || 0;
    uangTunai += hargaJual;
    document.getElementById('uangTunai').value = uangTunai;
    saveSaldo('uangTunai', uangTunai);
    updateTotalKas();

    daftarHutang[nama] = daftarHutang[nama].filter(hutang => hutang.hargaJual !== hargaJual);
    displayHutang();
}

function saveHutang() {
    localStorage.setItem('daftarHutang', JSON.stringify(daftarHutang));
}

function kembaliKeDashboard() {
    document.getElementById('daftarHutang').innerHTML = '';
}