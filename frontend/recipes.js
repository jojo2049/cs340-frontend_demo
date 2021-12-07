const insertRecipe = form =>
    postJSON("recipes/insert", extractFormData(form, ["user_id", "food_item_id", "quantity", "prep_time"]))
    .then(handleServerResponse(updateTableData, alertQueryFailure));

const updateRecipe = form =>
    postJSON("recipes/update", extractFormData(form, ["user_id", "food_item_id", "quantity", "prep_time", "recipe_id"]))
    .then(handleServerResponse(updateTableData, alertQueryFailure));

const selectRecipesInGenre = form => 
    postJSON("recipes/select/genre", extractFormData(form, ["genre_id"]))
    .then(handleServerResponse(updateTableData, alertQueryFailure));

const selectRecipesByFoodItem = form => 
    postJSON("recipes/select/food_item", extractFormData(form, ["food_item_id"]))
    .then(handleServerResponse(updateTableData, alertQueryFailure));

const selectRecipesByUser = form =>
    postJSON("recipes/select/user", extractFormData(form, ["user_id"]))
    .then(handleServerResponse(updateTableData, alertQueryFailure));

const deleteRecipe = form =>
    postJSON("recipes/delete", extractFormData(form, ["recipe_id"]))
    .then(handleServerResponse(updateTableData, alertQueryFailure));

function initRecipes() {
    initCollapsibles();
    override("#form_recipes_insert", "submit", insertRecipe);
    override("#form_recipes_select_genre", "submit", selectRecipesInGenre);
    override("#form_recipes_select_food_item", "submit", selectRecipesByFoodItem);
    override("#form_recipes_select_user", "submit", selectRecipesByUser);
    override("#form_recipes_delete", "submit", deleteRecipe);
    override("#form_recipes_update", "submit", updateRecipe);
}

window.onload = initRecipes;
