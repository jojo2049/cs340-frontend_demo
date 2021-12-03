function init(app, pool, hb) {
    //== Initialize helper functions.
    const { renderPartialHTML, query, renderTableData, handler} = require("./common").init(pool, hb);

    //== Constants
    const recipesKeys = ["user_id", "food_item_id", "quantity", "prep_time"];
    const recipesHeaders = ["Recipe ID", "Creator", "Food Item Name", "Quantity", "Prep Time"];
    const recipesSelectSQL = "SELECT Recipes.recipe_id as 'Recipe ID', CONCAT(Users.first_name, ' ', Users.last_name) as 'Creator', FoodItems.name as 'Food Item Name', Recipes.quantity as 'Quantity', Recipes.prep_time as 'Prep Time' FROM Recipes JOIN Users ON Recipes.user_id = Users.user_id JOIN FoodItems on Recipes.food_item_id = FoodItems.food_item_id ORDER BY Recipes.recipe_id;";
    const recipesInsertSQL = "INSERT INTO Recipes (user_id, food_item_id, quantity, prep_time) VALUES (?, ?, ?, ?);";
    const recipesSelectGenreSQL = "SELECT Recipes.* FROM Recipes JOIN GenresTable ON GenresTable.genre_id = ? AND GenresTable.food_item_id = Recipes.food_item_id;";
    const recipesSelectFoodItemSQL = "SELECT * FROM Recipes WHERE food_item_id = ?;";
    const recipesSelectUserSQL = "SELECT * FROM Recipes WHERE user_id = ?;";
    const recipesDeleteSQL = "DELETE FROM Recipes WHERE recipe_id = ?;";
    
    //== INSERT
    const recipesInsertSuccess = (res, results) => query(recipesSelectSQL, [])
        .then(rows => renderTableData(rows, recipesHeaders, text => res.send(text)));
    const recipesInsertHandler = handler(recipesKeys, recipesInsertSQL, recipesInsertSuccess, logError);
    app.post("/recipes/insert", recipesInsertHandler);
    
    //== SELECT BY GENRE
    const recipesSelectGenreSuccess = (res, results) => renderTableData(results, recipesHeaders, text => res.send(text));
    const recipesSelectGenreHandler = handler(["genre_id"], recipesSelectGenreSQL, recipesSelectGenreSuccess, logError);
    app.post("/recipes/select/genre", recipesSelectGenreHandler);

    //== SELECT BY FOODITEM
    const recipesSelectFoodItemSuccess = (res, results) => renderTableData(results, recipesHeaders, text => res.send(text));
    const recipesSelectFoodItemHandler = handler(["food_item_id"], recipesSelectFoodItemSQL, recipesSelectFoodItemSuccess, logError);
    app.post("/recipes/select/food_item", recipesSelectFoodItemHandler);

    //== SELECT BY USER
    const recipesSelectUserSuccess = (res, results) => renderTableData(results, recipesHeaders, text => res.send(text));
    const recipesSelectUserHandler = handler(["user_id"], recipesSelectUserSQL, recipesSelectUserSuccess, logError);
    app.post("/recipes/select/user", recipesSelectUserHandler);

    //== DELETE
    const recipesDeleteSuccess = (res, results) => query(recipesSelectSQL, [])
        .then(rows => renderTableData(rows, recipesHeaders, text => res.send(text)));
    const recipesDeleteHandler = handler(["recipe_id"], recipesDeleteSQL, recipesDeleteSuccess, logError);
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
    const recipesGetHandler = handler([], recipesSelectSQL, recipesGetSuccess, logError);
    app.get("/recipes", recipesGetHandler);

    //== Helper
    function logError(res, error) {
        console.log("Error: ");
        console.log(error);
        res.json(error);
    }

    // app.post("/recipes/insert", (req, res) => {
    //     let sql = "INSERT INTO Recipes (user_id, food_item_id, quantity, prep_time) VALUES (?, ?, ?, ?);"
    //     let values = extractValues(req.body, ["user_id", "food_item_id", "quantity", "prep_time"])
    //     query(sql, values, success, failure(res));

    //     function success(result) {
    //         // Upon success, get the most up to date table data and render it.
    //         query("SELECT * FROM Recipes", [], rows => renderTableData(rows, text => res.send(text)), failure(res));
    //     }
    // });

    // app.post("/recipes/select/genre", (req, res) => {
    //     let sql = "SELECT Recipes.* FROM Recipes JOIN GenresTable ON GenresTable.genre_id = ? AND GenresTable.food_item_id = Recipes.food_item_id;"
    //     let values = extractValues(req.body, ["genre_id"]);
    //     query(sql, values, success, failure(res));

    //     function success(rows) {
    //         // Upon success, render a table with the retrieved rows.
    //         renderTableData(rows, text => res.send(text));
    //     }
    // });

    // app.get("/recipes", (req, res) => {
    //     // let sql = "SELECT * FROM Recipes";
    //     let sql = "SELECT Recipes.recipe_id as 'Recipe ID', CONCAT(Users.first_name, ' ', Users.last_name) as 'Creator', FoodItems.name as 'Food Item Name', Recipes.quantity as 'Quantity', Recipes.prep_time as 'Prep Time' FROM Recipes JOIN Users ON Recipes.user_id = Users.user_id JOIN FoodItems on Recipes.food_item_id = FoodItems.food_item_id;"
    //     query(sql, [], success, failure(res));

    //     function success(rows) {
    //         // Upon success, render the whole HTML page including an updated data table.
    //         let results_table = {
    //             headers: ["Recipe ID", "Creator", "Food Item Name", "Quantity", "Prep Time"],
    //             rows: [...rows]
    //         };
    //         let context = {results_table, layout: "query_interface", scripts: ["recipes.js"]};
    //         renderPartialHTML("views/recipes.handlebars", context)
    //         .then(html => res.send(html));
    //     }
    // });

    // app.delete("/recipes/:recipe_id", (req, res) => {
    //     let sql = "DELETE FROM Recipes WHERE recipe_id = ?;"
    //     let values = [req.params.recipe_id];
    //     query(sql, values, success, failure(res));

    //     function success(rows) {
    //         // Upon success, render a table with the retrieved rows.
    //         renderTableData(rows, text => res.send(text));
    //     }
    // });

    console.log("Successfully init recipes.js");
}

module.exports.init = init;
