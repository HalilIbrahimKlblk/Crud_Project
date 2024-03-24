function getUserList() {
    const table = document.getElementById("userTable");
    fetch("https://jsonplaceholder.typicode.com/users")
        .then(response => response.json())
        .then(data => {
            data.forEach(user => {
                console.log(user);
                table.innerHTML+='<tr>' +
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

function searchUser() {
    const id = document.getElementById("id").value.trim();
    const isim = document.getElementById("isim").value.trim().toLowerCase();
    const tableRows = document.getElementById("userTable").getElementsByTagName("tr");

    // ID veya isim boş ise uyarı ver ve fonksiyondan çık
    if (id === "" || isim === "") {
        alert("Tüm alanları doldurun!");
        return;
    }

    if (isNaN(id) || id <= 0) {
        alert("Geçersiz ID!");
        return;
    }
    

    let found = false;
    for (let i = 0; i < tableRows.length; i++) {
        const row = tableRows[i];
        const rowData = row.getElementsByTagName("td");
        const rowId = rowData[0].innerText.trim();
        const rowName = rowData[1].innerText.trim().toLowerCase();

        if (rowId === id && rowName === isim) {
            // Eşleşme bulundu, satırı göster
            row.style.display = "";
            found = true;
        } else {
            // Eşleşme bulunamadı, satırı gizle
            row.style.display = "none";
        }
    }

    // Eğer hiçbir eşleşme bulunamadıysa
    if (!found) {
        alert("Kullanıcı bulunamadı.");
    }
   document.getElementById("isim").value = "";
   document.getElementById("id").value = "";
}
