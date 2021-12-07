// == SETUP
const path = require("path");
const express = require("express");
const handlebars = require("express-handlebars").create(
    { layoutsDir: "views/layouts"
    , defaultLayout: "default"
    }
);
const { pool } = require("./dbcon");

const PORT = 5732;
const ROOT = path.join(__dirname, "frontend");
const app = express();

// Tell express to use handlebars when rendering webpages.
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// == ROUTES
// Redirect virtual path /static to serve files from real path /public
app.use("/static", express.static("frontend"));

let sendFile = file_name => (req, res) => res.sendFile(file_name, {root: ROOT});
app.get("/",                    sendFile("index.html"));
app.get("/home",                sendFile("index.html"));

require("./backend/recipes").init(app, pool, handlebars);
require("./backend/genres_table").init(app, pool, handlebars);
require("./backend/ingredients_table").init(app, pool, handlebars);
require("./backend/genres").init(app, pool, handlebars);
require("./backend/users").init(app, pool, handlebars);
require("./backend/food_items").init(app, pool, handlebars);

// == LISTENER
app.listen(PORT, () => {
    console.log("Express started on http://localhost:" + PORT + "; press Ctrl-C to terminate.");
});
