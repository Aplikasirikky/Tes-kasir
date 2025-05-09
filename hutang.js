let daftarHutang = {};
let daftarPelanggan = [];

// Memuat data dari localStorage saat halaman dimuat
document.addEventListener("DOMContentLoaded", loadHutang);

function loadHutang() {
    const storedHutang = JSON.parse(localStorage.getItem('daftarHutang')) || {};
    const storedPelanggan = JSON.parse(localStorage.getItem('daftarPelanggan')) || [];
    daftarHutang = storedHutang;
    daftarPelanggan = storedPelanggan;
    displayPelanggan();
}

// Menampilkan daftar pelanggan
function displayPelanggan() {
    const daftarPelangganUl = document.getElementById('daftarPelanggan');
    daftarPelangganUl.innerHTML = '';

    daftarPelanggan.forEach(pelanggan => {
        const li = document.createElement('li');
        li.textContent = pelanggan;
        li.onclick = () => {
            tampilkanHutang(pelanggan); // Menampilkan hutang pelanggan saat nama diklik
        };
        daftarPelangganUl.appendChild(li);
    });
}

// Menambahkan pelanggan baru
function tambahPelanggan() {
    const namaPelanggan = document.getElementById('namaPelanggan').value;
    if (namaPelanggan) {
        if (!daftarHutang[namaPelanggan]) {
            daftarHutang[namaPelanggan] = [];
            daftarPelanggan.push(namaPelanggan);
            document.getElementById('namaPelanggan').value = '';
            displayPelanggan();
            saveHutang();
            savePelanggan(); // Simpan daftar pelanggan ke localStorage
        } else {
            alert("Pelanggan sudah ada.");
        }
    } else {
        alert("Masukkan nama pelanggan.");
    }
}

// Menyimpan daftar pelanggan ke localStorage
function savePelanggan() {
    localStorage.setItem('daftarPelanggan', JSON.stringify(daftarPelanggan));
}

// Menampilkan hutang untuk pelanggan yang dipilih
function tampilkanHutang(nama) {
    const rincianDiv = document.getElementById('daftarHutang');
    rincianDiv.style.display = 'block'; // Menampilkan rincian hutang
    rincianDiv.innerHTML = `
        <h3>Hutang untuk ${nama}</h3>
        <input type="text" placeholder="Harga Beli" id="hargaBeli-${nama}">
        <input type="text" placeholder="Harga Jual" id="hargaJual-${nama}">
        <button onclick="tambahHutang('${nama}')">Tambah Hutang</button>
        <div id="rincianHutang-${nama}"></div>
    `;
    displayRincianHutang(nama);
}

// Menampilkan rincian hutang
function displayRincianHutang(nama) {
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

// Menambah hutang untuk pelanggan
function tambahHutang(nama) {
    const hargaBeli = parseInt(document.getElementById(`hargaBeli-${nama}`).value);
    const hargaJual = parseInt(document.getElementById(`hargaJual-${nama}`).value);
    const tanggal = new Date().toLocaleDateString();

    if (!isNaN(hargaBeli) && hargaBeli > 0 && !isNaN(hargaJual) && hargaJual > 0) {
        daftarHutang[nama].push({ tanggal, hargaBeli, hargaJual });
        updateSaldo(hargaBeli);
        displayRincianHutang(nama);
        saveHutang();
    } else {
        alert("Masukkan harga beli dan harga jual yang valid.");
    }
}

// Memperbarui saldo
function updateSaldo(hargaBeli) {
    let saldoPulsa = parseInt(document.getElementById('saldoPulsa').value.replace(/\D/g, '')) || 0;
    saldoPulsa -= hargaBeli;
    document.getElementById('saldoPulsa').value = saldoPulsa;
    saveSaldo('saldoPulsa', saldoPulsa);
}

// Menyimpan hutang ke localStorage
function saveHutang() {
    localStorage.setItem('daftarHutang', JSON.stringify(daftarHutang));
}

// Kembali ke dashboard
function kembaliKeDashboard() {
    document.getElementById('daftarHutang').style.display = 'none'; // Menyembunyikan rincian hutang
}