function goToMainMenu() {
    document.getElementById('content').innerHTML = '';
    document.getElementById('main-menu').style.display = 'block';
}

// Memuat data dari localStorage saat halaman dimuat
window.onload = function() {
    products = JSON.parse(localStorage.getItem('products')) || [];
    sales = JSON.parse(localStorage.getItem('sales')) || [];
    profit = JSON.parse(localStorage.getItem('profit')) || {}; 
    customers = JSON.parse(localStorage.getItem('customers')) || [];
    debts = JSON.parse(localStorage.getItem('debts')) || {};
    detailedDebts = JSON.parse(localStorage.getItem('detailedDebts')) || {}; 
    dailySales = JSON.parse(localStorage.getItem('dailySales')) || {};
    
    showMainMenu(); // Tampilkan menu utama saat halaman dimuat
}