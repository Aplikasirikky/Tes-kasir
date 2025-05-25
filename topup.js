function addTopup() {
    const amount = parseInt(prompt("Masukkan jumlah untuk diisi ke Saldo Pulsa:"));
    
    if (!isNaN(amount) && amount > 0) {
        let currentUangTunai = parseInt(document.getElementById('uangTunai').value.replace(/\D/g, '')) || 0;
        
        // Cek apakah uang tunai cukup
        if (currentUangTunai >= amount) {
            currentUangTunai -= amount; // Mengurangi uang tunai
            document.getElementById('uangTunai').value = currentUangTunai; // Update nilai uang tunai
            
            let currentSaldoPulsa = parseInt(document.getElementById('saldoPulsa').value.replace(/\D/g, '')) || 0;
            currentSaldoPulsa += amount; // Menambah saldo pulsa
            document.getElementById('saldoPulsa').value = currentSaldoPulsa; // Update nilai saldo pulsa
            
            // Simpan saldo pulsa dan uang tunai ke localStorage
            saveSaldo('saldoPulsa', currentSaldoPulsa);
            saveSaldo('uangTunai', currentUangTunai);
            
            // Update total kas
            updateTotalKas();
            alert("Saldo pulsa berhasil ditambahkan.");
        } else {
            alert("Uang tunai tidak cukup untuk melakukan top-up.");
        }
    } else {
        alert("Masukkan angka yang valid.");
    }
}