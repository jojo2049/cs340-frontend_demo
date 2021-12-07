function insertGenresTable(form) {
    let data = extractFormData(form, ["genre_id", "food_item_id"]);
    postJSON("genres_table/insert", data)
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

function initGenresTable() {
    override("#form_genres_table_insert", "submit", insertGenresTable);
}

window.onload = initGenresTable;
