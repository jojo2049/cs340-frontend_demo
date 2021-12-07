function init(app, pool, hb) {
    //== Initialize helper functions.
    const { renderPartialHTML, query, renderTableData, handler, respondSuccess, respondError } = require("./common").init(pool, hb);

    //=Constants
    const genres_tableKeys = [ "genre_id", "food_item_id" ];
    const genres_tableHeaders = [ "Genre", "Food Item" ];
    const genres_tableSelectSQL = "SELECT Genres.name as 'Genre Name', FoodItems.name as 'FoodItem Name' FROM GenresTable JOIN Genres ON GenresTable.genre_id = Genres.genre_id JOIN FoodItems ON GenresTable.food_item_id = FoodItems.food_item_id ORDER By Genres.name;";
    const genres_tableInsertSQL= "INSERT INTO GenresTable (genre_id, food_item_id) VALUES (?, ?);";
    const genres_genreidname = "SELECT genre_id, name from Genres;";
    const genres_fooditemidname = "SELECT food_item_id, name from FoodItems;";

    //== INSERT
    const genres_tableInsertSuccess = (res, results) => query(genres_tableSelectSQL, [])
        .then(rows => renderTableData(rows, genres_tableHeaders, text => respondSuccess(res, text)));
    const genres_tableInsertHandler = handler(genres_tableKeys, genres_tableInsertSQL, genres_tableInsertSuccess, respondError);
    app.post("/genres_table/insert", genres_tableInsertHandler);

    //== GET
    const genres_tableGetSuccess = (res, rows) => {
        let context = {
            results_table: {headers: genres_tableHeaders, rows},
            scripts: ["genres_table.js"]
        };
        renderPartialHTML("views/genres_table.handlebars", context)
        .then(html => res.send(html));
    }
    const genres_tableGetHandler = handler([], genres_tableSelectSQL, genres_tableGetSuccess, respondError);
    app.get("/genres_table", genres_tableGetHandler);

    console.log("Successfully init genres_table.js");
}

module.exports.init = init