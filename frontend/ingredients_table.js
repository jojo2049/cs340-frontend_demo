function insertIngredientsTable(form) {
    let data = extractFormData(form, ["recipe_id", "food_item_id", "quantity"]);
    postJSON("ingredients_table/insert", data)
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

function deleteIngredientsTable(form){
    let data = extractFormData(form, ["recipe_id", "food_item_id"]);
    postJSON("ingredients_table/delete", data)
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

function initIngredientsTable() {
    override("#form_ingredients_table_insert", "submit", insertIngredientsTable);
    override("#form_ingredients_table_delete", "submit", deleteIngredientsTable);
}

window.onload = initIngredientsTable;
