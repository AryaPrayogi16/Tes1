// Contoh data user
const users = [
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'user', password: 'user123', role: 'user' }
];

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginMessage = document.getElementById('loginMessage');

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        loginMessage.style.color = 'green';
        loginMessage.textContent = `Login berhasil! Selamat datang, ${user.username} (Role: ${user.role})`;
        if (user.role === 'admin') {
            // Request data ke API jika admin
            fetch('http://192.168.254.252:5039/api/monitoring/attendance', {
                method: 'POST',
                headers: {
                    'X-SAP-Username': 'basis',
                    'X-SAP-Password': '123itthebest',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    pernr: '10007777',
                    begda: '01.01.2026',
                    endda: '27.01.2026'
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Data API:', data);
                // Tampilkan data hasil API dalam bentuk tabel
                function createTableFromObject(obj) {
                    const table = document.createElement('table');
                    table.style.borderCollapse = 'collapse';
                    table.style.marginBottom = '16px';
                    for (const key in obj) {
                        if (Object.prototype.hasOwnProperty.call(obj, key)) {
                            const row = document.createElement('tr');
                            const cellKey = document.createElement('td');
                            cellKey.textContent = key;
                            cellKey.style.fontWeight = 'bold';
                            cellKey.style.border = '1px solid #ccc';
                            cellKey.style.padding = '4px 8px';
                            const cellValue = document.createElement('td');
                            cellValue.textContent = obj[key];
                            cellValue.style.border = '1px solid #ccc';
                            cellValue.style.padding = '4px 8px';
                            row.appendChild(cellKey);
                            row.appendChild(cellValue);
                            table.appendChild(row);
                        }
                    }
                    return table;
                }
                loginMessage.appendChild(document.createElement('br'));
                // Periksa jika data adalah objek dengan properti 'data' berupa array
                if (data && Array.isArray(data.data)) {
                    data.data.forEach(item => {
                        loginMessage.appendChild(createTableFromObject(item));
                    });
                } else if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
                    data.forEach(item => {
                        loginMessage.appendChild(createTableFromObject(item));
                    });
                } else if (typeof data === 'object' && data !== null) {
                    loginMessage.appendChild(createTableFromObject(data));
                } else {
                    // Jika data bukan objek/array objek, tampilkan apa adanya
                    loginMessage.appendChild(document.createTextNode(data));
                }
            })
            .catch(error => {
                loginMessage.appendChild(document.createElement('br'));
                loginMessage.appendChild(document.createTextNode('Gagal mengambil data API: ' + error));
            });
        }
    } else {
        loginMessage.style.color = 'red';
        loginMessage.textContent = 'Username atau password salah!';
    }
});
