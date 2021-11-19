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
// Express will handle url decoding of form POST data.
// This automatically parses url encoded form data into req.body
app.use(express.urlencoded({extended: true}));
app.use(express.json());


// == ROUTES

app.post('/users-insert', function(req, res) {
    console.log("insert user");
    console.log(req.body);
    let sql = "INSERT INTO Users (first_name, last_name, email) VALUES (?, ?, ?);"
    pool.query(sql, [req.body["first_name"], req.body["last_name"], req.body["email"]], (error, results, fields) => {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
            return;
        }
        console.log(results);
        res.end();
    });
});

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

app.get("/food_items", (req, res) => {
    pool.query("SELECT * FROM FoodItems", (error, results, fields) => {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
            return;
        }
        let context = {};
        context.food_items = results;
        res.render("food_items", context);
    });
});

app.get("/recipes", (req, res) => {
    pool.query("SELECT * FROM Recipes", (error, results, fields) => {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
            return;
        }
        let context = {};
        context.recipes = results;
        res.render("recipes", context);
    });
});

app.get("/genres", (req, res) => {
    pool.query("SELECT * FROM Genres", (error, results, fields) => {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
            return;
        }
        let context = {};
        context.genres = results;
        res.render("genres", context);
    });
});

app.get("/ingredients_table", (req, res) => {
    pool.query("SELECT * FROM IngredientsTable", (error, results, fields) => {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
            return;
        }
        let context = {};
        context.ingredients_table = results;
        res.render("ingredients_table", context);
    });
});

app.get("/genres_table", (req, res) => {
    pool.query("SELECT * FROM GenresTable", (error, results, fields) => {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
            return;
        }
        let context = {};
        context.genres_table = results;
        res.render("genres_table", context);
    });
});

// Helper function for just responding with an html file.
let sendFile = file_name => (req, res) => res.sendFile(file_name, {root: ROOT});
// TODO: Update these to handlebars
app.get("/home",                sendFile("index.html"));
// app.get("/users",               sendFile("users.html"));
// app.get("/recipes",             sendFile("recipes.html"));
// app.get("/food_items",          sendFile("food_items.html"));
// app.get("/genres",              sendFile("genres.html"));
// app.get("/ingredients_table",   sendFile("ingredients_table.html"));
// app.get("/genres_table",        sendFile("genres_table.html"));
app.get("/style.css",           sendFile("style.css"));

// == LISTENER
app.listen(PORT, () => {
    console.log("Express started on http://localhost:" + PORT + "; press Ctrl-C to terminate.");
});
