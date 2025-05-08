let products = JSON.parse(localStorage.getItem('products')) || [];
let sales = JSON.parse(localStorage.getItem('sales')) || [];
let profit = JSON.parse(localStorage.getItem('profit')) || {};
let customers = JSON.parse(localStorage.getItem('customers')) || [];
let debts = JSON.parse(localStorage.getItem('debts')) || {};
let detailedDebts = JSON.parse(localStorage.getItem('detailedDebts')) || {}
let users = JSON.parse(localStorage.getItem('users')) || [];
let cash = JSON.parse(localStorage.getItem('cash')) || 0; // Inisialisasi kas dari localStorage
let expenses = JSON.parse(localStorage.getItem('expenses')) || []; // Inisialisasi pengeluaran dari localStorage
let dailySales = JSON.parse(localStorage.getItem('dailySales')) || {}; // Inisialisasi data penjualan harian dari localStorage

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Menambahkan 0 di depan jika kurang dari 10
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Bulan dimulai dari 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Format tgl/bulan/tahun
}

function showExpensesMenu() {
    let content = '<h2>Menu Pengeluaran</h2>';
    content += '<table><tr><th>Tanggal</th><th>Jumlah</th><th>Deskripsi</th><th>Aksi</th></tr>';

    expenses.forEach((expense, index) => {
        content += `
            <tr>
                <td>${expense.date}</td>
                <td>${formatRupiah(expense.amount)}</td>
                <td>${expense.description}</td>
                <td>
                    <button onclick="deleteExpense(${index})">Hapus</button>
                </td>
            </tr>`;
    });

    content += '</table>';
    content += '<input id="expenseDate" type="date" placeholder="Tanggal" />';
    content += '<input id="expenseAmount" placeholder="Jumlah Pengeluaran" type="number" />';
    content += '<input id="expenseDescription" placeholder="Deskripsi Pengeluaran" />';
    content += '<button onclick="addExpense()">Tambah Pengeluaran</button>';
    content += '<button onclick="goToMainMenu()">Kembali ke Menu Utama</button>';

    document.getElementById('content').innerHTML = content;
}

// Fungsi untuk menambahkan pengeluaran
function addExpense() {
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const date = document.getElementById('expenseDate').value;
    const description = document.getElementById('expenseDescription').value;

    if (!isNaN(amount) && amount > 0 && date && description) {
        const formattedDate = formatDate(date); // Format tanggal di sini
        expenses.push({ date: formattedDate, amount, description }); // Menyimpan tanggal yang terformat
        cash -= amount; // Kurangi kas
        localStorage.setItem('cash', cash); // Update kas di localStorage
        localStorage.setItem('expenses', JSON.stringify(expenses)); // Simpan pengeluaran ke localStorage
        
        alert('Pengeluaran berhasil ditambahkan!');
        showExpensesMenu(); // Tampilkan kembali menu pengeluaran setelah penambahan
    } else {
        alert('Silakan masukkan jumlah, tanggal, dan deskripsi pengeluaran yang valid!');
    }
}

// Fungsi untuk menghapus pengeluaran
function deleteExpense(index) {
    const removedExpense = expenses[index];
    expenses.splice(index, 1); // Hapus pengeluaran dari array
    cash += removedExpense.amount; // Kembalikan jumlah ke kas
    localStorage.setItem('cash', cash); // Update kas di localStorage
    localStorage.setItem('expenses', JSON.stringify(expenses)); // Simpan perubahan ke localStorage
    
    alert('Pengeluaran berhasil dihapus!');
    showExpensesMenu(); // Tampilkan kembali menu pengeluaran setelah penghapusan
}

function setCash() {
    const newCash = parseFloat(document.getElementById('cashInput').value);
    if (!isNaN(newCash) && newCash >= 0) {
        cash = newCash;
        localStorage.setItem('cash', cash); // Simpan kas ke localStorage

        alert('Kas berhasil diperbarui!');
        showFinancialReport(); // Tampilkan laporan keuangan setelah mengupdate kas
    } else {
        alert('Silakan masukkan jumlah kas yang valid!');
    }
}

// Fungsi untuk menampilkan menu admin
function showAdminMenu() {
    let content = '<h2>Menu Admin</h2>';
    content += '<button onclick="showUsers()">Daftar Pengguna</button>';
    content += '<button onclick="goToMainMenu()">Kembali ke Menu Utama</button>';
    document.getElementById('content').innerHTML = content;
}

