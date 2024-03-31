const table = document.getElementById("userTable");
let latestId = 0; 
let users = [];

function renderUser(user) {
    table.innerHTML +=
        '<tr>' +
        '<td>' + user.id + '</td>' +
        '<td>' + user.name + '</td>' +
        '<td>' + user.username + '</td>' +
        '<td>' + user.email + '</td>' +
        '<td>' + user.website + '</td>' +
        '<td class="buton-ort"><button class="button-yellow" onclick="confirmUpdateUser(' + user.id + ')">Güncelle</button></td>' +
        '<td class="buton-ort"><button class="button-red" onclick="deleteUser(' + user.id + ')">Sil</button></td>' +
        '</tr>';
}

function renderUsers() {
    table.innerHTML = '<tr><th>ID</th><th>Ad</th><th>Soyad</th><th>E-Mail</th><th>Web Sitesi</th></tr>';
    users.forEach(user => renderUser(user));
}

function saveUsers() {
    localStorage.setItem("users", JSON.stringify(users));
}

function getUserList() {
    fetch("https://jsonplaceholder.typicode.com/users")
        .then(response => response.json())
        .then(data => {
            data.forEach(user => {
                renderUser(user);
            });
            addStoredUsersToTable(); // Local storage'deki kullanıcıları tabloya ekle
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
}

function createUser() {
    let isim = document.getElementById("isim").value.trim();
    let soyisim = document.getElementById("soyisim").value.trim();
    let mail = document.getElementById("mail").value.trim();
    let site = document.getElementById("site").value.trim();

    // Boş olan var mı kontrolü
    if (isim === "" || soyisim === "" || mail === "" || site === "") {
        alert("Tüm alanları doldurun!");
        return;
    }

    // E-Mail kontrolü
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(mail)) {
        alert("Geçersiz E-Mail adresi!");
        return;
    }

    // Web sitesi kontrolü
    var websiteRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/\S*)?$/i;
    if (site !== "" && !websiteRegex.test(site)) {
        alert("Lütfen geçerli bir web sitesi URL'si girin.");
        return;
    }

    if (!isValidName(isim)) {
        alert("Lütfen geçerli bir isim girin.");
        return;
    }

    if (!isValidName(soyisim)) {
        alert("Lütfen geçerli bir soyisim girin.");
        return;
    }

    function isValidName(name) {
        return /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s']{2,20}$/.test(name);
    }

    let user = {
        id: ++latestId,
        name: isim,
        username: soyisim,
        email: mail,
        website: site
    };

    users.push(user);
    saveUsers();
    renderUser(user);
    alert("Kullanıcı oluşturuldu.");

    document.getElementById("isim").value = "";
    document.getElementById("soyisim").value = "";
    document.getElementById("mail").value = "";
    document.getElementById("site").value = "";
}

window.onload = function () {
    let storedUsers = JSON.parse(localStorage.getItem("users"));
    if (storedUsers) {
        users = storedUsers;
        latestId = users[users.length - 1].id;     
        renderUsers();
    } else {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(response => response.json())
            .then(data => {
                users = data.map(user => ({
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    website: user.website
                }));
                latestId = users[users.length - 1].id;
                renderUsers();
                saveUsers(); 
            })
            .catch(error => console.error('Error:', error));
    }
};

function addStoredUsersToTable() {
    let storedUsers = JSON.parse(localStorage.getItem("users"));
    if (storedUsers) {
        // API'den alınan ilk 10 kullanıcıları kontrol etmek için bir set oluştur
        const apiUserIds = new Set();

        // API'den alınan ilk 10 kullanıcıların ID'lerini set'e ekle
        document.querySelectorAll("#userTable tr").forEach(row => {
            apiUserIds.add(parseInt(row.querySelector("td:first-child").innerText));
        });

        // Local storage'dan gelen kullanıcıları eklerken API'den alınan kullanıcıları kontrol et
        storedUsers.forEach(user => {
            if (!apiUserIds.has(user.id)) {
                renderUser(user);
            }
        });
    }
}

// Sayfa yüklendiğinde yapılacak işlemler
window.onload = function () {
    // Kullanıcıları tabloya ekleyin
    getUserList();
};

