const table = document.getElementById("userTable");
let latestId = 0; 
let users = [];
let isUpdatingMode = false; 
let currentPage = 1;
const itemsPerPage = 5;

function updateOrCreateUser() {
    console.log(isUpdatingMode)
    if (isUpdatingMode) {
        updateUser(); 
    } else {
        createUser(); 
    }
}

function renderUser(user) {
    table.innerHTML +=
        '<tr>' +
        '<td>' + user.id + '</td>' +
        '<td>' + user.name + '</td>' +
        '<td>' + user.username + '</td>' +
        '<td>' + user.email + '</td>' +
        '<td>' + user.website + '</td>' +
        '<td class="buton-ort"><button class="button-yellow" onclick="updateButtonClicked(' + user.id + ')">Güncelle</button></td>' +
        '<td class="buton-ort"><button class="button-red" onclick="confirmDeleteUser(' + user.id + ')">Sil</button></td>' +
        '</tr>';
}

function renderUsers() {
    // Kullanıcıları tersine çevirerek en son eklenenden ilk eklenene doğru sırala
    users.sort((a, b) => b.id - a.id);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const usersToDisplay = users.slice(start, end);

    table.innerHTML = ""; // Clear the table first
    usersToDisplay.forEach(user => renderUser(user));
    renderPaginationControls();
}

function saveUsers() {
    localStorage.setItem("users", JSON.stringify(users));
}

function getUserList() {
    let storedUsers = JSON.parse(localStorage.getItem("users"));
    if (storedUsers) {
        users = storedUsers;
        latestId = users[users.length - 1].id;
        renderUsers();
    } else {
        fetch("https://jsonplaceholder.typicode.com/users")
            .then(response => response.json())
            .then(data => {
                data.forEach(user => {
                    user.id = ++latestId; 
                    renderUser(user);
                    users.push(user);
                });
                saveUsers(); // Kullanıcıları local storage'a kaydet
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }
}

function isEmailTaken(email) {
    return users.some(user => user.email === email);
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

    if (isEmailTaken(mail)) {
        alert("Bu e-posta adresi zaten kullanılıyor.");
        document.getElementById("isim").value = "";
        document.getElementById("soyisim").value = "";
        document.getElementById("mail").value = "";
        document.getElementById("site").value = "";
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

    // Mevcut kullanıcıların ID'lerini al
    const userIds = users.map(user => user.id);

    // En büyük ID'yi bul ve bir ekleyerek yeni bir ID oluştur
    const maxUserId = Math.max(...userIds);
    const newUserId = maxUserId + 1;

    let user = {
        id: ++latestId,
        name: isim,
        username: soyisim,
        email: mail,
        website: site
    };

    users.unshift(user);
    saveUsers();
    renderUsers(); // Tabloyu yeniden oluşturarak kullanıcıyı göster
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
        getUserList();
    }
};

function updateUser() {
    // Seçili kullanıcının verilerini al
    const userId = parseInt(document.getElementById("userId").value);
    const newName = document.getElementById("isim").value.trim();
    const newUsername = document.getElementById("soyisim").value.trim();
    const newEmail = document.getElementById("mail").value.trim();
    const newWebsite = document.getElementById("site").value.trim();

    // Girişlerin geçerliliğini kontrol et
    if (newName === "" || newUsername === "" || newEmail === "" || newWebsite === "") {
        alert("Tüm alanları doldurun!");
        return;
    }

    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(newEmail)) {
        alert("Geçersiz E-Mail adresi!");
        return;
    }

    var websiteRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/\S*)?$/i;
    if (newWebsite !== "" && !websiteRegex.test(newWebsite)) {
        alert("Lütfen geçerli bir web sitesi URL'si girin.");
        return;
    }

    // İsim ve soyisim için geçerlilik kontrolü
    if (!isValidName(newName)) {
        alert("Lütfen geçerli bir isim girin.");
        return;
    }
    if (!isValidName(newUsername)) {
        alert("Lütfen geçerli bir soyisim girin.");
        return;
    }

    // Kullanıcının satırını bul ve güncelle
    const tableRows = document.getElementById("userTable").getElementsByTagName("tr");
    let selectedUserIndex = -1;
    for (let i = 0; i < tableRows.length; i++) {
        const row = tableRows[i];
        const rowData = row.getElementsByTagName("td");
        const id = parseInt(rowData[0].innerText);

        if (id === userId) {
            selectedUserIndex = i;
            rowData[1].textContent = newName;
            rowData[2].textContent = newUsername;
            rowData[3].textContent = newEmail;
            rowData[4].textContent = newWebsite;
            break;
        }
    }

    if (selectedUserIndex === -1) {
        alert("Kullanıcı bulunamadı.");
        return;
    }

    // Güncellenmiş kullanıcı bilgilerini local storage'a kaydet
    const updatedUser = {
        id: userId,
        name: newName,
        username: newUsername,
        email: newEmail,
        website: newWebsite
    };
    localStorage.setItem("user_" + userId, JSON.stringify(updatedUser));

    // Kullanıcı listesini güncelleyin ve yerel depolamaya kaydedin
    users = users.map(user => user.id === userId ? updatedUser : user);
    saveUsers();
    alert("Kullanıcı bilgileri güncellendi.");
    document.getElementById("isim").value = "";
    document.getElementById("soyisim").value = "";
    document.getElementById("mail").value = "";
    document.getElementById("site").value = "";
    isUpdatingMode = false; // Güncelleme modunu kapat
}

