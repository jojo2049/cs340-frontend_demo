function init(app, pool, hb) {
    // Helper function to render partial HTML fragments.
    // Returns a promise.
    function renderPartialHTML(hb_path, context) {
        let frag = hb.renderView(hb_path, context);
        return frag;
    }

    // Helper function for querying database.
    function query(sql, values, cbSuccess, cbFailure) {
        pool.query(sql, values, (error, results, fields) => {
            if (error) {
                cbFailure(error);
            }
            else {
                cbSuccess(results);
            }
        });
    }

    // Helper function for creating a newly rendered table fragment.
    function renderTableData(rows, callback) {
        let results_table = {
            headers: ["recipe_id", "user_id", "food_item_id", "quantity", "prep_time"],
            rows: [...rows]
        };
        let context = {results_table, layout: false};
        renderPartialHTML("views/partials/results_table.handlebars", context)
        .then(callback);
    }

    // Helper function, returns a list of values gathered from data.
    function extractValues(data, keys) {
        let values = [];
        for (let key of keys) {
            values.push(data[key]);
        }
        return values;
    }

    // Helper function, given a response object it returns a function.
    function failure(res) {
        return (error) => {
            console.log("Error:");
            console.log(error);
            res.json(error);
        }
    }

    app.post("/recipes/insert", (req, res) => {
        let sql = "INSERT INTO Recipes (user_id, food_item_id, quantity, prep_time) VALUES (?, ?, ?, ?);"
        let values = extractValues(req.body, ["user_id", "food_item_id", "quantity", "prep_time"])
        query(sql, values, success, failure(res));

        function success(result) {
            // Upon success, get the most up to date table data and render it.
            query("SELECT * FROM Recipes", [], rows => renderTableData(rows, text => res.send(text)), failure(res));
        }
    });

    app.post("/recipes/select/genre", (req, res) => {
        let sql = "SELECT Recipes.* FROM Recipes JOIN GenresTable ON GenresTable.genre_id = ? AND GenresTable.food_item_id = Recipes.food_item_id;"
        let values = extractValues(req.body, ["genre_id"]);
        query(sql, values, success, failure(res));

        function success(rows) {
            // Upon success, render a table with the retrieved rows.
            renderTableData(rows, text => res.send(text));
        }
    });

    app.get("/recipes", (req, res) => {
        // let sql = "SELECT * FROM Recipes";
        let sql = "SELECT Recipes.recipe_id as 'Recipe ID', Users.first_name as 'User First Name', Users.last_name as 'User Last Name', FoodItems.name as 'Food Item Name', Recipes.quantity as 'Quantity', Recipes.prep_time as 'Prep Time' FROM Recipes JOIN Users ON Recipes.user_id = Users.user_id JOIN FoodItems on Recipes.food_item_id = FoodItems.food_item_id;"
        query(sql, [], success, failure(res));

        function success(rows) {
            // Upon success, render the whole HTML page including an updated data table.
            let results_table = {
                headers: ["recipe_id", "user_id", "food_item_id", "quantity", "prep_time"],
                rows: [...rows]
            };
            let context = {results_table, layout: "query_interface", scripts: ["recipes.js"]};
            renderPartialHTML("views/recipes.handlebars", context)
            .then(html => res.send(html));
        }
    });

    // app.delete("/recipes/:recipe_id", (req, res) => {
    //     let sql = "DELETE FROM Recipes WHERE recipe_id = ?;"
    //     let values = [req.params.recipe_id
    //     pool.query(sql, values, (error, results, fields) => {
    //         if (error) {
    //             res.write(JSON.stringify(error));
    //             res.status(400);
    //             res.end();
    //             return;
    //         }else{
    //         res.status(202).end();
    //         }
    //     });
    // });

    console.log("Successfully init recipes.js");
}

module.exports.init = init;
