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
        '<td class="buton-ort"><button class="button-yellow" onclick="updateUser(' + user.id + ')">Güncelle</button></td>' +
        '<td class="buton-ort"><button class="button-red" onclick="confirmDeleteUser(' + user.id + ')">Sil</button></td>' +
        '</tr>';
}

function renderUsers() {
    users.forEach(user => renderUser(user));
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
        document.getElementById("mail").value = "";
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
        getUserList();
    }
};

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

    // Form alanlarına mevcut kullanıcı bilgilerini doldur
    document.getElementById("isim").value = selectedUser.name;
    document.getElementById("soyisim").value = selectedUser.username;
    document.getElementById("mail").value = selectedUser.email;
    document.getElementById("site").value = selectedUser.website;

    // Güncelleme işlemini onaylamak için kullanıcıya bir uyarı göster
    if (confirm("Kullanıcı bilgilerini güncellemek istediğinize emin misiniz?")) {
        // Kullanıcının güncellediği bilgileri al
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
        const userTable = document.getElementById("userTable");
        const rows = userTable.getElementsByTagName("tr");
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const rowData = row.getElementsByTagName("td");
            const id = parseInt(rowData[0].innerText); // ID'yi alırken integer'a çeviriyoruz

            if (id === userId) {
                rowData[1].textContent = newName;
                rowData[2].textContent = newUsername;
                rowData[3].textContent = newEmail;
                rowData[4].textContent = newWebsite;
                break;
            }
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
    } else {
        alert("Kullanıcı güncelleme işlemi iptal edildi.");
        document.getElementById("isim").value = "";
        document.getElementById("soyisim").value = "";
        document.getElementById("mail").value = "";
        document.getElementById("site").value = "";
    }
}

function confirmDeleteUser(userId) {
    // Kullanıcıyı silme işlemini onayla
    if (confirm("Kullanıcıyı silmek istediğinize emin misiniz?")) {
        // Onay alındıysa deleteUser fonksiyonunu çağır
        deleteUser(userId);
    } else {
        // Silme işlemi iptal edildiğinde uyarı ver
        alert("Kullanıcı silme işlemi iptal edildi.");
    }
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
}

function showNotification(message) {
    alert(message);
}