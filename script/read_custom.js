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
