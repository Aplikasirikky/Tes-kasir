let sales = JSON.parse(localStorage.getItem('sales')) || [];
let dailySales = JSON.parse(localStorage.getItem('dailySales')) || {};

function showSales() {
    let content = `<h2>Penjualan Produk</h2>
    <input id="search" placeholder="Cari Produk" onkeyup="searchProducts()" />
    <table id="salesTable"><tr><th>Nama Produk</th><th>Harga Jual</th><th>Aksi</th></tr>`;
    
    products.forEach((product) => {
        content += `<tr>
            <td>${product.name}</td>
            <td>${formatRupiah(product.sellPrice)}</td>
            <td><button onclick="recordSale('${product.name}', ${product.sellPrice}, ${product.stock})">Jual</button></td>
        </tr>`;
    });

    content += '</table><button onclick="goToMainMenu()">Kembali ke Menu Utama</button>';
    document.getElementById('content').innerHTML = content;
}

function recordSale(productName, sellPrice, stock) {
    const product = products.find(p => p.name === productName);
    const today = new Date().toISOString().split('T')[0]; // Mendapatkan tanggal hari ini dalam format YYYY-MM-DD

    if (product && product.stock > 0) {
        // Mencatat penjualan
        sales.push({ productName, sellPrice });
        
        // Hitung profit
        const profitAmount = sellPrice - product.buyPrice;
        calculateProfit(productName, profitAmount);

        // Kurangi stok produk
        product.stock -= 1;
        cash += sellPrice; // Tambahkan hasil penjualan ke kas

        // Mencatat penjualan harian
        const formattedDate = formatDate(today); // Menggunakan format tanggal yang baru
        if (!dailySales[formattedDate]) {
            dailySales[formattedDate] = []; // Inisialisasi array untuk tanggal baru
        }
        dailySales[formattedDate].push({ productName, sellPrice });

        // Update localStorage
        localStorage.setItem('dailySales', JSON.stringify(dailySales));
        localStorage.setItem('cash', cash);
        localStorage.setItem('products', JSON.stringify(products));

        alert('Penjualan berhasil dicatat!');
    } else {
        alert('Stok tidak cukup untuk produk ini!');
    }
}

function downloadDailySalesReport() {
    let csvContent = "data:text/csv;charset=utf-8,Tanggal,Nama Produk,Harga Jual\n"; // Header CSV

    for (const date in dailySales) {
        dailySales[date].forEach(sale => {
            const row = `${date},${sale.productName},${sale.sellPrice}`;
            csvContent += row + "\n"; // Tambahkan data baris
        });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "laporan_penjualan_harian.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function clearDailySalesData() {
    if (confirm("Apakah Anda yakin ingin menghapus semua data penjualan harian?")) {
        dailySales = {}; // Reset data penjualan
        localStorage.removeItem('dailySales'); // Hapus data dari localStorage
        alert('Semua data penjualan harian telah dihapus!');
        showDailySalesReport(); // Tampilkan kembali laporan setelah penghapusan
    }
}

function showDailySalesReport() {
    let content = '<h2>Laporan Penjualan Harian</h2>';
    content += '<table><tr><th>Tanggal</th><th>Nama Produk</th><th>Harga Jual</th></tr>';

    let grandTotal = 0;

    for (const date in dailySales) {
        let dailyTotal = 0; // Total untuk hari tertentu

        dailySales[date].forEach(sale => {
            content += `<tr><td>${date}</td><td>${sale.productName}</td><td>${formatRupiah(sale.sellPrice)}</td></tr>`;
            dailyTotal += sale.sellPrice; // Tambahkan harga jual ke total harian
        });

        content += `<tr><td colspan="2"><strong>Total untuk ${date}</strong></td><td><strong>${formatRupiah(dailyTotal)}</strong></td></tr>`;
        grandTotal += dailyTotal; // Tambahkan total harian ke total keseluruhan
    }

    content += `<tr><td colspan="2"><strong>Total Keseluruhan Penjualan</strong></td><td><strong>${formatRupiah(grandTotal)}</strong></td></tr>`;
    content += '</table>';
    content += '<button onclick="downloadDailySalesReport()">Unduh Laporan</button>'; // Tombol untuk mengunduh
    content += '<button onclick="clearDailySalesData()">Hapus Semua Data</button>'; // Tombol untuk menghapus semua data
    content += '<button onclick="goToMainMenu()">Kembali ke Menu Utama</button>';
    
    document.getElementById('content').innerHTML = content;
}

function formatRupiah(amount) {
    return 'Rp ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}