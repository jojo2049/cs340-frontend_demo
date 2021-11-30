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

function selectRecipesByFoodItem(form) {
    let elements = form.elements;
    console.log(elements)
    let food_item_id = elements["food_item_id"].value;
    let data = { food_item_id };
    console.log("SELECT query: " + JSON.stringify(data))
    postJSON("recipes/select/food_item", data)
    .then(res => res.text())
    .then(text => {
        replaceInnerHTML("#container_results_table", text);
    });
}

function selectRecipesByUser(form) {
    let elements = form.elements;
    console.log(elements)
    let user_id = elements["user_id"].value;
    let data = { user_id };
    console.log("SELECT query: " + JSON.stringify(data))
    postJSON("recipes/select/user", data)
    .then(res => res.text())
    .then(text => {
        replaceInnerHTML("#container_results_table", text);
    });
}

function deleteRecipe(form){
  let elements = form.elements;
  console.log(elements)
  let recipe_id = elements["recipe_id"].value;
  let data = { recipe_id };
  // POST the form data to server.
  postJSON("recipes/delete", data)
  .then(res => res.text())
  .then(text => {
      replaceInnerHTML("#container_results_table", text);
  })
}

function initRecipes() {
    override("#form_recipes_insert", "submit", insertRecipe);
    override("#form_recipes_select_genre", "submit", selectRecipesInGenre);
    override("#form_recipes_select_food_item", "submit", selectRecipesByFoodItem);
    override("#form_recipes_select_user", "submit", selectRecipesByUser);
    override("#form_recipes_delete", "submit", deleteRecipe);
}




window.onload = initRecipes;
