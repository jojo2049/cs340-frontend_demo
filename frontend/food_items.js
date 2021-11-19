function insertFoodItem(form) {
    let elements = form.elements;
    let name = elements["name"].value;
    let calorie = elements["calories"].value;
    let data = { name, calorie };
    // POST the form data to server.
    postJSON("food_items/insert", data)
    // Refresh the page once we get a response.
    .then(_ => window.location.reload());
}

function initFoodItems() {
    override("#form_food_items_insert", "submit", insertFoodItem);
}

window.onload = initFoodItems;
