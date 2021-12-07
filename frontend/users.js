function insertUser(form) {
    let data = extractFormData(form, ["first_name", "last_name", "email"]);
    postJSON("users/insert", data)
    .then(handleServerResponse(updateTableData, alertQueryFailure));
}

function initUsers() {
    initCollapsibles();
    override("#form_users_insert", "submit", insertUser);
}

window.onload = initUsers;
