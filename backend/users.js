function init(app, pool, hb) {
    //== Initialize helper functions.
    const { renderPartialHTML, query, renderTableData, handler} = require("./common").init(pool, hb);

    //=Constants
    const usersKeys = [ "first_name", "last_name", "email" ];
    const usersHeaders = [ "User ID", "First Name", "Last Name", "Email" ];
    const usersSelectSQL = "SELECT * FROM Users;";
    const usersInsertSQL = "INSERT INTO Users (first_name, last_name, email) VALUES (?, ?, ?);";

    //== INSERT
    const usersInsertSuccess = (res, results) => query(usersSelectSQL, [])
        .then(rows => renderTableData(rows, usersHeaders, text => res.send(text)));
    const usersInsertHandler = handler(usersKeys, usersInsertSQL, usersInsertSuccess, logError);
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
    const usersGetHandler = handler([], usersSelectSQL, usersGetSuccess, logError);
    app.get("/users", usersGetHandler);

    //== Helper
    function logError(res, error) {
        console.log("Error: ");
        console.log(error);
        res.json(error);
    }

    console.log("Successfully init users.js");
}

module.exports.init = init


// app.post('/users/insert', (req, res) => {
//     // SQL query.
//     // The '?' will be replaced, in order, with the values in the list passed to pool.query.
//     let sql = "INSERT INTO Users (first_name, last_name, email) VALUES (?, ?, ?);"
//     // Values to safely insert into the SQL query.
//     let values = [req.body["first_name"], req.body["last_name"], req.body["email"]];
//     pool.query(sql, values, (error, results, fields) => {
//         if (error) {
//             res.write(JSON.stringify(error));
//             res.end();
//             return;
//         }
//         res.json(results.json);
//     });
// });

// // Using handlebars for rendering and query the mysql database.
// app.get("/users", (req, res) => {
//     // pool is the pooled connection to the CS340 database.
//     // Query the db for all users and provide a callback function.
//     // Callback is executed once the database responds to our query.
//     pool.query("SELECT * FROM Users", (error, results, fields) => {
//         // Something went wrong...
//         // Respond with the error and return.
//         if (error) {
//             res.write(JSON.stringify(error));
//             res.end();
//             return;
//         }
//         // At this point we got our results.
//         // Create an object called context.
//         let context = {};
//         // Assign some properties to it.
//         // Properties assigned to context are accessable within the template.
//         context.users = results;
//         context.title = "Users";
//         context.scripts = ["users.js"];
//         // res.render(template, context) where template is the
//         // name of the handlebars template file to be rendered.
//         // Note: don't write the file extension (.handlebars) just the name.
//         // Any properties assigned to context are accessable from
//         // the handlebars template using the {{prop}} syntax.
//         res.render("users", context);
//     });
// });