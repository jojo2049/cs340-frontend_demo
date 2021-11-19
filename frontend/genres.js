function insertUser(form) {
    let elements = form.elements;
    let name = elements["name"].value;
    let data = { name };
    // POST the form data to server.
    postJSON("genres/insert", data)
    // Refresh the page once we get a response.
    .then(_ => window.location.reload());
}

function initUsers() {
    override("#form_genres_insert", "submit", insertUser);
}

window.onload = initUsers;