// Fungsi untuk menampilkan daftar pengguna
function showUsers() {
    let content = '<h2>Daftar Pengguna</h2>';
    content += '<table><tr><th>Username</th><th>Password</th><th>Aksi</th></tr>';

    users.forEach((user, index) => {
        content += `
            <tr>
                <td>${user.username}</td>
                <td>${user.password}</td>
                <td>
                    <button onclick="deleteUser(${index})">Hapus</button>
                </td>
            </tr>`;
    });

    content += '</table>';
    content += '<input id="newUsername" placeholder="Username Baru" />';
    content += '<input id="newPassword" placeholder="Password Baru" type="password" />';
    content += '<button onclick="addUser()">Tambah Pengguna</button>';
    content += '<button onclick="goToMainMenu()">Kembali ke Menu Utama</button>';

    document.getElementById('content').innerHTML = content;
}

// Fungsi untuk menambahkan pengguna
function addUser() {
    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;

    if (newUsername && newPassword) {
        users.push({ username: newUsername, password: newPassword });
        localStorage.setItem('users', JSON.stringify(users)); // Simpan ke localStorage
        document.getElementById('newUsername').value = ''; // Kosongkan input
        document.getElementById('newPassword').value = ''; // Kosongkan input
        showUsers(); // Tampilkan ulang daftar pengguna
    } else {
        alert('Silakan masukkan username dan password!');
    }
}

// Fungsi untuk menghapus pengguna
function deleteUser(index) {
    users.splice(index, 1); // Hapus pengguna dari array
    localStorage.setItem('users', JSON.stringify(users)); // Simpan perubahan ke localStorage
    showUsers(); // Tampilkan ulang daftar pengguna
}

// Modifikasi pada fungsi login untuk memeriksa pengguna di localStorage
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Periksa jika pengguna adalah admin
    const validUsername = "admin";
    const validPassword = "12345";

    if (username === validUsername && password === validPassword) {
        // Sembunyikan formulir login dan tampilkan menu utama
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('main-menu').style.display = 'block';
        document.getElementById('admin-menu').style.display = 'block'; // Tampilkan menu admin
        goToMainMenu(); // Tampilkan menu produk secara default
    } else {
        // Periksa apakah pengguna terdaftar
        const user = users.find(user => user.username === username && user.password === password);
        if (user) {
            // Sembunyikan formulir login dan tampilkan menu utama
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('main-menu').style.display = 'block';
            goToMainMenu(); // Tampilkan menu produk secara default
        } else {
            document.getElementById('error-message').innerText = 'Username atau password salah!';
        }
    }
}

function showProductsMenu() {
    let content = '<h2>Menu Produk</h2>';
    content += '<button onclick="showProducts()">Daftar Produk</button>';
    content += '<button onclick="showAddProduct()">Input Produk</button>';
    content += '<button onclick="showUpdateProduct()">Update Produk</button>';
    content += '<button onclick="printProducts()">Cetak Daftar Produk</button>';
    content += '<button onclick="clearAllProducts()">Hapus Semua Produk</button>';
    content += '<button onclick="goToMainMenu()">Kembali ke Menu Utama</button>';
    document.getElementById('content').innerHTML = content;
}

function showFinancialReportMenu() {
    let content = '<h2>Menu Laporan Keuangan</h2>';
    content += `<p><strong>Jumlah Kas Saat Ini:</strong> ${formatRupiah(cash)}</p>`;
    
    content += '<input id="cashInput" placeholder="Input Kas" type="number" />';
    content += '<button onclick="setCash()">Set Kas</button>';
    content += '<button onclick="showProfit()">Keuntungan</button>';
    content += '<button onclick="goToMainMenu()">Kembali ke Menu Utama</button>';
    document.getElementById('content').innerHTML = content;
}

function showCustomersMenu() {
    let content = '<h2>Menu Hutang</h2>';
    content += '<button onclick="showCustomers()">Daftar Pelanggan</button>';
    content += '<button onclick="goToMainMenu()">Kembali ke Menu Utama</button>';
    document.getElementById('content').innerHTML = content;
}

