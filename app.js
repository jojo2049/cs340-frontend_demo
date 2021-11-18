// == SETUP
const path = require("path");
const express = require("express");
// defaultLayout corresponds to main.handlebars.
const handlebars = require("express-handlebars").create({defaultLayout: "main"});
// The { pool } syntax is called destructuring.
// Lets us write:
//     const { pool } = require("./dbcon");
//     pool.query(...);
// As opposed to:
//     const dbcon = require("./dbcon");
//     dbcon.pool.query(...);
// pool is a pooled connection to the database.
const { pool } = require("./dbcon");

const PORT = 5732;
const ROOT = path.join(__dirname, "public");
const app = express();

// Tell express to use handlebars when rendering webpages.
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
// Tell express to serve static files from the public directory.
// This is only for the non-handlebar pages.
app.use(express.static("public"));


// == ROUTES

// Using handlebars for rendering and query the mysql database.
app.get("/users", (req, res) => {
    // pool is the pooled connection to the CS340 database.
    // Query the db for all users and provide a callback function.
    // Callback is executed once the database responds to our query.
    pool.query("SELECT * FROM Users", (error, results, fields) => {
        // Something went wrong...
        // Respond with the error and return.
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
            return;
        }
        // At this point we got our results.
        // Create an object called context.
        let context = {};
        // Assign some properties to it.
        // Properties assigned to context are accessable within the template.
        context.users = results;
        // res.render(template, context) where template is the
        // name of the handlebars template file to be rendered.
        // Note: don't write the file extension (.handlebars) just the name.
        // Any properties assigned to context are accessable from
        // the handlebars template using the {{prop}} syntax.
        res.render("users", context);
    });
});


// Helper function for just responding with an html file.
let sendFile = file_name => (req, res) => res.sendFile(file_name, {root: ROOT});
// TODO: Update these to handlebars
app.get("/home",                sendFile("index.html"));
// app.get("/users",               sendFile("users.html"));
app.get("/recipes",             sendFile("recipes.html"));
app.get("/food_items",          sendFile("food_items.html"));
app.get("/genres",              sendFile("genres.html"));
app.get("/ingredients_table",   sendFile("ingredients_table.html"));
app.get("/genres_table",        sendFile("genres_table.html"));
app.get("/style.css",           sendFile("style.css"));

// == LISTENER
app.listen(PORT, () => {
    console.log("Express started on http://localhost:" + PORT + "; press Ctrl-C to terminate.");
});
