function insertUser(form) {
    let data = extractFormData(form, ["first_name", "last_name", "email"]);
    postJSON("users/insert", data)
    .then(res => res.json())
    .then(data => {
        if (data.type === "success") {
            replaceInnerHTML("#container_results_table", data.payload);
        }
        else {
            alertQueryFailure(data.payload);
        }
    });
}

function initUsers() {
    override("#form_users_insert", "submit", insertUser);
}

window.onload = initUsers;
