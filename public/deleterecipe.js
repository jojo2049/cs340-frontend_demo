function deleteRecipe(id){
  $.ajax({
    url: '/recipes/' + id,
    type: 'DELETE',
    success: function(result){
      window.location.reload(true);
    }
  })
}