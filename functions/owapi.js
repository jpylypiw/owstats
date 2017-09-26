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

            var req = http.get(url, resp => {
                if (debug.statistics) statistics.statistics.owapi.requests++;
                let data = "";

                resp.on("data", chunk => {
                    data += chunk;
                });

                resp.on("end", () => {
                    if (debug.statistics) {
                        statistics.statistics.owapi.responses++;
                        var duration = Math.round((now() - beginTime) / 1000);
                        if (statistics.statistics.owapi.longestRequest < duration) statistics.statistics.owapi.longestRequest = duration;
                        if (statistics.statistics.owapi.shortestRequest > duration || statistics.statistics.owapi.shortestRequest == 0)
                            statistics.statistics.owapi.shortestRequest = duration;
                    }
                    resolve(JSON.parse(data));
                });

                resp.on("error", err => {
                    if (debug.statistics) statistics.statistics.owapi.errors++;
                    throw err;
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
                throw err;
                reject(err);
            });
        });
    }
};
