function insertGenresTable(form) {
    let data = extractFormData(form, ["genre_id", "food_item_id"]);
    postJSON("genres_table/insert", data)
    .then(handleServerResponse(updateTableData, alertQueryFailure));
}

function initGenresTable() {
    initCollapsibles();
    override("#form_genres_table_insert", "submit", insertGenresTable);
}

window.onload = initGenresTable;
