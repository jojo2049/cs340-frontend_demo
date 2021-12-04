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