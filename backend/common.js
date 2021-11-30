module.exports = { init };

function init(pool, hb) {
    // Helper function to render partial HTML fragments.
    // Returns a promise.
    function renderPartialHTML(hb_path, context) {
        return hb.renderView(hb_path, context);
    }

    function query(sql, values) {
        return new Promise((resolve, reject) => {
            pool.query(sql, values, (error, results, fields) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(results);
                }
            });
        });
    }

    // Helper function for creating a newly rendered table fragment.
    function renderTableData(rows, headers, callback) {
        let context = { results_table: { headers, rows }, layout: false };
        renderPartialHTML("views/partials/results_table.handlebars", context)
        .then(html => callback(html));
    }

    // Helper function, returns a list of values gathered from data.
    function extractValues(data, keys) {
        let values = [];
        for (let key of keys) {
            values.push(data[key]);
        }
        return values;
    }

    function handler(keys, sql, cbSuccess, cbFailure) {
        return (req, res) => {
            let values = extractValues(req.body, keys);
            query(sql, values)
            .then(results => {
                cbSuccess(res, results);
            })
            .catch(error => {
                cbFailure(res, error);
            })
        }
    }

    return {
        renderPartialHTML,
        query,
        renderTableData,
        extractValues,
        handler
    }
}