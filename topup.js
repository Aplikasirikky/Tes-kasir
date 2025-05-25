function updateSaldo() {
    const topupInput = document.getElementById('topupAmount');
    const topupAmount = parseInt(topupInput.value) || 0;
    
    const uangTunaiInput = document.getElementById('uangTunai');
    let currentUangTunai = parseInt(uangTunaiInput.value.replace(/\D/g, '')) || 0;

    const saldoPulsaInput = document.getElementById('saldoPulsa');
    let currentSaldoPulsa = parseInt(saldoPulsaInput.value.replace(/\D/g, '')) || 0;

    // Jika topupAmount lebih dari 0 dan uang tunai cukup
    if (topupAmount > 0 && currentUangTunai >= topupAmount) {
        currentUangTunai -= topupAmount; // Kurangi uang tunai
        currentSaldoPulsa += topupAmount; // Tambah saldo pulsa

        uangTunaiInput.value = currentUangTunai; // Update nilai uang tunai
        saldoPulsaInput.value = currentSaldoPulsa; // Update nilai saldo pulsa

        // Simpan saldo pulsa dan uang tunai ke localStorage
        saveSaldo('saldoPulsa', currentSaldoPulsa);
        saveSaldo('uangTunai', currentUangTunai);

        // Update total kas
        updateTotalKas();
    }
}