function insertRecipe(form) {
    let elements = form.elements;
    let user_id = elements["user_id"].value;
    let food_item_id = elements["food_item_id"].value;
    let quantity = elements["quantity"].value;
    let prep_time = elements["prep_time"].value;
    let data = { user_id, food_item_id, quantity, prep_time };
    // POST the form data to server.
    postJSON("recipes/insert", data)
    .then(res => res.text())
    .then(text => {
        replaceInnerHTML("#container_results_table", text);
    });
}

function selectRecipesInGenre(form) {
    let elements = form.elements;
    console.log(elements)
    let genre_id = elements["genre_id"].value;
    let data = { genre_id };
    console.log("SELECT query: " + JSON.stringify(data))
    postJSON("recipes/select/genre", data)
    .then(res => res.text())
    .then(text => {
        replaceInnerHTML("#container_results_table", text);
    });
}

function initRecipes() {
    override("#form_recipes_insert", "submit", insertRecipe);
    override("#form_recipes_select_genre", "submit", selectRecipesInGenre);
}

window.onload = initRecipes;