function showCustomers() {
    let content = '<h2>Daftar Pelanggan</h2>';
    content += '<table><tr><th>Nama Pelanggan</th><th>Aksi</th></tr>';
    
    customers.forEach((customer, index) => {
        content += `
            <tr>
                <td>${customer}</td>
                <td>
                    <button onclick="viewDebts('${customer}')">Lihat Hutang</button>
                    <button onclick="deleteCustomer(${index})">Hapus</button>
                </td>
            </tr>`;
    });

    content += '</table>';
    content += '<input id="customerName" placeholder="Nama Pelanggan" />';
    content += '<button onclick="addCustomer()">Tambah Pelanggan</button>';
    content += '<button onclick="goToMainMenu()">Kembali ke Menu Utama</button>';
    
    document.getElementById('content').innerHTML = content;
}

// Fungsi untuk menambahkan pelanggan
function addCustomer() {
    const customerName = document.getElementById('customerName').value;

    if (customerName) {
        customers.push(customerName);
        localStorage.setItem('customers', JSON.stringify(customers)); // Simpan ke localStorage
        document.getElementById('customerName').value = ''; // Kosongkan input
        showCustomers(); // Tampilkan ulang daftar pelanggan
    } else {
        alert('Silakan masukkan nama pelanggan!');
    }
}

// Fungsi untuk menghapus pelanggan
function deleteCustomer(index) {
    customers.splice(index, 1); // Hapus pelanggan dari array
    localStorage.setItem('customers', JSON.stringify(customers)); // Simpan perubahan ke localStorage
    delete debts[customers[index]]; // Hapus hutang pelanggan dari objek debts
    localStorage.setItem('debts', JSON.stringify(debts)); // Simpan perubahan ke localStorage
    showCustomers(); // Tampilkan ulang daftar pelanggan
}

// Fungsi untuk melihat produk yang dihutang oleh pelanggan
function viewDebts(customerName) {
    const debtInfo = debts[customerName] || { products: [], total: 0 };
    const detailInfo = detailedDebts[customerName] || []; // Ambil rincian dari detailedDebts
    let content = `<h2>Hutang untuk ${customerName}</h2>`;

    // Dropdown untuk memilih produk yang dihutang
    content += `<select id="productSelect">
        <option value="">Pilih Produk</option>`;
    
    products.forEach(product => {
        content += `<option value="${product.name}" data-price="${product.sellPrice}" data-stock="${product.stock}">${product.name} - ${formatRupiah(product.sellPrice)} (Stok: ${product.stock})</option>`;
    });

    content += `</select>
        <input type="number" id="debtAmount" placeholder="Jumlah Hutang" min="1" />
        <input type="date" id="debtDate" />
        <button onclick="addDebt('${customerName}', document.getElementById('productSelect').value, parseInt(document.getElementById('debtAmount').value), document.getElementById('debtDate').value)">Tambah Hutang</button>
        <button onclick="showCustomers()">Kembali ke Daftar Pelanggan</button>`;

    // Tampilkan rincian hutang jika ada
    if (detailInfo.length > 0) {
        content += '<table><tr><th>Tanggal</th><th>Produk</th><th>Jumlah</th><th>Total Hutang</th><th>Aksi</th></tr>';
        detailInfo.forEach(product => {
            content += `<tr>
                <td>${product.date}</td>
                <td>${product.name}</td>
                <td>${product.amount}</td>
                <td>${formatRupiah(product.total)}</td>
                <td><button onclick="payDebt('${customerName}', '${product.name}', ${product.amount}, ${product.total})">Bayar</button></td>
            </tr>`;
        });
        content += `</table><p><strong>Total Hutang: Rp ${debtInfo.total}</strong></p>`;
    } else {
        content += '<p>Tidak ada hutang untuk pelanggan ini.</p>';
    }

    document.getElementById('content').innerHTML = content;
}

// Fungsi untuk menambahkan rincian hutang
function addDetailedDebt(customerName, productName, amount, date) {
    if (!detailedDebts[customerName]) {
        detailedDebts[customerName] = [];
    }
    detailedDebts[customerName].push({ 
        name: productName, 
        amount: amount, 
        total: amount * products.find(p => p.name === productName).sellPrice,
        date: date // Menyimpan tanggal di sini
    });

    // Simpan ke localStorage
    localStorage.setItem('detailedDebts', JSON.stringify(detailedDebts));
}