function searchUserByEmailAndName() {
    const isim = document.getElementById("isim").value.trim().toLowerCase();
    const mail = document.getElementById("mail").value.trim().toLowerCase();
    const tableRows = document.getElementById("userTable").getElementsByTagName("tr");

    // İsim veya mail boş ise uyarı ver ve fonksiyondan çık
    if (isim === "" || mail === "") {
        alert("Tüm alanları doldurun!");
        return;
    }

    let found = false;
    for (let i = 0; i < tableRows.length; i++) {
        const row = tableRows[i];
        const rowData = row.getElementsByTagName("td");
        const rowName = rowData[1].innerText.trim().toLowerCase();
        const rowEmail = rowData[3].innerText.trim().toLowerCase();

        if (rowName === isim && rowEmail === mail) {
            row.style.display = "";
            found = true;
        } else {
            row.style.display = "none";
        }
    }

    // Eğer hiçbir eşleşme bulunamadıysa
    if (!found) {
        alert("Kullanıcı bulunamadı.");
    }
    document.getElementById("isim").value = "";
    document.getElementById("mail").value = "";
}

function confirmUpdateUser(userId) {
    // Güncelleme işlemini onayla
    if (confirm("Kullanıcı bilgilerini güncellemek istediğinize emin misiniz?")) {
        updateUser(userId);
    } else {
        // Güncelleme işlemi iptal edildiğinde uyarı ver
        alert("Kullanıcı güncelleme işlemi iptal edildi.");
    }
}

function updateUser(userId) {
    // Seçili kullanıcının verilerini al
    let selectedUser = null;
    const tableRows = document.getElementById("userTable").getElementsByTagName("tr");
    for (let i = 0; i < tableRows.length; i++) {
        const row = tableRows[i];
        const rowData = row.getElementsByTagName("td");
        const id = parseInt(rowData[0].innerText); // ID'yi alırken integer'a çeviriyoruz

        if (id === userId) {
            selectedUser = {
                id: id,
                name: rowData[1].textContent,
                username: rowData[2].textContent,
                email: rowData[3].textContent,
                website: rowData[4].textContent
            };
            break;
        }
    }

    if (selectedUser === null) {
        alert("Kullanıcı bulunamadı.");
        return;
    }

    // Kullanıcıyı güncellemek için uyarı penceresi göster
    const newName = prompt("Yeni ismi girin:", selectedUser.name);
    if (newName === null) { // Eğer kullanıcı iptal ederse
        alert("Güncelleme işlemi iptal edildi.");
        return;
    }

    const newUsername = prompt("Yeni kullanıcı adını girin:", selectedUser.username);
    if (newUsername === null) { // Eğer kullanıcı iptal ederse
        alert("Güncelleme işlemi iptal edildi.");
        return;
    }

    const newEmail = prompt("Yeni e-mail adresini girin:", selectedUser.email);
    if (newEmail === null) { // Eğer kullanıcı iptal ederse
        alert("Güncelleme işlemi iptal edildi.");
        return;
    }

    const newWebsite = prompt("Yeni website adresini girin:", selectedUser.website);
    if (newWebsite === null) { // Eğer kullanıcı iptal ederse
        alert("Güncelleme işlemi iptal edildi.");
        return;
    }

    // Yeni bilgilerle kullanıcıyı güncelle
    selectedUser.name = newName;
    selectedUser.username = newUsername;
    selectedUser.email = newEmail;
    selectedUser.website = newWebsite;

    // Kullanıcının satırını bul ve güncelle
    const userTable = document.getElementById("userTable");
    const rows = userTable.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowData = row.getElementsByTagName("td");
        const id = parseInt(rowData[0].innerText); // ID'yi alırken integer'a çeviriyoruz

        if (id === userId) {
            rowData[1].textContent = selectedUser.name;
            rowData[2].textContent = selectedUser.username;
            rowData[3].textContent = selectedUser.email;
            rowData[4].textContent = selectedUser.website;
            break;
        }
    }

    // Güncellenmiş kullanıcı bilgilerini local storage'a kaydet
    localStorage.setItem("user_" + userId, JSON.stringify(selectedUser));
}

function deleteUserFromLocalStorage(userId) {
    let storedUsers = JSON.parse(localStorage.getItem("users"));
    if (storedUsers) {
        // Kullanıcıyı bul ve listeden kaldır
        storedUsers = storedUsers.filter(user => user.id !== userId);
        // Güncellenmiş kullanıcı listesini localStorage'a geri kaydet
        localStorage.setItem("users", JSON.stringify(storedUsers));
    }
}

function deleteUser(userId) {
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('HTTP error, status = ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log("Kullanıcı Silindi", data);
        showNotification("Kullanıcı silindi.");
        removeFromTable(userId);
        deleteUserFromLocalStorage(userId); 
    })
    .catch((error) => console.log(error));
}

function removeFromTable(userId) {
    const tableBody = document.getElementById("userTable");
    const rows = tableBody.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
        const rowId = parseInt(rows[i].getElementsByTagName("td")[0].textContent);
        if (rowId === userId) {
            tableBody.removeChild(rows[i]); // Satırı tablodan kaldır
            break;
        }
    }
}

function showNotification(message) {
    alert(message);
}