function addUangTunai() {
    const amount = parseInt(prompt("Masukkan jumlah uang tunai yang ingin ditambahkan:"));
    
    if (!isNaN(amount) && amount > 0) {
        let currentUangTunai = parseInt(document.getElementById('uangTunai').value.replace(/\D/g, '')) || 0;
        currentUangTunai += amount;
        document.getElementById('uangTunai').value = currentUangTunai; // Update nilai uang tunai

        // Simpan uang tunai ke localStorage
        saveSaldo('uangTunai', currentUangTunai);

        // Update total kas
        updateTotalKas();
        alert("Uang tunai berhasil ditambahkan.");
    } else {
        alert("Masukkan angka yang valid.");
    }
}