function deleteUserFromLocalStorage(userId) {
    let storedUsers = JSON.parse(localStorage.getItem("users"));
    if (storedUsers) {
        storedUsers = storedUsers.filter(user => user.id !== userId);
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
        deleteUserFromLocalStorage(userId); 
        removeFromTable(userId); 
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

    // Kullanıcıyı users dizisinden de kaldır
    users = users.filter(user => user.id !== userId);
    saveUsers(); // Yerel depolamayı güncelle
}

function showNotification(message) {
    alert(message);
}

function updateButtonClicked(userId) {
    // Kullanıcının güncellediği bilgileri form alanlarına doldur
    const selectedUser = users.find(user => user.id === userId);
    document.getElementById("isim").value = selectedUser.name;
    document.getElementById("soyisim").value = selectedUser.username;
    document.getElementById("mail").value = selectedUser.email;
    document.getElementById("site").value = selectedUser.website;

    // Gizli alanı güncelle
    document.getElementById("userId").value = userId;

    // Güncelleme modunu etkinleştir
    isUpdatingMode = true; 
}

function newUserButton(){
    document.getElementById("isim").value = "";
    document.getElementById("soyisim").value = "";
    document.getElementById("mail").value = "";
    document.getElementById("site").value = "";
    isUpdatingMode = false;
}

function isValidName(name) {
    return /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s']{2,20}$/.test(name);
}

function searchUser() {
    const searchValue = document.getElementById("searchInput").value.trim().toLowerCase();
    
    // Boş arama yapılırsa uyarı ver
    if (searchValue === "") {
        alert("Lütfen bir isim girin.");
        return;
    }

    // Tüm kullanıcılar için arama yap
    const foundUsers = users.filter(user => user.name.toLowerCase().includes(searchValue));

    if (foundUsers.length === 0) {
        alert("Kullanıcı bulunamadı.");
        return;
    }

    // Kullanıcı bulunduysa, tüm sayfaları göster
    table.innerHTML = ""; // Tabloyu temizle

    foundUsers.forEach(user => renderUser(user));

    // Arama sonuçlarına göre pagination yeniden oluştur
    currentPage = 1;
    renderPaginationControls();
}

function renderPaginationControls() {
    const paginationDiv = document.getElementById("pagination");
    const totalPages = Math.ceil(users.length / itemsPerPage);
    paginationDiv.innerHTML = '';

    // Önceki sayfa butonu
    if (currentPage > 1) {
        const prevButton = document.createElement("button");
        prevButton.innerHTML = '&laquo;';
        prevButton.onclick = function() { navigatePage(-1); };
        paginationDiv.appendChild(prevButton);
    }

    // Mevcut sayfa numarası
    const pageButton = document.createElement("button");
    pageButton.innerText = currentPage;
    pageButton.classList.add('active');
    paginationDiv.appendChild(pageButton);

    // Sonraki sayfa butonu
    if (currentPage < totalPages) {
        const nextButton = document.createElement("button");
        nextButton.innerHTML = '&raquo;';
        nextButton.onclick = function() { navigatePage(1); };
        paginationDiv.appendChild(nextButton);
    }
}

function navigatePage(change) {
    currentPage += change;
    currentPage = Math.min(Math.max(currentPage, 1), Math.ceil(users.length / itemsPerPage));
    renderUsers();
}

function confirmDeleteUser(userId) {
    if (confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) {
        users = users.filter(user => user.id !== userId);
        saveUsers();
        alert("Kullanıcı silindi.");
        maintainFullPage();
    }
}

function maintainFullPage() {
    const totalUsers = users.length;
    const totalPages = Math.ceil(totalUsers / itemsPerPage);
    const lastPageUserCount = totalUsers % itemsPerPage;

    if (lastPageUserCount === 0 && totalPages < currentPage) {
        currentPage = totalPages; // Eğer son sayfa boşsa bir önceki sayfaya geç
    } else if (lastPageUserCount !== 0 && lastPageUserCount < itemsPerPage) {
        // Son sayfa dolu değilse ve sonraki sayfada kullanıcılar varsa, eksik kullanıcıları doldur
        fillCurrentPage();
    }
    renderUsers();
}

function fillCurrentPage() {
    const start = (currentPage - 1) * itemsPerPage;
    const usersToDisplay = users.slice(start, start + itemsPerPage);

    if (usersToDisplay.length < itemsPerPage) {
        const needed = itemsPerPage - usersToDisplay.length;
        const nextPageUsers = users.slice(start + itemsPerPage, start + itemsPerPage + needed);
        usersToDisplay.push(...nextPageUsers);
    }

    table.innerHTML = ""; // Tabloyu temizle
    usersToDisplay.forEach(user => renderUser(user));
}