function insertGenresTable(form) {
    let elements = form.elements;
    let genre_id = elements["genre_id"].value;
    let food_item_id = elements["food_item_id"].value;
    let data = { genre_id, food_item_id };
    // POST the form data to server.
    postJSON("genres_table/insert", data)
    // Refresh the page once we get a response.
    .then(_ => window.location.reload());
}

function initGenresTable() {
    override("#form_genres_table_insert", "submit", insertGenresTable);
}

window.onload = initGenresTable;
