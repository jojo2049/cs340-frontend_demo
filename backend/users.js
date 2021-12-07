function init(app, pool, hb) {
    //== Initialize helper functions.
    const { renderPartialHTML, query, renderTableData, handler, respondSuccess, respondError } = require("./common").init(pool, hb);

    //=Constants
    const usersKeys = [ "first_name", "last_name", "email" ];
    const usersHeaders = [ "User ID", "First Name", "Last Name", "Email" ];
    const usersSelectSQL = "SELECT * FROM Users;";
    const usersInsertSQL = "INSERT INTO Users (first_name, last_name, email) VALUES (?, ?, ?);";

    //== INSERT
    const usersInsertSuccess = (res, results) => query(usersSelectSQL, [])
        .then(rows => renderTableData(rows, usersHeaders, text => respondSuccess(res, text)));
    const usersInsertHandler = handler(usersKeys, usersInsertSQL, usersInsertSuccess, respondError);
    app.post("/users/insert", usersInsertHandler);

    //== GET
    const usersGetSuccess = (res, rows) => {
        let context = {
            results_table: {headers: usersHeaders, rows},
            scripts: ["users.js"],
            layout: "query_interface"
        };
        renderPartialHTML("views/users.handlebars", context)
        .then(html => res.send(html));
    }
    const usersGetHandler = handler([], usersSelectSQL, usersGetSuccess, respondError);
    app.get("/users", usersGetHandler);

    console.log("Successfully init users.js");
}

module.exports.init = init