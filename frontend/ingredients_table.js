function insertIngredientsTable(form) {
    let data = extractFormData(form, ["recipe_id", "food_item_id", "quantity"]);
    postJSON("ingredients_table/insert", data)
    .then(handleServerResponse(updateTableData, alertQueryFailure));
}

function deleteIngredientsTable(form){
    let data = extractFormData(form, ["recipe_id", "food_item_id"]);
    postJSON("ingredients_table/delete", data)
    .then(handleServerResponse(updateTableData, alertQueryFailure));
}

function initIngredientsTable() {
    initCollapsibles();
    override("#form_ingredients_table_insert", "submit", insertIngredientsTable);
    override("#form_ingredients_table_delete", "submit", deleteIngredientsTable);
}

window.onload = initIngredientsTable;
