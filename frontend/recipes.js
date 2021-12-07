function insertRecipe(form) {
    let data = extractFormData(form, ["user_id", "food_item_id", "quantity", "prep_time"]);
    postJSON("recipes/insert", data)
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

function updateRecipe(form) {
    let data = extractFormData(form, ["user_id", "food_item_id", "quantity", "prep_time", "recipe_id"]);
    postJSON("recipes/update", data)
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

function selectRecipesInGenre(form) {
    let data = extractFormData(form, ["genre_id"]);
    postJSON("recipes/select/genre", data)
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

function selectRecipesByFoodItem(form) {
    let data = extractFormData(form, ["food_item_id"]);
    postJSON("recipes/select/food_item", data)
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

function selectRecipesByUser(form) {
    let data = extractFormData(form, ["user_id"]);
    postJSON("recipes/select/user", data)
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

function deleteRecipe(form){
    let data = extractFormData(form, ["recipe_id"]);
    postJSON("recipes/delete", data)
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

function initRecipes() {
    override("#form_recipes_insert", "submit", insertRecipe);
    override("#form_recipes_select_genre", "submit", selectRecipesInGenre);
    override("#form_recipes_select_food_item", "submit", selectRecipesByFoodItem);
    override("#form_recipes_select_user", "submit", selectRecipesByUser);
    override("#form_recipes_delete", "submit", deleteRecipe);
    override("#form_recipes_update", "submit", updateRecipe);
}




window.onload = initRecipes;
