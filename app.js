// == SETUP
const path = require("path");
const express = require("express");
// defaultLayout corresponds to main.handlebars.
const handlebars = require("express-handlebars").create({defaultLayout: "default"});
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
app.use(express.urlencoded({extended: true}));
// Express will handle decoding of form JSON data.
// This automatically parses JSON encoded form data into req.body
app.use(express.json());
// Redirect virtual path /static to serve files from real path /public.
app.use("/static", express.static("public"));


// == ROUTES

app.post('/users/insert', (req, res) => {
    // SQL query.
    // The '?' will be replaced, in order, with the values in the list passed to pool.query.
    let sql = "INSERT INTO Users (first_name, last_name, email) VALUES (?, ?, ?);"
    // Values to safely insert into the SQL query.
    let values = [req.body["first_name"], req.body["last_name"], req.body["email"]];
    console.log("Insert: " + values);
    pool.query(sql, values, (error, results, fields) => {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
            return;
        }
        res.json(results.json);
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
        context.title = "Users";
        context.scripts = ["users.js"];
        // res.render(template, context) where template is the
        // name of the handlebars template file to be rendered.
        // Note: don't write the file extension (.handlebars) just the name.
        // Any properties assigned to context are accessable from
        // the handlebars template using the {{prop}} syntax.
        res.render("users", context);
    });
});

app.post('/food_items/insert', (req, res) => {
    let sql = "INSERT INTO FoodItems (name, calorie) VALUES (?, ?);"
    let values = [req.body["name"], req.body["calorie"]];
    pool.query(sql, values, (error, results, fields) => {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
            return;
        }
        res.json(results.json);
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
        context.title = "FoodItems";
        context.scripts = ["food_items.js"];
        res.render("food_items", context);
    });
});


app.post('/recipes/insert', (req, res) => {
    let sql = "INSERT INTO Recipes (user_id, food_item_id, quantity, prep_time) VALUES (?, ?, ?, ?);"
    let values = [req.body["user_id"], req.body["food_item_id"], req.body["quantity"], req.body["prep_time"]];
    pool.query(sql, values, (error, results, fields) => {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
            return;
        }
        res.json(results.json);
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
        context.title = "Recipes";
        context.scripts = ["recipes.js"];
        res.render("recipes", context);
    });
});

app.post('/genres/insert', (req, res) => {
    let sql = "INSERT INTO Genres (name) VALUES (?);"
    let values = [req.body["name"]];
    pool.query(sql, values, (error, results, fields) => {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
            return;
        }
        res.json(results.json);
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
        context.title = "Genres";
        context.scripts = ["genres.js"];
        res.render("genres", context);
    });
});

app.post('/genres_table/insert', (req, res) => {
    let sql = "INSERT INTO GenresTable (genre_id, food_item_id) VALUES (?, ?);"
    let values = [req.body["genre_id"], req.body["food_item_id"]];
    pool.query(sql, values, (error, results, fields) => {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
            return;
        }
        res.json(results.json);
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
        context.title = "GenresTable";
        context.scripts = ["genres_table.js"];
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
app.get("/genres",              sendFile("genres.html"));
app.get("/ingredients_table",   sendFile("ingredients_table.html"));
app.get("/genres_table",        sendFile("genres_table.html"));
app.get("/style.css",           sendFile("style.css"));

// == LISTENER
app.listen(PORT, () => {
    console.log("Express started on http://localhost:" + PORT + "; press Ctrl-C to terminate.");
});
