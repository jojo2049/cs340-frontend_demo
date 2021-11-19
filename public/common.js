function override(selector, event, callback) {
    let elem = document.querySelector(selector);
    if (elem) {
        elem.addEventListener(event, e => {
            // Stop the default form behavior (post data and refresh/redirect page).
            e.preventDefault();
            callback(elem);
        });
    }
}

function postJSON(route, data) {
    // Send an HTTP POST request
    // Returns a Promise, can call .then(data => ...).
    return fetch(route, {
        method: "POST",
        // Specify we are sending JSON data.
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        // Data to be sent.
        body: JSON.stringify(data)
    });
}
