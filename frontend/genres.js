function insertGenres(form) {
    let data = extractFormData(form, ["name"]);
    postJSON("genres/insert", data)
    .then(res => res.json())
    .then(handleServerResponse(updateTableData, alertQueryFailure));
}


function initGenres() {
    initCollapsibles();
    override("#form_genres_insert", "submit", insertGenres);
}

window.onload = initGenres;
