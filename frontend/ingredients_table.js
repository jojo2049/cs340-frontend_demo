function insertIngredientsTable(form) {
    let elements = form.elements;
    let recipe_id = elements["recipe_id"].value;
    let food_item_id = elements["food_item_id"].value;
    let quantity = elements["quantity"].value;
    let data = { recipe_id, food_item_id, quantity };
    // POST the form data to server.
    postJSON("ingredients_table/insert", data)
    // Refresh the page once we get a response.
    .then(_ => window.location.reload());
}

function initIngredientsTable() {
    override("#form_ingredients_table_insert", "submit", insertIngredientsTable);
}

function delete_ingredients_table(recipe_id, food_item_id){
    $.ajax({
      url: '/ingredients_table/' + recipe_id + '/' + food_item_id,
      type: 'DELETE',
      success: function(result){
        window.location.reload(true);
      }
    })
  }

window.onload = initIngredientsTable;
