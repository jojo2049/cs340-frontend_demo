function insertFoodItem(form) {
    let data = extractFormData(form, ["name", "calorie"]);
    postJSON("food_items/insert", data)
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

function initFoodItems() {
    override("#form_food_items_insert", "submit", insertFoodItem);
}

window.onload = initFoodItems;
