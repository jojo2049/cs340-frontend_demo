function insertUser(form) {
    let elements = form.elements;
    let first_name = elements["first_name"].value;
    let last_name = elements["last_name"].value;
    let email = elements["email"].value;
    let data = { first_name, last_name, email };
    // POST the form data to server.
    postJSON("users/insert", data)
    // Refresh the page once we get a response.
    .then(_ => window.location.reload());
}

function initUsers() {
    override("#form_user_insert", "submit", insertUser);
}

window.onload = initUsers;
