function init(app, pool, hb) {
    //== Initialize helper functions.
    const { renderPartialHTML, query, renderTableData, handler} = require("./common").init(pool, hb);

    //=Constants
    const ingredients_tableKeys = [ "recipe_id", "food_item_id", "quantity" ];
    const ingredients_tableHeaders = [ "Recipe ID", "Food Item ID", "Ingredient Name", "Quantity" ];
    const ingredients_tableSelectSQL = "SELECT A.recipe_ID, A.food_item_id, C.name, A.quantity FROM IngredientsTable A JOIN Recipes B ON A.recipe_id = B.recipe_id JOIN FoodItems C ON A.food_item_id = C.food_item_id;";
    const ingredients_tableInsertSQL= "INSERT INTO IngredientsTable (recipe_id, food_item_id, quantity) VALUES (?, ?, ?);";
    const ingredients_tableDeleteSQL = "DELETE FROM IngredientsTable WHERE recipe_id = ? and food_item_id=?;";
    const ingredients_fooditemidname = "SELECT food_item_id, name FROM FoodItems;"
    const ingredients_recipeidname = "SELECT Recipes.recipe_id, FoodItems.name FROM Recipes JOIN Users ON Recipes.user_id = Users.user_id JOIN FoodItems on Recipes.food_item_id = FoodItems.food_item_id ORDER BY Recipes.recipe_id;"

    //== INSERT
    const ingredients_tableInsertSuccess = (res, results) => query(ingredients_tableSelectSQL, [])
        .then(rows => renderTableData(rows, ingredients_tableHeaders, text => res.send(text)));
    const ingredients_tableInsertHandler = handler(ingredients_tableKeys, ingredients_tableInsertSQL, ingredients_tableInsertSuccess, logError);
    app.post("/ingredients_table/insert", ingredients_tableInsertHandler);

    //== DELETE
    const ingredients_tableDeleteSuccess = (res, results) => query(ingredients_tableSelectSQL, [])
    .then(rows => renderTableData(rows, ingredients_tableHeaders, text => res.send(text)));
    const ingredients_tableDeleteHandler = handler(["recipe_id", "food_item_id"], ingredients_tableDeleteSQL, ingredients_tableDeleteSuccess, logError);
    app.post("/ingredients_table/delete", ingredients_tableDeleteHandler);

    //== GET
    const ingredients_tableGetSuccess = (res, rows) => {
        let context = {
            results_table: {headers: ingredients_tableHeaders, rows},
            scripts: ["ingredients_table.js"],
            layout: "query_interface"
        };
        renderPartialHTML("views/ingredients_table.handlebars", context)
        .then(html => res.send(html));
    }
    const ingredients_tableGetHandler = handler([], ingredients_tableSelectSQL, ingredients_tableGetSuccess, logError);
    app.get("/ingredients_table", ingredients_tableGetHandler);

    //== Helper
    function logError(res, error) {
        console.log("Error: ");
        console.log(error);
        res.json(error);
    }


    console.log("Successfully init ingredients_table.js");
}

module.exports.init = init