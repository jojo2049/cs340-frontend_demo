function insertFoodItem(form) {
    let data = extractFormData(form, ["name", "calorie"]);
    postJSON("food_items/insert", data)
    .then(handleServerResponse(updateTableData, alertQueryFailure));
}

function initFoodItems() {
    initCollapsibles();
    override("#form_food_items_insert", "submit", insertFoodItem);
}

window.onload = initFoodItems;
