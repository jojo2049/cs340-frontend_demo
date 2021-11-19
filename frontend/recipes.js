function insertRecipe(form) {
    let elements = form.elements;
    let user_id = elements["user_id"].value;
    let food_item_id = elements["food_item_id"].value;
    let quantity = elements["quantity"].value;
    let prep_time = elements["prep_time"].value;
    let data = { user_id, food_item_id, quantity, prep_time };
    // POST the form data to server.
    postJSON("recipes/insert", data)
    // Refresh the page once we get a response.
    .then(_ => window.location.reload());
}

function initRecipes() {
    override("#form_recipes_insert", "submit", insertRecipe);
}

window.onload = initRecipes;
