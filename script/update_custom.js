const table = document.getElementById("userTable");

function getUserList() {
    fetch("https://jsonplaceholder.typicode.com/users")
        .then(response => response.json())
        .then(data => {
            data.forEach(user => {
                console.log(user);
                table.innerHTML+=
                '<tr>' +
                '<td>' + user.id + '</td>' +
                '<td>' + user.name + '</td>' +
                '<td>' + user.username + '</td>' +
                '<td>' + user.email + '</td>' +
                '<td>' + user.website + '</td>' +
                '</tr>';
            });
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
}

getUserList();

function createUser() {
    let id = document.getElementById("id").value.trim();
    let isim = document.getElementById("isim").value.trim();
    let soyisim = document.getElementById("soyisim").value.trim();
    let mail = document.getElementById("mail").value.trim();
    let site = document.getElementById("site").value.trim();

    if (!id || !isim || !soyisim || !mail || !site) {
        console.log("Tüm alanları doldurun!");
        return;
    }

    let data = {
        id: id,
        isim: isim,
        soyisim: soyisim,
        mail: mail,
        site: site
    };

    fetch("https://jsonplaceholder.typicode.com/users", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            table.innerHTML +=
                '<tr>' +
                '<td>' + data.id + '</td>' +
                '<td>' + data.isim + '</td>' +
                '<td>' + data.soyisim + '</td>' +
                '<td>' + data.mail + '</td>' +
                '<td>' + data.site + '</td>' +
                '</tr>';
        })
        .catch((error) => {
            console.log("Hata", error);
        });

        document.getElementById("id").value = "";
        document.getElementById("isim").value = "";
        document.getElementById("soyisim").value = "";
        document.getElementById("mail").value = "";
        document.getElementById("site").value = "";
}

createUser();

