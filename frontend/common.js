function handleServerResponse(cbSuccess, cbFailure) {
    return res => {
        res.json()
        .then(data => {
            if (data.type === "success") {
                cbSuccess(data.payload);
            }
            else {
                cbFailure(data.payload);
            }
        });
    }
}

function updateTableData(data) {
    replaceInnerHTML("#container_results_table", data);
    hideFailureBox();
}

function extractFormData(form, keys) {
    let data = {};
    for (let key of keys) {
        data[key] = form.elements[key].value;
    }
    return data;
}

function showFailureBox() {
    let elem = document.querySelector("#container_results_message");
    elem.style.display = "block";
    elem.style.visibility = "visible";
}

function hideFailureBox() {
    let elem = document.querySelector("#container_results_message");
    elem.style.display = "none";
    elem.style.visibility = "hidden";
}

function alertQueryFailure(msg) {
    replaceInnerHTML("#container_results_message", "<b>Query Failed: </b><br><p>" + msg + "</p>");
    showFailureBox();
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

function initCollapsibles() {
    let elems = document.getElementsByClassName("collapsible");
    for (let elem of elems) {
        elem.addEventListener("click", function() {
            this.classList.toggle("active");
            let content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            }
            else {
                content.style.display = "block";
            }
        });
    }
}
