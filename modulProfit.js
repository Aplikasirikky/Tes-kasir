let profit = JSON.parse(localStorage.getItem('profit')) || {};

function showProfit() {
    let content = '<h2>Keuntungan</h2><table><tr><th>Nama Produk</th><th>Keuntungan</th></tr>';
    let totalOverallProfit = 0; 

    const storedProfit = JSON.parse(localStorage.getItem('profit')) || {};
    for (const productName in storedProfit) {
        const productProfit = storedProfit[productName];
        totalOverallProfit += productProfit;
        content += `<tr><td>${productName}</td><td>${formatRupiah(productProfit)}</td></tr>`;
    }

    content += `<tr><td><strong>Total Keuntungan Keseluruhan</strong></td><td><strong>${formatRupiah(totalOverallProfit)}</strong></td></tr>`;
    content += '</table><button onclick="resetProfit()">Reset Keuntungan</button>';
    content += '<button onclick="goToMainMenu()">Kembali ke Menu Utama</button>';
    document.getElementById('content').innerHTML = content;
}

// Fungsi untuk menghitung dan menyimpan keuntungan
function calculateProfit(productName, profitAmount) {
    if (!profit[productName]) {
        profit[productName] = 0; // Inisialisasi jika belum ada
    }
    profit[productName] += profitAmount; // Tambahkan keuntungan baru
    localStorage.setItem('profit', JSON.stringify(profit)); // Simpan ke localStorage
}

// Fungsi untuk mereset keuntungan
function resetProfit() {
    if (confirm("Apakah Anda yakin ingin mereset semua data keuntungan?")) {
        profit = {}; // Reset keuntungan
        localStorage.removeItem('profit'); // Hapus data keuntungan dari localStorage
        alert('Keuntungan berhasil direset!'); // Notifikasi kepada pengguna
        showProfit(); // Tampilkan kembali laporan keuntungan setelah reset
    }
}