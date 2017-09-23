// readdata.js
// ========
// Main program. Do not edit anything!
// For configuration edit the files in config folder.
// ======

"use strict";

const Mysql = require("mysql");
const Http = require("http");
const Database = require("./config/database");
const Debug = require("./config/debug");

var connection = Mysql.createConnection({
    host: Database.host,
    user: Database.user,
    password: Database.password,
    database: Database.database
});

function updatePlayer() {
    if (Debug.verbose) console.log("updatePlayer()");

    return new Promise(function(resolve, reject) {
        connection.query("SELECT id, battleTag FROM `players` WHERE active = 1", function(err, result, fields) {
            if (err) {
                throw err;
                reject(err);
            }

            var count = 0;
            result.forEach(function(player) {
                callApi(player.battleTag.replace("#", "-")).then(function(owapi, err) {
                    if (Debug.verbose) console.log("err: " + err + " type: " + typeof err);

                    if (typeof err === "undefined") {
                        checkActive(owapi, player.id).then(function(active) {
                            if (active === true) {
                                updateOverallStats(owapi, player.id).then(function() {
                                    updateRollingAverageStats(owapi, player.id).then(function() {
                                        updateGameStats(owapi, player.id).then(function() {
                                            count++;
                                            if (count == result.length) {
                                                resolve(true);
                                            }
                                        });
                                    });
                                });
                            } else {
                                count++;
                                if (count == result.length) {
                                    resolve(true);
                                }
                            }
                        });
                    } else {
                        count++;
                        if (count == result.length) {
                            resolve(true);
                        }
                    }
                });
            }, this);
        });
    });
}

async function updateGameStats(owapi, playerId) {
    if (Debug.verbose) console.log("updateGameStats()");

    return new Promise(async function(resolve, reject) {
        let quickplay,
            competitive = null;

        if (owapi.eu.stats.quickplay !== null) quickplay = owapi.eu.stats.quickplay.game_stats;
        if (owapi.eu.stats.competitive !== null) competitive = owapi.eu.stats.competitive.game_stats;

        if (quickplay !== null) {
            quickplay.player_id = playerId;
            quickplay.competitive = 0;
            quickplay = await correctGameStats(quickplay);

            connection.query("INSERT INTO `game_stats` SET ?", quickplay, async function(err, result, fields) {
                if (err) reject(err);

                if (competitive !== null) {
                    competitive.player_id = playerId;
                    competitive.competitive = 1;
                    competitive = await correctGameStats(competitive);

                    connection.query("INSERT INTO `game_stats` SET ?", competitive, function(err, result, fields) {
                        if (err) reject(err);
                        resolve(result);
                    });
                } else {
                    resolve("no competitive played.");
                }
            });
        } else {
            resolve("no quickplay played. skipping competitive!");
        }
    });
}

async function correctGameStats(list) {
    return new Promise(async function(resolve, reject) {
        if (list.hasOwnProperty("recon_assist_most_in_game"))
            list = await renameJsonKey([list, "recon_assist_most_in_game", "recon_assists_most_in_game"]);
        if (list.hasOwnProperty("shield_generator_destroyed_most_in_game"))
            list = await renameJsonKey([list, "shield_generator_destroyed_most_in_game", "shield_generators_destroyed_most_in_game"]);
        if (list.hasOwnProperty("recon_assist")) list = await renameJsonKey([list, "recon_assist", "recon_assists"]);
        if (list.hasOwnProperty("teleporter_pad_destroyed_most_in_game"))
            list = await renameJsonKey([list, "teleporter_pad_destroyed_most_in_game", "teleporter_pads_destroyed_most_in_game"]);
        if (list.hasOwnProperty("environmental_kill_most_in_game"))
            list = await renameJsonKey([list, "environmental_kill_most_in_game", "environmental_kills_most_in_game"]);
        if (list.hasOwnProperty("shield_generator_destroyed"))
            list = await renameJsonKey([list, "shield_generator_destroyed", "shield_generators_destroyed"]);
        if (list.hasOwnProperty("melee_final_blow_most_in_game"))
            list = await renameJsonKey([list, "melee_final_blow_most_in_game", "melee_final_blows_most_in_game"]);
        if (list.hasOwnProperty("solo_kill_most_in_game")) list = await renameJsonKey([list, "solo_kill_most_in_game", "solo_kills_most_in_game"]);
        if (list.hasOwnProperty("teleporter_pad_destroyed"))
            list = await renameJsonKey([list, "teleporter_pad_destroyed", "teleporter_pads_destroyed"]);
        if (list.hasOwnProperty("multikill")) list = await renameJsonKey([list, "multikill", "multikills"]);
        if (list.hasOwnProperty("environmental_kill")) list = await renameJsonKey([list, "environmental_kill", "environmental_kills"]);
        if (list.hasOwnProperty("turret_destroyed_most_in_game"))
            list = await renameJsonKey([list, "turret_destroyed_most_in_game", "turrets_destroyed_most_in_game"]);
        if (list.hasOwnProperty("melee_final_blow")) list = await renameJsonKey([list, "melee_final_blow", "melee_final_blows"]);
        if (list.hasOwnProperty("turret_destroyed")) list = await renameJsonKey([list, "turret_destroyed", "turrets_destroyed"]);
        if (list.hasOwnProperty("final_blow_most_in_game")) list = await renameJsonKey([list, "final_blow_most_in_game", "final_blows_most_in_game"]);
        if (list.hasOwnProperty("final_blow")) list = await renameJsonKey([list, "final_blow", "final_blows"]);
        resolve(list);
    });
}

