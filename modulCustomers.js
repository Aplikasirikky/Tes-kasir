let customers = JSON.parse(localStorage.getItem('customers')) || [];
let debts = JSON.parse(localStorage.getItem('debts')) || {};
let detailedDebts = JSON.parse(localStorage.getItem('detailedDebts')) || {};

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
    let content = `<h2>Hutang untuk ${customerName}</h2>`;

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

    if (debtInfo.products.length > 0) {
        content += '<table><tr><th>Produk</th><th>Jumlah</th><th>Total Hutang</th><th>Aksi</th></tr>';
        debtInfo.products.forEach(product => {
            content += `<tr>
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

// Fungsi untuk menambahkan hutang
function addDebt(customerName, productName, amount, date) {
    const product = products.find(p => p.name === productName);
    
    if (!product || amount <= 0 || amount > product.stock) {
        alert('Jumlah hutang tidak valid!');
        return;
    }

    if (!debts[customerName]) {
        debts[customerName] = { total: 0, products: [] };
    }

    const existingDebt = debts[customerName].products.find(p => p.name === productName);
    if (existingDebt) {
        existingDebt.amount += amount;
        existingDebt.total += amount * product.sellPrice;
    } else {
        debts[customerName].products.push({ name: productName, amount: amount, total: amount * product.sellPrice });
    }

    debts[customerName].total += amount * product.sellPrice;
    product.stock -= amount;

    localStorage.setItem('debts', JSON.stringify(debts));
    localStorage.setItem('products', JSON.stringify(products));

    alert('Hutang berhasil ditambahkan!');
    viewDebts(customerName);
}

// Fungsi untuk membayar hutang
function payDebt(customerName, productName, amount, total) {
    debts[customerName].total -= total; 

    const productIndex = debts[customerName].products.findIndex(p => p.name === productName);
    if (productIndex > -1) {
        const productDebt = debts[customerName].products[productIndex];
        
        if (productDebt.amount === amount) {
            debts[customerName].products.splice(productIndex, 1);
        } else {
            productDebt.amount -= amount;
            productDebt.total -= (total / amount) * amount;
        }

        cash += total; // Tambahkan hasil pembayaran ke kas
        localStorage.setItem('cash', cash); // Simpan kas ke localStorage
        alert('Pembayaran berhasil dilakukan!');
        viewDebts(customerName);
    } else {
        alert('Produk tidak ditemukan dalam hutang.');
    }
}