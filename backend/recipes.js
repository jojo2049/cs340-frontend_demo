function init(app, pool, hb) {
    //== Initialize helper functions.
    const { renderPartialHTML, query, renderTableData, handler} = require("./common").init(pool, hb);

    //== Constants
    const recipesKeys = ["user_id", "food_item_id", "quantity", "prep_time"];
    const recipesSelectSQL = "SELECT * FROM Recipes";
    const recipesInsertSQL = "INSERT INTO Recipes (user_id, food_item_id, quantity, prep_time) VALUES (?, ?, ?, ?);";
    const recipesSelectGenreSQL = "SELECT Recipes.* FROM Recipes JOIN GenresTable ON GenresTable.genre_id = ? AND GenresTable.food_item_id = Recipes.food_item_id;";
    
    //== INSERT
    const recipesInsertSuccess = (res, results) => query(pool, recipesSelectSQL, [])
        .then(rows => renderTableData(rows, recipesKeys, text => res.send(text)));
    const recipesInsertHandler = handler(recipesKeys, recipesInsertSQL, recipesInsertSuccess, logError);
    app.post("/recipes/insert", recipesInsertHandler);
    
    //== SELECT BY GENRE
    const recipesSelectGenreSuccess = (res, results) => renderTableData(results, recipesKeys, text => res.send(text));
    const recipesSelectGenreHandler = handler(["genre_id"], recipesSelectGenreSQL, recipesSelectGenreSuccess, logError);
    app.post("/recipes/select/genre", recipesSelectGenreHandler);

    //== GET
    const recipesGetSuccess = (res, rows) => {
        let context = {
            results_table: {headers: recipesKeys, rows},
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

    console.log("Successfully init recipes.js");
}

module.exports.init = init;
