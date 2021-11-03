// == SETUP
const path = require("path");
const express = require("express");
const app = express();
const PORT = 5732;
const ROOT = path.join(__dirname, "public");

// == ROUTES
let sendFile = file_name => (req, res) => res.sendFile(file_name, {root: ROOT});

app.get("/",                    sendFile("index.html"));
app.get("/home",                sendFile("index.html"));
app.get("/users",               sendFile("users.html"));
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