// Fungsi untuk menghapus rincian hutang
function removeDetailedDebt(customerName, productName, amount) {
    if (detailedDebts[customerName]) {
        const index = detailedDebts[customerName].findIndex(product => product.name === productName);
        if (index > -1) {
            const productDebt = detailedDebts[customerName][index];
            if (productDebt.amount === amount) {
                detailedDebts[customerName].splice(index, 1); // Hapus dari rincian jika jumlahnya sama
            } else {
                productDebt.amount -= amount; // Kurangi jumlah jika tidak sama
            }
            // Jika tidak ada rincian hutang yang tersisa, hapus pelanggan dari detailedDebts
            if (detailedDebts[customerName].length === 0) {
                delete detailedDebts[customerName];
            }
            // Simpan perubahan ke localStorage
            localStorage.setItem('detailedDebts', JSON.stringify(detailedDebts));
        }
    }
}

// Fungsi untuk menambahkan hutang
function addDebt(customerName, productName, amount, date) {
    const product = products.find(p => p.name === productName);
    
    if (!product || amount <= 0 || amount > product.stock) {
        alert('Jumlah hutang tidak valid!');
        return;
    }

    // Inisialisasi jika belum ada
    if (!debts[customerName]) {
        debts[customerName] = { total: 0, products: [] };
    }

    // Update hutang
    const existingDebt = debts[customerName].products.find(p => p.name === productName);
    if (existingDebt) {
        existingDebt.amount += amount;
        existingDebt.total += amount * product.sellPrice;
    } else {
        debts[customerName].products.push({ name: productName, amount: amount, total: amount * product.sellPrice });
    }

    // Update total hutang
    debts[customerName].total += amount * product.sellPrice;
    // Kurangi stok produk
    product.stock -= amount;

    // Format tanggal dan tambahkan rincian hutang
    const formattedDate = formatDate(date); // Format tanggal di sini
    addDetailedDebt(customerName, productName, amount, formattedDate); // Menggunakan tanggal yang terformat

    // Simpan ke localStorage
    localStorage.setItem('debts', JSON.stringify(debts));
    localStorage.setItem('products', JSON.stringify(products));

    alert('Hutang berhasil ditambahkan!');
    viewDebts(customerName); // Tampilkan kembali rincian hutang
}

// Fungsi untuk membayar hutang
function payDebt(customerName, productName, amount, total) {
    // Kurangi total hutang dari customer
    debts[customerName].total -= total; 

    // Cari index produk dalam daftar hutang
    const productIndex = debts[customerName].products.findIndex(p => p.name === productName);
    if (productIndex > -1) {
        const productDebt = debts[customerName].products[productIndex];
        
        // Cari produk untuk mendapatkan harga jual dan harga beli
        const product = products.find(p => p.name === productName);
        const profitAmount = product.sellPrice - product.buyPrice; // Hitung keuntungan
        
        // Jika jumlah yang dibayar sama dengan jumlah yang dihutang, hapus produk dari hutang
        if (productDebt.amount === amount) {
            debts[customerName].products.splice(productIndex, 1); // Hapus produk dari hutang
        } else {
            // Jika tidak, kurangi jumlah hutang
            productDebt.amount -= amount;
            productDebt.total -= (total / amount) * amount; // Update total
        }

        // Hitung dan simpan keuntungan untuk jumlah yang dibayar
        calculateProfit(productName, profitAmount * amount); // Hitung keuntungan berdasarkan jumlah yang dibayar
        // Tambahkan pembayaran ke kas
        cash += total; // Menambah kas dengan total yang dibayar
        localStorage.setItem('cash', cash); // Simpan kas ke localStorage

        // Hapus rincian hutang
        removeDetailedDebt(customerName, productName, amount);

        // Update penyimpanan lokal
        localStorage.setItem('debts', JSON.stringify(debts));

        alert('Pembayaran berhasil dilakukan!');
        viewDebts(customerName); // Tampilkan kembali rincian hutang setelah pembayaran
    } else {
        alert('Produk tidak ditemukan dalam hutang.');
    }
}

