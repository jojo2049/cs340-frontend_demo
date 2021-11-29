const { renderPartialHTML, query, renderTableData, extractValues, handler} = require("./common");

function init(app, pool, hb) {
    const recipesInsertKeys = ["user_id", "food_item_id", "quantity", "prep_time"];
    const recipesInsertSQL = "INSERT INTO Recipes (user_id, food_item_id, quantity, prep_time) VALUES (?, ?, ?, ?);";
    function recipesInsertSuccess(res, results) {
        query(pool, "SELECT * FROM Recipes", [])
        .then(rows => renderTableData(hb, rows, recipesInsertKeys, text => res.send(text)));
    }

    function logError(res, error) {
        console.log("Error: ");
        console.log(error);
        res.json(error);
    }

    const recipesInsertHandler = handler(pool, recipesInsertKeys, recipesInsertSQL, recipesInsertSuccess, logError);
    app.post("/recipes/insert", recipesInsertHandler);
    

    let recipesSelectGenreSQL = "SELECT Recipes.* FROM Recipes JOIN GenresTable ON GenresTable.genre_id = ? AND GenresTable.food_item_id = Recipes.food_item_id;";
    function recipesSelectGenreSuccess(res, results) {
        renderTableData(hb, results, recipesInsertKeys, text => res.send(text));
    }
    const recipesSelectByGenreHandler = handler(pool, ["genre_id"], recipesSelectGenreSQL, recipesSelectGenreSuccess, logError);
    app.post("/recipes/select/genre", recipesSelectByGenreHandler);


    function recipesGetSuccess(res, rows) {
        let headers = recipesInsertKeys;
        let context = { results_table: {headers, rows}, layout: "query_interface", scripts: ["recipes.js"] }
        renderPartialHTML(hb, "views/recipes.handlebars", context)
        .then(html => res.send(html));
    }
    const recipesGetHandler = handler(pool, [], "SELECT * FROM Recipes", recipesGetSuccess, logError);
    app.get("/recipes", recipesGetHandler);


    console.log("Successfully init recipes.js");
}

module.exports.init = init;
