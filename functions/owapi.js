// owapi.js
// ======
// Handle the Overwatch API correctly.
// ======

const http = require("http");
const debug = require("../config/debug");
const statistics = require("../functions/statistics");
const config = require("../config/owapi");
const now = require("performance-now");

module.exports = {
    blob: function(battleTag) {
        if (debug.statistics) statistics.statistics.javascript.functionCalls++;
        var beginTime = now();

        return new Promise(function(resolve, reject) {
            battleTag = encodeURI(battleTag);
            var url = "http://" + config.host + ":" + config.port + "/api/" + config.version + "/u/" + battleTag + "/blob";
            if (debug.verbose) console.log("OWAPI Call: " + url);

            var req = http.get(url, resp => {
                if (debug.statistics) statistics.statistics.owapi.requests++;
                let data = "";

                resp.on("data", chunk => {
                    data += chunk;
                });

                resp.on("end", () => {
                    if (debug.verbose) console.log("OWAPI Response End for " + battleTag);
                    if (debug.statistics) {
                        statistics.statistics.owapi.responses++;
                        var duration = parseFloat((now() - beginTime) / 1000).toFixed(2);
                        if (statistics.statistics.owapi.longestRequest < duration || statistics.statistics.owapi.longestRequest == 0)
                            statistics.statistics.owapi.longestRequest = duration;
                        if (statistics.statistics.owapi.shortestRequest > duration || statistics.statistics.owapi.shortestRequest == 0)
                            statistics.statistics.owapi.shortestRequest = duration;
                    }
                    resolve(JSON.parse(data));
                });

                resp.on("error", err => {
                    if (debug.statistics) statistics.statistics.owapi.errors++;
                    if (debug.verbose) console.log("OWAPI ERROR: " + JSON.stringify(err, undefined, 4));
                    reject(err);
                });
            });

            req.on("socket", function(socket) {
                socket.setTimeout(30000);
                socket.on("timeout", function() {
                    req.abort();
                });
            });

            req.on("error", function(err) {
                if (debug.statistics) statistics.statistics.owapi.errors++;
                if (debug.verbose) console.log("OWAPI ERROR: " + JSON.stringify(err, undefined, 4));
                reject(err);
            });
        });
    }
};
