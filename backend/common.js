module.exports = { init };

function init(pool, hb) {
    // Helper function to render partial HTML fragments.
    // Returns a promise.
    function renderPartialHTML(hb_path, context) {
        return hb.renderView(hb_path, context);
    }

    function queryIdsToNames(sql, id_selector, name_selector) {
        return query(sql, [])
        .then(ids_to_names_rows => {
            let ids_to_names = {};
            for (let row of ids_to_names_rows) {
                ids_to_names[row[id_selector]] = row[name_selector];
            }
            console.log(ids_to_names)
            return ids_to_names;
        });
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
                cbFailure(res, error.sqlMessage);
            })
        }
    }

    function respondError(res, payload) {
        res.json({type: "failure", payload});
    }

    function respondSuccess(res, payload) {
        res.json({type: "success", payload})
    }

    return {
        renderPartialHTML,
        query,
        renderTableData,
        extractValues,
        handler,
        respondError,
        respondSuccess,
        queryIdsToNames
    }
}