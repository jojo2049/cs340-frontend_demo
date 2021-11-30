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
          headers: ["Genre", "FoodItem"],
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

  app.post("/genres_table/insert", (req, res) => {
      let sql = "INSERT INTO GenresTable (genre_id, food_item_id) VALUES (?, ?);"
      let values = [req.body["genre_id"], req.body["food_item_id"]];
      query(sql, values, success, failure(res));

      function success(result) {
          // Upon success, get the most up to date table data and render it.
          query("SELECT Genres.name as 'Genre Name', FoodItems.name as 'FoodItem Name' FROM GenresTable JOIN Genres ON GenresTable.genre_id = Genres.genre_id JOIN FoodItems ON GenresTable.food_item_id = FoodItems.food_item_id;", [], rows => renderTableData(rows, text => res.send(text)), failure(res));
      }
  });


  app.get("/genres_table", (req, res) => {
      let sql = "SELECT Genres.name as 'Genre Name', FoodItems.name as 'FoodItem Name' FROM GenresTable JOIN Genres ON GenresTable.genre_id = Genres.genre_id JOIN FoodItems ON GenresTable.food_item_id = FoodItems.food_item_id;"
      query(sql, [], success, failure(res));

      function success(rows) {
          // Upon success, render the whole HTML page including an updated data table.
          let results_table = {
            headers: ["Genre", "FoodItem"],
              rows: [...rows]
          };
          let context = {results_table, layout: "query_interface", scripts: ["genres_table.js"]};
          renderPartialHTML("views/genres_table.handlebars", context)
          .then(html => res.send(html));
      }
  });

  console.log("Successfully init genres_table.js");
}

module.exports.init = init;