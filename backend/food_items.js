function init(app, pool, hb) {
    //== Initialize helper functions.
    const { renderPartialHTML, query, renderTableData, handler} = require("./common").init(pool, hb);

    //=Constants
    const food_itemsKeys = [ "name", "calorie" ];
    const food_itemsHeaders = [ "FoodItem ID", "Name", "Calories" ];
    const food_itemsSelectSQL = "SELECT * FROM FoodItems;";
    const food_itemsInsertSQL = "INSERT INTO FoodItems (name, calorie) VALUES (?, ?);";

    //== INSERT
    const food_itemsInsertSuccess = (res, results) => query(food_itemsSelectSQL, [])
        .then(rows => renderTableData(rows, food_itemsHeaders, text => res.send(text)));
    const food_itemsInsertHandler = handler(food_itemsKeys, food_itemsInsertSQL, food_itemsInsertSuccess, logError);
    app.post("/food_items/insert", food_itemsInsertHandler);

    //== GET
    const food_itemsGetSuccess = (res, rows) => {
        let context = {
            results_table: {headers: food_itemsHeaders, rows},
            scripts: ["food_items.js"],
            layout: "query_interface"
        };
        renderPartialHTML("views/food_items.handlebars", context)
        .then(html => res.send(html));
    }
    const food_itemsGetHandler = handler([], food_itemsSelectSQL, food_itemsGetSuccess, logError);
    app.get("/food_items", food_itemsGetHandler);

    //== Helper
    function logError(res, error) {
        console.log("Error: ");
        console.log(error);
        res.json(error);
    }

    console.log("Successfully init food_items.js");
}

module.exports.init = init