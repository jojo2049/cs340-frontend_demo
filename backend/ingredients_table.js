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
          headers: ["Recipe ID", "Food Item ID", "Ingredient Name", "Quantity"],
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

  app.post('/ingredients_table/insert', (req, res) => {
    let sql = "INSERT INTO IngredientsTable (recipe_id, food_item_id, quantity) VALUES (?, ?, ?);"
    let values = [req.body["recipe_id"], req.body["food_item_id"], req.body["quantity"]];
    query(sql, values, success, failure(res))
        
    function success(result) {
        // Upon success, get the most up to date table data and render it.
        query("SELECT A.recipe_ID, A.food_item_id, C.name, A.quantity FROM IngredientsTable A JOIN Recipes B ON A.recipe_id = B.recipe_id JOIN FoodItems C ON A.food_item_id = C.food_item_id;", [], rows => renderTableData(rows, text => res.send(text)), failure(res));
    }
});

    app.get("/ingredients_table", (req, res) => {
        let sql = "SELECT A.recipe_ID, A.food_item_id, C.name, A.quantity FROM IngredientsTable A JOIN Recipes B ON A.recipe_id = B.recipe_id JOIN FoodItems C ON A.food_item_id = C.food_item_id;"
        query(sql, [], success, failure(res));

        function success(rows) {
            // Upon success, render the whole HTML page including an updated data table.
            let results_table = {
            headers: ["Recipe ID", "Food Item ID", "Ingredient Name", "Quantity"],
                rows: [...rows]
            };
            let context = {results_table, layout: "query_interface", scripts: ["ingredients_table.js"]};
            renderPartialHTML("views/ingredients_table.handlebars", context)
            .then(html => res.send(html));
        }
    });

    app.post("/ingredients_table/delete", (req, res) => {
        let sql = "DELETE FROM IngredientsTable WHERE recipe_id = ? and food_item_id=?;"
        let values = [req.body["recipe_id"], req.body["food_item_id"]];
        query(sql, values, success, failure(res))
        
        function success(result) {
            // Upon success, get the most up to date table data and render it.
            query("SELECT A.recipe_ID, A.food_item_id, C.name, A.quantity FROM IngredientsTable A JOIN Recipes B ON A.recipe_id = B.recipe_id JOIN FoodItems C ON A.food_item_id = C.food_item_id;", [], rows => renderTableData(rows, text => res.send(text)), failure(res));
        }
    });

  console.log("Successfully init ingredients_table.js");
}

module.exports.init = init;