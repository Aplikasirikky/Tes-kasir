let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

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

function formatRupiah(amount) {
    return 'Rp ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}