// Fungsi untuk menampilkan daftar produk
function showProducts() {
    sortProducts(); // Panggil fungsi untuk mengurutkan produk sebelum ditampilkan
    let content = '<h2>Daftar Produk</h2>';
    content += `<input id="search" placeholder="Cari Produk" onkeyup="searchProductsInList()" />`; 
    content += '<table><tr><th>Nama</th><th>Harga Beli</th><th>Harga Jual</th><th>Stok</th><th>Aksi</th></tr>';
    
    let totalStock = 0;
    let totalBuyPrice = 0;
    let totalSellPrice = 0;

    products.forEach((product, index) => {
        content += `<tr>
            <td>${product.name}</td>
            <td>${formatRupiah(product.buyPrice)}</td>
            <td>${formatRupiah(product.sellPrice)}</td>
            <td>${product.stock}</td>
            <td>
                <button onclick="deleteProduct(${index})">Hapus</button>
            </td>
        </tr>`;
        totalStock += product.stock;
        totalBuyPrice += product.buyPrice * product.stock;
        totalSellPrice += product.sellPrice * product.stock;
    });

    content += `<tr><td colspan="2"><strong>Total Stok</strong></td><td><strong>${totalStock}</strong></td><td></td></tr>`;
    content += `<tr><td colspan="2"><strong>Total Harga Beli</strong></td><td><strong>${formatRupiah(totalBuyPrice)}</strong></td><td></td></tr>`;
    content += `<tr><td colspan="2"><strong>Total Harga Jual</strong></td><td><strong>${formatRupiah(totalSellPrice)}</strong></td><td></td></tr>`;
    content += '</table>';
    
    content += '<button onclick="goToMainMenu()">Kembali ke Menu Utama</button>';
    content += '<button onclick="downloadProducts()">Unduh Daftar Produk</button>';
    content += '<h3>Unggah Daftar Produk</h3>';
    content += '<input type="file" id="fileInput" accept=".csv" onchange="uploadProducts()" />';
    content += '<button onclick="clearAllProducts()">Hapus Semua Data Produk</button>'; 

    document.getElementById('content').innerHTML = content;
}

function formatRupiah(amount) {
    return 'Rp ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function downloadProducts() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Nama Produk,Harga Beli,Harga Jual,Stok\n"; 

    products.forEach(product => {
        const row = `${product.name},${product.buyPrice},${product.sellPrice},${product.stock}`;
        csvContent += row + "\n"; 
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "daftar_produk.csv");
    document.body.appendChild(link);

    link.click(); 
    document.body.removeChild(link); 
}

function uploadProducts() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            const contents = event.target.result;
            const rows = contents.split("\n").slice(1); 

            products = []; // Kosongkan array produk

            rows.forEach(row => {
                const data = row.split(",");

                if (data.length === 4) { // Pastikan ada 4 kolom
                    const product = {
                        name: data[0],
                        buyPrice: parseFloat(data[1]), 
                        sellPrice: parseFloat(data[2]), 
                        stock: parseInt(data[3]) 
                    };
                    products.push(product);
                }
            });

            localStorage.setItem('products', JSON.stringify(products));
            alert("Produk berhasil diunggah!");
            showProducts(); 
        };

        reader.readAsText(file); 
    } else {
        alert("Silakan pilih file untuk diunggah.");
    }
}

function clearAllProducts() {
    if (confirm("Apakah Anda yakin ingin menghapus semua data produk?")) {
        products = []; 
        localStorage.setItem('products', JSON.stringify(products)); 
        alert("Semua data produk telah dihapus!");
        showProducts(); 
    }
}

function searchProductsInList() {
    const query = document.getElementById('search').value.toLowerCase();
    const rows = document.querySelectorAll('table tr');
    rows.forEach(row => {
        const productName = row.cells[0]?.textContent.toLowerCase(); 
        if (row.rowIndex !== 0) { 
            row.style.display = productName.includes(query) ? '' : 'none';
        }
    });
}

function sortProducts() {
    products.sort((a, b) => a.name.localeCompare(b.name)); 
}

function showUpdateProduct() {
    let content = '<h2>Pilih Produk untuk Diperbarui</h2>';
    content += '<input id="searchUpdate" placeholder="Cari Produk" onkeyup="searchUpdateProducts()" />'; // Input pencarian
    content += '<table><tr><th>Nama Produk</th><th>Aksi</th></tr>';
    
    products.forEach((product, index) => {
        content += `<tr>
            <td>${product.name}</td>
            <td><button onclick="editProduct(${index})">Edit</button></td>
        </tr>`;
    });

    content += '</table><button onclick="goToMainMenu()">Kembali ke Menu Utama</button>';
    document.getElementById('content').innerHTML = content;
}