function renameJsonKey(array) {
    return new Promise(resolve => {
        var newKey = array[2];
        var key = array[1];
        var list = array[0];
        list[newKey] = list[key];
        delete list[key];
        resolve(list);
    });
}

function updateOverallStats(owapi, playerId) {
    if (Debug.verbose) console.log("updateOverallStats()");

    return new Promise(function(resolve, reject) {
        let quickplay,
            competitive = null;

        if (owapi.eu.stats.quickplay !== null) quickplay = owapi.eu.stats.quickplay.overall_stats;
        if (owapi.eu.stats.competitive !== null) competitive = owapi.eu.stats.competitive.overall_stats;

        if (quickplay !== null) {
            quickplay.player_id = playerId;
            quickplay.competitive = 0;
            quickplay.ties = 0;

            connection.query("INSERT INTO `overall_stats` SET ?", quickplay, function(err, result, fields) {
                if (err) {
                    reject(err);
                }

                if (competitive !== null) {
                    competitive.player_id = playerId;
                    competitive.competitive = 1;

                    connection.query("INSERT INTO `overall_stats` SET ?", competitive, function(err, result, fields) {
                        if (err) {
                            reject(err);
                        }
                        resolve(result);
                    });
                } else {
                    resolve("no competitive played.");
                }
            });
        } else {
            resolve("no quickplay played. skipping competitive!");
        }
    });
}

function updateRollingAverageStats(owapi, playerId) {
    if (Debug.verbose) console.log("updateRollingAverageStats()");

    return new Promise(function(resolve, reject) {
        let quickplay,
            competitive = null;

        if (owapi.eu.stats.quickplay !== null) quickplay = owapi.eu.stats.quickplay.rolling_average_stats;
        if (owapi.eu.stats.competitive !== null) competitive = owapi.eu.stats.competitive.rolling_average_stats;

        if (quickplay !== null) {
            quickplay.player_id = playerId;
            quickplay.competitive = 0;

            connection.query("INSERT INTO `rolling_average_stats` SET ?", quickplay, function(err, result, fields) {
                if (err) {
                    reject(err);
                }

                if (competitive !== null) {
                    competitive.player_id = playerId;
                    competitive.competitive = 1;

                    connection.query("INSERT INTO `rolling_average_stats` SET ?", competitive, function(err, result, fields) {
                        if (err) {
                            reject(err);
                        }
                        resolve(result);
                    });
                } else {
                    resolve("no competitive played.");
                }
            });
        } else {
            resolve("no quickplay played. skipping competitive!");
        }
    });
}

function callApi(battleTag) {
    if (Debug.verbose) console.log("callApi()");

    return new Promise(function(resolve, reject) {
        Http.get("http://134.255.253.124:4444/api/v3/u/" + encodeURI(battleTag) + "/blob", resp => {
            let data = "";

            resp.on("data", chunk => {
                data += chunk;
            });

            resp.on("end", () => {
                resolve(JSON.parse(data));
            });

            resp.on("error", err => {
                reject(err);
            });
        }).on("error", err => {
            reject(err);
        });
    });
}

function checkActive(owapi, playerId) {
    if (Debug.verbose) console.log("checkActive()");

    return new Promise(function(resolve, reject) {
        if (typeof owapi === "object") {
            if (owapi.error === "404" || typeof owapi.eu === "undefined") {
                connection.query("UPDATE `players` SET active = 0, modifyDate = NOW() WHERE id = " + playerId, function(err, result) {
                    if (err) {
                        resolve(false);
                    } else {
                        resolve(false); // active = false
                    }
                });
            } else {
                resolve(true); // active = true
            }
        } else {
            resolve(false);
        }
    });
}

/**
 * Main Method
 */
connection.connect(function(err) {
    if (Debug.verbose) console.log("Connecting Database...");

    if (err) {
        throw err;
        return;
    }

    updatePlayer().then(function() {
        if (Debug.verbose) console.log("Disconnecting Database...");

        connection.end(function(err) {
            if (err) throw err;
        });
    });
});
