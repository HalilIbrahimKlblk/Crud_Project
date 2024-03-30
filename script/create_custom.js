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
        '</tr>';
}

function renderUsers() {
    table.innerHTML = '<tr><th>ID</th><th>Ad</th><th>Soyad</th><th>E-Mail</th><th>Web Sitesi</th></tr>';
    users.forEach(user => renderUser(user));
}

function saveUsers() {
    localStorage.setItem("users", JSON.stringify(users));
}

function showNotification(message) {
    var notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '20%';
    notification.style.left = '22%';
    notification.style.transform = 'translate(-78%, -80%)';
    notification.style.backgroundColor = '#333';
    notification.style.color = '#fff';
    notification.style.padding = '10px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '9999';
    document.body.appendChild(notification);

    setTimeout(function () {
        document.body.removeChild(notification);
    }, 3000);
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
    showNotification("Kullanıcı oluşturuldu.");

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
