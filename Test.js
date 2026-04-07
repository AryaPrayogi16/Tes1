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
                // --- FITUR PAGINATION & SEARCH ---
                let allData = [];
                if (data && Array.isArray(data.data)) {
                    allData = data.data;
                } else if (Array.isArray(data)) {
                    allData = data;
                } else if (typeof data === 'object' && data !== null) {
                    allData = [data];
                }
                const pageSize = 5;
                let currentPage = 1;
                let filteredData = allData;

                const loginMessage = document.getElementById('loginMessage');
                const searchContainer = document.getElementById('searchContainer');
                const searchInput = document.getElementById('searchInput');
                const paginationDiv = document.getElementById('pagination');
                searchContainer.style.display = 'block';
                paginationDiv.style.display = 'block';

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

                function renderTable(page = 1) {
                    loginMessage.innerHTML = '';
                    const start = (page - 1) * pageSize;
                    const end = start + pageSize;
                    const pageData = filteredData.slice(start, end);
                    if (pageData.length === 0) {
                        loginMessage.textContent = 'Data tidak ditemukan.';
                        return;
                    }
                    pageData.forEach(item => {
                        loginMessage.appendChild(createTableFromObject(item));
                    });
                }

                function renderPagination() {
                    paginationDiv.innerHTML = '';
                    const totalPages = Math.ceil(filteredData.length / pageSize);
                    if (totalPages <= 1) return;
                    for (let i = 1; i <= totalPages; i++) {
                        const btn = document.createElement('button');
                        btn.textContent = i;
                        btn.style.margin = '0 4px';
                        btn.style.padding = '6px 12px';
                        btn.style.borderRadius = '4px';
                        btn.style.border = '1px solid #b0c4de';
                        btn.style.background = (i === currentPage) ? '#2a5298' : '#fff';
                        btn.style.color = (i === currentPage) ? '#fff' : '#2a5298';
                        btn.style.cursor = 'pointer';
                        btn.onclick = () => {
                            currentPage = i;
                            renderTable(currentPage);
                            renderPagination();
                        };
                        paginationDiv.appendChild(btn);
                    }
                }

                searchInput.value = '';
                searchInput.oninput = function() {
                    const q = searchInput.value.trim().toLowerCase();
                    filteredData = allData.filter(obj =>
                        Object.values(obj).some(val => String(val).toLowerCase().includes(q))
                    );
                    currentPage = 1;
                    renderTable(currentPage);
                    renderPagination();
                };

                renderTable(currentPage);
                renderPagination();
                // --- END FITUR PAGINATION & SEARCH ---
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
