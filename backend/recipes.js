function init(app, pool, hb) {
    //== Initialize helper functions.
    const { renderPartialHTML, query, renderTableData, handler, respondSuccess, respondError } = require("./common").init(pool, hb);

    //== Constants
    const recipesKeys = ["user_id", "food_item_id", "quantity", "prep_time"];
    const recipesHeaders = ["Recipe ID", "Creator", "Recipe Name", "Quantity", "Prep Time"];
    const recipesSelectSQL = "SELECT Recipes.recipe_id as 'Recipe ID', CONCAT(Users.first_name, ' ', Users.last_name) as 'Creator', FoodItems.name as 'Recipe Name', Recipes.quantity as 'Quantity', Recipes.prep_time as 'Prep Time' FROM Recipes JOIN Users ON Recipes.user_id = Users.user_id JOIN FoodItems on Recipes.food_item_id = FoodItems.food_item_id ORDER BY Recipes.recipe_id;";
    const recipesInsertSQL = "INSERT INTO Recipes (user_id, food_item_id, quantity, prep_time) VALUES (?, ?, ?, ?);";
    const recipesSelectGenreSQL = "SELECT Recipes.* FROM Recipes JOIN GenresTable ON GenresTable.genre_id = ? AND GenresTable.food_item_id = Recipes.food_item_id;";
    const recipesSelectFoodItemSQL = "SELECT * FROM Recipes WHERE food_item_id = ?;";
    const recipesSelectUserSQL = "SELECT * FROM Recipes WHERE user_id = ?;";
    const recipesDeleteSQL = "DELETE FROM Recipes WHERE recipe_id = ?;";
    const recipesUpdateSQL = "UPDATE Recipes SET user_id=?, food_item_id=?, quantity=?, prep_time=? WHERE recipe_id = ?;";
    const recipes_recipeidname = "SELECT Recipes.recipe_id, FoodItems.name FROM Recipes JOIN Users ON Recipes.user_id = Users.user_id JOIN FoodItems on Recipes.food_item_id = FoodItems.food_item_id ORDER BY Recipes.recipe_id;";
    const recipes_genresidname = "SELECT genre_id, name from Genres;";
    const recipes_fooditemidname = "SELECT food_item_id, name from FoodItems;";
    const recipes_useridname = "SELECT Users.user_id, CONCAT(Users.first_name, ' ', Users.last_name) FROM Users;"

    // These are queries to return names for rows that exist in the table. Ignore for now.
    // const recipes_recipeidname = "SELECT Recipes.recipe_id, FoodItems.name FROM Recipes JOIN Users ON Recipes.user_id = Users.user_id JOIN FoodItems on Recipes.food_item_id = FoodItems.food_item_id ORDER BY Recipes.recipe_id;";
    // const recipes_genresidname = "SELECT DISTINCT Genres.genre_id, Genres.name FROM Recipes JOIN FoodItems on Recipes.food_item_id = FoodItems.food_item_id JOIN GenresTable on FoodItems.food_item_id = GenresTable.food_item_id JOIN Genres on GenresTable.genre_id = Genres.genre_id;";
    // const recipes_fooditemidname = "SELECT DISTINCT FoodItems.food_item_id, FoodItems.name FROM Recipes JOIN FoodItems on Recipes.food_item_id = FoodItems.food_item_id JOIN GenresTable on FoodItems.food_item_id = GenresTable.food_item_id JOIN Genres on GenresTable.genre_id = Genres.genre_id;";
    // const recipes_useridname = "SELECT DISTINCT Users.user_id, CONCAT(Users.first_name, ' ', Users.last_name) FROM Recipes JOIN Users ON Recipes.user_id = Users.user_id JOIN FoodItems on Recipes.food_item_id = FoodItems.food_item_id ORDER BY Recipes.recipe_id;"

    //== INSERT
    const recipesInsertSuccess = (res, results) => query(recipesSelectSQL, [])
        .then(rows => renderTableData(rows, recipesHeaders, text => respondSuccess(res, text)));
    const recipesInsertHandler = handler(recipesKeys, recipesInsertSQL, recipesInsertSuccess, respondError);
    app.post("/recipes/insert", recipesInsertHandler);

    //== UPDATE
    const recipesUpdateSuccess = (res, results) => query(recipesSelectSQL, [])
        .then(rows => renderTableData(rows, recipesHeaders, text => respondSuccess(res, text)));
    const recipesUpdateHandler = handler(["user_id", "food_item_id", "quantity", "prep_time", "recipe_id"], recipesUpdateSQL, recipesUpdateSuccess, respondError);
    app.post("/recipes/update", recipesUpdateHandler);
    
    //== SELECT BY GENRE
    const recipesSelectGenreSuccess = (res, results) => renderTableData(results, recipesHeaders, text => respondSuccess(res, text));
    const recipesSelectGenreHandler = handler(["genre_id"], recipesSelectGenreSQL, recipesSelectGenreSuccess, respondError);
    app.post("/recipes/select/genre", recipesSelectGenreHandler);

    //== SELECT BY FOODITEM
    const recipesSelectFoodItemSuccess = (res, results) => renderTableData(results, recipesHeaders, text => respondSuccess(res, text));
    const recipesSelectFoodItemHandler = handler(["food_item_id"], recipesSelectFoodItemSQL, recipesSelectFoodItemSuccess, respondError);
    app.post("/recipes/select/food_item", recipesSelectFoodItemHandler);

    //== SELECT BY USER
    const recipesSelectUserSuccess = (res, results) => renderTableData(results, recipesHeaders, text => respondSuccess(res, text));
    const recipesSelectUserHandler = handler(["user_id"], recipesSelectUserSQL, recipesSelectUserSuccess, respondError);
    app.post("/recipes/select/user", recipesSelectUserHandler);

    //== DELETE
    const recipesDeleteSuccess = (res, results) => query(recipesSelectSQL, [])
        .then(rows => renderTableData(rows, recipesHeaders, text => respondSuccess(res, text)));
    const recipesDeleteHandler = handler(["recipe_id"], recipesDeleteSQL, recipesDeleteSuccess, respondError);
    app.post("/recipes/delete", recipesDeleteHandler);

    //== GET
    const recipesGetSuccess = (res, rows) => {
        let context = {
            results_table: {headers: recipesHeaders, rows},
            scripts: ["recipes.js"],
            layout: "query_interface"
        };
        renderPartialHTML("views/recipes.handlebars", context)
        .then(html => res.send(html));
    }
    const recipesGetHandler = handler([], recipesSelectSQL, recipesGetSuccess, respondError);
    app.get("/recipes", recipesGetHandler);

    //== Helper
    function logError(res, error) {
        console.log("Error: ");
        console.log(error);
        res.json(error);
    }

    console.log("Successfully init recipes.js");
}

module.exports.init = init;