function searchUpdateProducts() {
    const query = document.getElementById('searchUpdate').value.toLowerCase();
    const rows = document.querySelectorAll('table tr');

    rows.forEach(row => {
        const productName = row.cells[0]?.textContent.toLowerCase(); // Pastikan ada cell
        if (row.rowIndex !== 0) { // Skip header row
            row.style.display = productName.includes(query) ? '' : 'none';
        }
    });
}

function editProduct(index) {
    const product = products[index];
    let content = `<h2>Edit Produk</h2>
        <input id="productName" placeholder="Nama Produk" value="${product.name}" />
        <input id="buyPrice" placeholder="Harga Beli" type="number" value="${product.buyPrice}" />
        <input id="sellPrice" placeholder="Harga Jual" type="number" value="${product.sellPrice}" />
        <input id="stock" placeholder="Stok" type="number" value="${product.stock}" />
        <button onclick="updateProduct(${index})">Update Produk</button>
        <button onclick="goToMainMenu()">Kembali ke Menu Utama</button>`;
    
    document.getElementById('content').innerHTML = content;
}

function updateProduct(index) {
    const name = document.getElementById('productName').value;
    const buyPrice = parseFloat(document.getElementById('buyPrice').value);
    const sellPrice = parseFloat(document.getElementById('sellPrice').value);
    const stock = parseInt(document.getElementById('stock').value);

    if (sellPrice < buyPrice) {
        alert('Harga jual tidak boleh lebih rendah dari harga beli!');
        return;
    }

    if (name && !isNaN(buyPrice) && !isNaN(sellPrice) && !isNaN(stock)) {
        products[index] = { name, buyPrice, sellPrice, stock };
        localStorage.setItem('products', JSON.stringify(products));
        alert('Produk berhasil diperbarui!');
        showProducts();
    } else {
        alert('Silakan lengkapi semua field!');
    }
}

function addProduct() {
    const name = document.getElementById('productName').value;
    const buyPrice = parseFloat(document.getElementById('buyPrice').value);
    const sellPrice = parseFloat(document.getElementById('sellPrice').value);
    const stock = parseInt(document.getElementById('stock').value);

    const existingProduct = products.find(product => product.name.toLowerCase() === name.toLowerCase());

    if (existingProduct) {
        alert('Produk ini sudah ada. Silakan gunakan nama yang berbeda!');
        return;
    }
    
    if (sellPrice < buyPrice) {
        alert('Harga jual tidak boleh lebih rendah dari harga beli!');
        return;
    }

    if (name && !isNaN(buyPrice) && !isNaN(sellPrice) && !isNaN(stock)) {
        products.push({ name, buyPrice, sellPrice, stock });
        localStorage.setItem('products', JSON.stringify(products));
        alert('Produk berhasil ditambahkan!');
        showProducts(); // Tampilkan daftar produk setelah penambahan
    } else {
        alert('Silakan lengkapi semua field!');
    }
}

function showAddProduct() {
    let content = `<h2>Input Produk</h2>
    <input id="productName" placeholder="Nama Produk" />
    <input id="buyPrice" placeholder="Harga Beli" type="number" />
    <input id="sellPrice" placeholder="Harga Jual" type="number" />
    <input id="stock" placeholder="Stok" type="number" />
    <button onclick="addProduct()">Tambah Produk</button>
    <button onclick="goToMainMenu()">Kembali ke Menu Utama</button>`;
    document.getElementById('content').innerHTML = content;
}

function deleteProduct(index) {
    products.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(products));
    showProducts();
}

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

function searchProducts() {
    const query = document.getElementById('search').value.toLowerCase();
    const rows = document.querySelectorAll('#salesTable tr');
    rows.forEach(row => {
        const productName = row.cells[0].textContent.toLowerCase();
        if (row.rowIndex !== 0) { 
            row.style.display = productName.includes(query) ? '' : 'none';
        }
    });
}

// Fungsi untuk mencatat penjualan
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

// Fungsi untuk mengunduh laporan penjualan harian dalam format CSV
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

