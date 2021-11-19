let form = document.querySelector("#form_user_insert");
if (form) {
    form.addEventListener("submit", (event) => {
        // Stop the default form behavior (post data and refresh/redirect page).
        event.preventDefault();
        // Send an HTTP POST request
        fetch("users-insert", {
            method: "POST",
            // Specify we are sending JSON data.
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            // Data to be sent.
            body: JSON.stringify({
                first_name: form.elements["first_name"].value,
                last_name: form.elements["last_name"].value,
                email: form.elements["email"].value
            })
        })
        // Upon receiving a response from the server,
        // reload the page for the most recent 
        .then(response => location.reload());
    });
}
