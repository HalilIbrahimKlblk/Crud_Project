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

function showNotification(message) {
    var notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '14.5%';
    notification.style.left = '50%';
    notification.style.transform = 'translate(-85.5%, -50%)';
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

function deleteUser() {
    const id = document.getElementById('id').value;

    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
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
            removeFromTable(id);
        })
        .catch((error) => console.log(error));

        document.getElementById("id").value = "";
        document.getElementById("isim").value = "";
        document.getElementById("soyisim").value = "";
}

function removeFromTable(id) {
    const tableBody = document.getElementById("userTable");
    const rows = tableBody.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
        const rowId = rows[i].getElementsByTagName("td")[0].textContent;
        if (rowId == id) {
            tableBody.removeChild(rows[i]); 
            break;
        }
    }
}