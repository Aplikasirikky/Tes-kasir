let users = JSON.parse(localStorage.getItem('users')) || [];

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const validUsername = "admin";
    const validPassword = "12345";

    if (username === validUsername && password === validPassword) {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('main-menu').style.display = 'block';
        document.getElementById('admin-menu').style.display = 'block';
        goToMainMenu();
    } else {
        const user = users.find(user => user.username === username && user.password === password);
        if (user) {
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('main-menu').style.display = 'block';
            goToMainMenu();
        } else {
            document.getElementById('error-message').innerText = 'Username atau password salah!';
        }
    }
}

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

function deleteUser(index) {
    users.splice(index, 1); // Hapus pengguna dari array
    localStorage.setItem('users', JSON.stringify(users)); // Simpan perubahan ke localStorage
    showUsers(); // Tampilkan ulang daftar pengguna
}