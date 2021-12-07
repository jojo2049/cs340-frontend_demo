function insertGenres(form) {
    let data = extractFormData(form, ["name"]);
    postJSON("genres/insert", data)
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


function initGenres() {
    override("#form_genres_insert", "submit", insertGenres);
}

window.onload = initGenres;
