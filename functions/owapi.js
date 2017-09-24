// owapi.js
// ======
// Handle the Overwatch API correctly.
// ======

const http = require("http");
const debug = require("../config/debug");
const statistics = require("../functions/statistics");
const config = require("../config/owapi");

module.exports = {
    blob: function(battleTag) {
        if (debug.statistics) statistics.statistics.javascript.functionCalls++;

        return new Promise(function(resolve, reject) {
            battleTag = encodeURI(battleTag);
            var url = "http://" + config.host + ":" + config.port + "/api/" + config.version + "/u/" + battleTag + "/blob";

            http
                .get(url, resp => {
                    if (debug.statistics) statistics.statistics.owapi.requests++;
                    let data = "";

                    resp.on("data", chunk => {
                        data += chunk;
                    });

                    resp.on("end", () => {
                        if (debug.statistics) statistics.statistics.owapi.responses++;
                        resolve(JSON.parse(data));
                    });

                    resp.on("error", err => {
                        if (debug.statistics) statistics.statistics.owapi.errors++;
                        throw err;
                        reject(err);
                    });
                })
                .on("error", err => {
                    if (debug.statistics) statistics.statistics.owapi.errors++;
                    throw err;
                    reject(err);
                });
        });
    }
};
