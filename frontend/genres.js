function insertGenres(form) {
    let elements = form.elements;
    let name = elements["name"].value;
    let data = { name };
    // POST the form data to server.
    postJSON("genres/insert", data)
    // Refresh the page once we get a response.
    // .then(_ => window.location.reload());
    .then(res => res.text())
    .then(text => {
        replaceInnerHTML("#container_results_table", text);
    });
}


function initGenres() {
    override("#form_genres_insert", "submit", insertGenres);
}

window.onload = initGenres;
