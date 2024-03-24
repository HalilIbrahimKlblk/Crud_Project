const table = document.getElementById("userTable");

    function getUserList() {
        fetch("https://jsonplaceholder.typicode.com/users")
            .then(response => response.json())
            .then(data => {
                data.forEach(user => {
                    table.innerHTML +=
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

    function showNotification(message) {
        var notification = document.createElement('div');
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '17.5%';
        notification.style.left = '22%';
        notification.style.transform = 'translate(-78%, -82.5%)';
        notification.style.backgroundColor = '#333';
        notification.style.color = '#fff';
        notification.style.padding = '10px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '9999';
        document.body.appendChild(notification);

        setTimeout(function() {
            document.body.removeChild(notification);
        }, 3000);
    }

    function createUser() {
        let id = document.getElementById("id").value.trim();
        let isim = document.getElementById("isim").value.trim();
        let soyisim = document.getElementById("soyisim").value.trim();
        let mail = document.getElementById("mail").value.trim();
        let site = document.getElementById("site").value.trim();

        //Boş olan var mı kontrolü
        if (id === "" || isim === "" || soyisim === "" || mail === "" || site === "") {
            alert("Tüm alanları doldurun!");
            return;
        }

        //Mail kontrolü
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(mail)) {
            alert("Geçersiz E-Mail adresi!");
            return;
        }

        //ID kontrolü
        if (isNaN(id) || id <= 0) {
            alert("Geçersiz ID!");
            return;
        }
        else if(id<=10){
            alert("Bu ID değerine sahip bir kullanıcı zaten var!");
            return;
        }

        //Web site kontrolü
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

                showNotification("Kullanıcı oluşturuldu.");
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

    getUserList();