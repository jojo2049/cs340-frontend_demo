function extractFormData(form, keys) {
    let data = {};
    for (let key of keys) {
        data[key] = form.elements[key].value;
    }
    return data;
}

function alertQueryFailure(msg) {
    alert("QUERY FAILURE: " + msg);
}

// Replaces the inner HTML of the selected element.
function replaceInnerHTML(selector, html) {
    let elem = document.querySelector(selector);
    elem.innerHTML = html;
}

// Replaces an elements event handling.
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

// Send an HTTP POST request to route with the given data.
// Returns a Promise containing a response, can call .then(response => ...).
function postJSON(route, data) {
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
