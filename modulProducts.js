let products = JSON.parse(localStorage.getItem('products')) || [];

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

function showProducts() {
    let content = '<h2>Daftar Produk</h2>';
    content += `<input id="search" placeholder="Cari Produk" onkeyup="searchProductsInList()" />`; 
    content += '<table><tr><th>Nama</th><th>Harga Beli</th><th>Harga Jual</th><th>Stok</th><th>Aksi</th></tr>';
    
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
    });

    content += '</table>';
    content += '<button onclick="goToMainMenu()">Kembali ke Menu Utama</button>';
    content += '<button onclick="downloadProducts()">Unduh Daftar Produk</button>';
    content += '<h3>Unggah Daftar Produk</h3>';
    content += '<input type="file" id="fileInput" accept=".csv" onchange="uploadProducts()" />';
    content += '<button onclick="clearAllProducts()">Hapus Semua Data Produk</button>'; 

    document.getElementById('content').innerHTML = content;
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

function clearAllProducts() {
    if (confirm("Apakah Anda yakin ingin menghapus semua data produk?")) {
        products = []; 
        localStorage.setItem('products', JSON.stringify(products)); 
        alert("Semua data produk telah dihapus!");
        showProducts(); 
    }
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