function init(app, pool, hb) {
    //== Initialize helper functions.
    const { renderPartialHTML, query, renderTableData, handler} = require("./common").init(pool, hb);

    //=Constants
    const genresKeys = [ "genre_id", "name" ];
    const genresHeaders = [ "Genre ID", "Name" ];
    const genresSelectSQL = "SELECT * FROM Genres;";
    const genresInsertSQL = "INSERT INTO Genres (name) VALUES (?);";

    //== INSERT
    const genresInsertSuccess = (res, results) => query(genresSelectSQL, [])
        .then(rows => renderTableData(rows, genresHeaders, text => res.send(text)));
    const genresInsertHandler = handler(["name"], genresInsertSQL, genresInsertSuccess, logError);
    app.post("/genres/insert", genresInsertHandler);

    //== GET
    const genresGetSuccess = (res, rows) => {
        let context = {
            results_table: {headers: genresHeaders, rows},
            scripts: ["genres.js"],
            layout: "query_interface"
        };
        renderPartialHTML("views/genres.handlebars", context)
        .then(html => res.send(html));
    }
    const genresGetHandler = handler([], genresSelectSQL, genresGetSuccess, logError);
    app.get("/genres", genresGetHandler);

    //== Helper
    function logError(res, error) {
        console.log("Error: ");
        console.log(error);
        res.json(error);
    }

    console.log("Successfully init genres.js");
}

module.exports.init = init


// app.get("/genres", (req, res) => {
//     pool.query("SELECT * FROM Genres", (error, results, fields) => {
//         if (error) {
//             res.write(JSON.stringify(error));
//             res.end();
//             return;
//         }
//         let context = {};
//         context.genres = results;
//         context.title = "Genres";
//         context.scripts = ["genres.js"];
//         res.render("genres", context);
//     });
// });

// app.post('/genres/insert', (req, res) => {
//     let sql = "INSERT INTO Genres (name) VALUES (?);"
//     let values = [req.body["name"]];
//     pool.query(sql, values, (error, results, fields) => {
//         if (error) {
//             res.write(JSON.stringify(error));
//             res.end();
//             return;
//         }
//         res.json(results.json);
//     });
// });