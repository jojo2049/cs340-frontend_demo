let form = document.querySelector("#form_food_items_insert");
if (form) {
    form.addEventListener("submit", (event) => {
        // Stop the default form behavior (post data and refresh/redirect page).
        event.preventDefault();
        // Send an HTTP POST request
        fetch("food_items-insert", {
            method: "POST",
            // Specify we are sending JSON data.
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            // Data to be sent.
            body: JSON.stringify({
                name: form.elements["name"].value,
                calories: form.elements["calories"].value,
            })
        })
        // Upon receiving a response from the server,
        // reload the page for the most recent 
        .then(response => location.reload());
    });
}