// Fungsi untuk menghapus semua data penjualan harian
function clearDailySalesData() {
    if (confirm("Apakah Anda yakin ingin menghapus semua data penjualan harian?")) {
        dailySales = {}; // Reset data penjualan
        localStorage.removeItem('dailySales'); // Hapus data dari localStorage
        alert('Semua data penjualan harian telah dihapus!');
        showDailySalesReport(); // Tampilkan kembali laporan setelah penghapusan
    }
}

// Memperbarui fungsi untuk menampilkan laporan penjualan harian
function showDailySalesReport() {
    let content = '<h2>Laporan Penjualan Harian</h2>';
    content += '<table><tr><th>Tanggal</th><th>Nama Produk</th><th>Harga Jual</th></tr>';

    // Variabel untuk menghitung total
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

// Fungsi untuk menghitung dan menyimpan keuntungan
function calculateProfit(productName, profitAmount) {
    if (!profit[productName]) {
        profit[productName] = 0; // Inisialisasi jika belum ada
    }
    profit[productName] += profitAmount; // Tambahkan keuntungan baru
    localStorage.setItem('profit', JSON.stringify(profit)); // Simpan ke localStorage
}

// Fungsi untuk menampilkan keuntungan
function showProfit() {
    let content = '<h2>Keuntungan</h2><table><tr><th>Nama Produk</th><th>Keuntungan</th></tr>';
    let totalOverallProfit = 0; 

    // Ambil keuntungan dari local storage
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

// Fungsi untuk mereset keuntungan
function resetProfit() {
    if (confirm("Apakah Anda yakin ingin mereset semua data keuntungan?")) {
        profit = {}; // Reset keuntungan
        localStorage.removeItem('profit'); // Hapus data keuntungan dari localStorage
        alert('Keuntungan berhasil direset!'); // Notifikasi kepada pengguna
        showProfit(); // Tampilkan kembali laporan keuntungan setelah reset
    }
}

// Memuat data dari localStorage saat halaman dimuat
window.onload = function() {
    products = JSON.parse(localStorage.getItem('products')) || [];
    sales = JSON.parse(localStorage.getItem('sales')) || [];
    profit = JSON.parse(localStorage.getItem('profit')) || {}; // Ambil data keuntungan
    customers = JSON.parse(localStorage.getItem('customers')) || [];
    debts = JSON.parse(localStorage.getItem('debts')) || {}; // Memuat data hutang
    detailedDebts = JSON.parse(localStorage.getItem('detailedDebts')) || {}; // Memuat rincian hutang
    dailySales = JSON.parse(localStorage.getItem('dailySales')) || {}; // Memuat data penjualan harian
    showMainMenu(); // Tampilkan menu utama saat halaman dimuat
}

function generateReport() {
    let reportContent = '<h2>Laporan Penjualan</h2>';
    reportContent += '<table><tr><th>Nama Produk</th><th>Harga Jual</th><th>Jumlah Terjual</th></tr>';
    
    products.forEach(product => {
        const salesCount = sales.filter(sale => sale.productName === product.name).length;
        reportContent += `<tr><td>${product.name}</td><td>${formatRupiah(product.sellPrice)}</td><td>${salesCount}</td></tr>`;
    });

    reportContent += '</table>';
    reportContent += '<button onclick="printReport()">Cetak Laporan</button>';
    reportContent += '<button onclick="resetSales()">Reset Penjualan</button>';
    document.getElementById('content').innerHTML = reportContent;
}

function resetSales() {
    sales = []; 
    localStorage.setItem('sales', JSON.stringify(sales));
    alert('Data penjualan berhasil direset!');
    generateReport(); 
}

function printReport() {
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Laporan Penjualan</title></head><body>');
    printWindow.document.write(document.getElementById('content').innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

function printProducts() {
    let content = '<h2>Daftar Produk</h2><table><tr><th>Nama</th><th>Harga Beli</th><th>Harga Jual</th><th>Stok</th></tr>';
    
    products.forEach(product => {
        content += `<tr>
            <td>${product.name}</td>
            <td>${formatRupiah(product.buyPrice)}</td>
            <td>${formatRupiah(product.sellPrice)}</td>
            <td>${product.stock}</td>
        </tr>`;
    });

    content += '</table>';
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Daftar Produk</title></head><body>');
    printWindow.document.write(content);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

function goToMainMenu() {
    document.getElementById('content').innerHTML = '';
    document.getElementById('main-menu').style.display = 'block';
}
