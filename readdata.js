// readdata.js
// ========
// Main program. Do not edit anything!
// For configuration edit the files in config folder.
// ======

"use strict";

const database = require("./functions/database");
const owapi = require("./functions/owapi");
const debug = require("./config/debug");
const statistics = require("./functions/statistics");
const now = require("performance-now");
const currentDate = new Date();

function updatePlayer(playerList, count) {
    if (debug.statistics) statistics.statistics.javascript.functionCalls++;
    var player = playerList[count];

    owapi
        .blob(player.battleTag.replace("#", "-"))
        .then(function(owapi) {
            checkActive(owapi, player.id).then(function(active) {
                if (active === true) {
                    updateOverallStats(owapi, player.id).then(function() {
                        updateRollingAverageStats(owapi, player.id).then(function() {
                            updateGameStats(owapi, player.id).then(function() {
                                updateHeroesGeneral(owapi, player.id).then(function() {
                                    updatePlayers(player.id).then(function() {
                                        count++;
                                        if (count == playerList.length) {
                                            database.disconnect().then(function(response, err) {
                                                if (debug.statistics) {
                                                    statistics.statistics.javascript.executionTime = (now() / 1000).toFixed(2) + " seconds";
                                                    statistics.show();
                                                }
                                            });
                                        } else {
                                            updatePlayer(playerList, count);
                                        }
                                    });
                                });
                            });
                        });
                    });
                } else {
                    count++;
                    if (count == playerList.length) {
                        database.disconnect().then(function(response, err) {
                            if (debug.statistics) {
                                statistics.statistics.javascript.executionTime = (now() / 1000).toFixed(2) + " seconds";
                                statistics.show();
                            }
                        });
                    } else {
                        updatePlayer(playerList, count);
                    }
                }
            });
        })
        .catch(function(err) {
            updatePlayer(playerList, count);
        });
}

function getCurrentDate() {
    var tzoffset = new Date().getTimezoneOffset() * 60000;
    return new Date(currentDate - tzoffset)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
}

function updateHeroesGeneral(owapi, playerId) {
    if (debug.statistics) statistics.statistics.javascript.functionCalls++;

    return new Promise(async function(resolve, reject) {
        let finishedCP = false,
            finishedQP = false,
            countCP = 0,
            countQP = 0;

        if (owapi.eu.heroes.playtime.competitive !== null) {
            var heroesCP = await getPlayedHeroes(owapi.eu.heroes.playtime.competitive);
            heroesCP.forEach(async function(hero) {
                if (owapi.eu.heroes.stats.competitive[hero] != null) {
                    var general_stats = await correctGameStats(owapi.eu.heroes.stats.competitive[hero].general_stats);
                    general_stats.player_id = playerId;
                    general_stats.createDate = getCurrentDate();
                    general_stats.competitive = 1;
                    general_stats.hero = hero;
                    var response = await database.insert(["hero_general_stats", general_stats]);
                }
                countCP++;
                if (countCP == heroesCP.length) {
                    finishedCP = true;
                }
                if (finishedCP == true && finishedQP == true) resolve(true);
            }, this);
        } else {
            finishedCP = true;
        }

        if (owapi.eu.heroes.playtime.quickplay !== null) {
            var heroesQP = await getPlayedHeroes(owapi.eu.heroes.playtime.quickplay);
            heroesQP.forEach(async function(hero) {
                if (owapi.eu.heroes.stats.quickplay[hero]) {
                    var general_stats = await correctGameStats(owapi.eu.heroes.stats.quickplay[hero].general_stats);
                    general_stats.player_id = playerId;
                    general_stats.createDate = getCurrentDate();
                    general_stats.competitive = 0;
                    general_stats.hero = hero;
                    var response = await database.insert(["hero_general_stats", general_stats]);
                }
                countQP++;
                if (countQP == heroesQP.length) {
                    finishedQP = true;
                }
                if (finishedCP == true && finishedQP == true) resolve(true);
            }, this);
        } else {
            finishedCP = true;
        }

        if (finishedCP == true && finishedQP == true) resolve(true);
    });
}

function getPlayedHeroes(allHeroes) {
    if (debug.statistics) statistics.statistics.javascript.functionCalls++;

    return new Promise(function(resolve, reject) {
        let playedHeroes = [],
            i,
            length = Object.keys(allHeroes).length,
            keys = Object.keys(allHeroes);

        for (i = 0; i < length; i++) {
            if (allHeroes[keys[i]] > 0) playedHeroes.push(keys[i]);
            if (i == length - 1) resolve(playedHeroes);
        }
    });
}

function updateGameStats(owapi, playerId) {
    if (debug.statistics) statistics.statistics.javascript.functionCalls++;

    return new Promise(async function(resolve, reject) {
        let quickplay = null,
            competitive = null;

        if (owapi.eu.stats.quickplay !== null) quickplay = owapi.eu.stats.quickplay.game_stats;
        if (owapi.eu.stats.competitive !== null) competitive = owapi.eu.stats.competitive.game_stats;

        if (quickplay !== null) {
            quickplay.player_id = playerId;
            quickplay.createDate = getCurrentDate();
            quickplay.competitive = 0;
            quickplay = await correctGameStats(quickplay);

            var result = await database.insert(["game_stats", quickplay]);

            if (competitive !== null) {
                competitive.player_id = playerId;
                competitive.createDate = getCurrentDate();
                competitive.competitive = 1;
                competitive = await correctGameStats(competitive);

                result = await database.insert(["game_stats", competitive]);
                resolve(result);
            } else {
                resolve("no competitive played.");
            }
        } else {
            resolve("no quickplay played. skipping competitive!");
        }
    });
}

function updatePlayers(playerId) {
    if (debug.statistics) statistics.statistics.javascript.functionCalls++;

    return new Promise(async function(resolve, reject) {
        database.update(["players", "modifyDate = '" + getCurrentDate() + "'", "id = " + playerId]).then(function(result, err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        });
    });
}

function correctGameStats(list) {
    if (debug.statistics) statistics.statistics.javascript.functionCalls++;

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
        if (list.hasOwnProperty("elimination_most_in_life"))
            list = await renameJsonKey([list, "elimination_most_in_life", "eliminations_most_in_life"]);
        if (list.hasOwnProperty("death")) list = await renameJsonKey([list, "death", "deaths"]);
        if (list.hasOwnProperty("solo_kill")) list = await renameJsonKey([list, "solo_kill", "solo_kills"]);
        if (list.hasOwnProperty("card")) list = await renameJsonKey([list, "card", "cards"]);
        if (list.hasOwnProperty("elimination_per_life")) list = await renameJsonKey([list, "elimination_per_life", "eliminations_per_life"]);
        if (list.hasOwnProperty("critical_hit_most_in_life"))
            list = await renameJsonKey([list, "critical_hit_most_in_life", "critical_hits_most_in_life"]);
        if (list.hasOwnProperty("objective_kill_most_in_game"))
            list = await renameJsonKey([list, "objective_kill_most_in_game", "objective_kills_most_in_game"]);
        if (list.hasOwnProperty("elimination")) list = await renameJsonKey([list, "elimination", "elimination"]);
        if (list.hasOwnProperty("defensive_assist")) list = await renameJsonKey([list, "defensive_assist", "defensive_assists"]);
        if (list.hasOwnProperty("objective_kill")) list = await renameJsonKey([list, "objective_kill", "objective_kills"]);
        if (list.hasOwnProperty("offensive_assist")) list = await renameJsonKey([list, "offensive_assist", "offensive_assists"]);
        if (list.hasOwnProperty("offensive_assist_most_in_game"))
            list = await renameJsonKey([list, "offensive_assist_most_in_game", "offensive_assists_most_in_game"]);
        if (list.hasOwnProperty("turret_kill_most_in_game"))
            list = await renameJsonKey([list, "turret_kill_most_in_game", "turret_kills_most_in_game"]);
        if (list.hasOwnProperty("critical_hit_most_in_life"))
            list = await renameJsonKey([list, "critical_hit_most_in_life", "critical_hits_most_in_life"]);
        if (list.hasOwnProperty("elimination_most_in_game"))
            list = await renameJsonKey([list, "elimination_most_in_game", "eliminations_most_in_game"]);
        if (list.hasOwnProperty("defensive_assist_most_in_game"))
            list = await renameJsonKey([list, "defensive_assist_most_in_game", "defensive_assists_most_in_game"]);
        if (list.hasOwnProperty("critical_hit_most_in_game"))
            list = await renameJsonKey([list, "critical_hit_most_in_game", "critical_hits_most_in_game"]);
        if (list.hasOwnProperty("critical_hit")) list = await renameJsonKey([list, "critical_hit", "critical_hits"]);
        if (list.hasOwnProperty("fan_the_hammer_kill_most_in_game"))
            list = await renameJsonKey([list, "fan_the_hammer_kill_most_in_game", "fan_the_hammer_kills_most_in_game"]);
        if (list.hasOwnProperty("self_destruct_kill_most_in_game"))
            list = await renameJsonKey([list, "self_destruct_kill_most_in_game", "self_destruct_kills_most_in_game"]);
        if (list.hasOwnProperty("self_destruct_kill")) list = await renameJsonKey([list, "self_destruct_kill", "self_destruct_kills"]);
        if (list.hasOwnProperty("enemy_hacked")) list = await renameJsonKey([list, "enemy_hacked", "enemies_hacked"]);
        if (list.hasOwnProperty("enemy_slept_most_in_game"))
            list = await renameJsonKey([list, "enemy_slept_most_in_game", "enemies_slept_most_in_game"]);
        if (list.hasOwnProperty("nano_boost_applied_most_in_game"))
            list = await renameJsonKey([list, "nano_boost_applied_most_in_game", "nano_boosts_applied_most_in_game"]);
        if (list.hasOwnProperty("primal_rage_kill")) list = await renameJsonKey([list, "primal_rage_kill", "primal_rage_kills"]);
        if (list.hasOwnProperty("primal_rage_kill_most_in_game"))
            list = await renameJsonKey([list, "primal_rage_kill_most_in_game", "primal_rage_kills_most_in_game"]);
        if (list.hasOwnProperty("enemy_empd_most_in_game"))
            list = await renameJsonKey([list, "enemy_empd_most_in_game", "enemies_empd_most_in_game"]);
        if (list.hasOwnProperty("blaster_kill")) list = await renameJsonKey([list, "blaster_kill", "blaster_kills"]);
        if (list.hasOwnProperty("enemy_hacked_most_in_game"))
            list = await renameJsonKey([list, "enemy_hacked_most_in_game", "enemies_hacked_most_in_game"]);
        if (list.hasOwnProperty("blaster_kill_most_in_game"))
            list = await renameJsonKey([list, "blaster_kill_most_in_game", "blaster_kills_most_in_game"]);
        if (list.hasOwnProperty("enemy_slept")) list = await renameJsonKey([list, "enemy_slept", "enemies_slept"]);
        if (list.hasOwnProperty("enemy_hacked_most_in_game"))
            list = await renameJsonKey([list, "enemy_hacked_most_in_game", "enemies_hacked_most_in_game"]);
        if (list.hasOwnProperty("biotic_grenade_kill")) list = await renameJsonKey([list, "biotic_grenade_kill", "biotic_grenade_kills"]);
        if (list.hasOwnProperty("enemy_empd")) list = await renameJsonKey([list, "enemy_empd", "enemies_empd"]);
        if (list.hasOwnProperty("projected_barrier_applied_most_in_game"))
            list = await renameJsonKey([list, "projected_barrier_applied_most_in_game", "projected_barriers_applied_most_in_game"]);
        if (list.hasOwnProperty("armor_pack_created_most_in_game"))
            list = await renameJsonKey([list, "armor_pack_created_most_in_game", "armor_packs_created_most_in_game"]);
        if (list.hasOwnProperty("concussion_mine_kill")) list = await renameJsonKey([list, "concussion_mine_kill", "concussion_mine_kills"]);
        if (list.hasOwnProperty("concussion_mine_kill_most_in_game"))
            list = await renameJsonKey([list, "concussion_mine_kill_most_in_game", "concussion_mine_kills_most_in_game"]);
        resolve(list);
    });
}

function renameJsonKey(array) {
    if (debug.statistics) statistics.statistics.javascript.functionCalls++;

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
    if (debug.statistics) statistics.statistics.javascript.functionCalls++;

    return new Promise(async function(resolve, reject) {
        let quickplay = null,
            competitive = null;

        if (owapi.eu.stats.quickplay !== null) quickplay = owapi.eu.stats.quickplay.overall_stats;
        if (owapi.eu.stats.competitive !== null) competitive = owapi.eu.stats.competitive.overall_stats;

        if (quickplay !== null) {
            quickplay.player_id = playerId;
            quickplay.createDate = getCurrentDate();
            quickplay.competitive = 0;
            quickplay.ties = 0;
            var result = await database.insert(["overall_stats", quickplay]);

            if (competitive !== null) {
                competitive.player_id = playerId;
                competitive.createDate = getCurrentDate();
                competitive.competitive = 1;
                result = await database.insert(["overall_stats", competitive]);
                resolve(result);
            } else {
                resolve("no competitive played.");
            }
        } else {
            resolve("no quickplay played. skipping competitive!");
        }
    });
}

function updateRollingAverageStats(owapi, playerId) {
    if (debug.statistics) statistics.statistics.javascript.functionCalls++;

    return new Promise(async function(resolve, reject) {
        let quickplay = null,
            competitive = null;

        if (owapi.eu.stats.quickplay !== null) quickplay = owapi.eu.stats.quickplay.rolling_average_stats;
        if (owapi.eu.stats.competitive !== null) competitive = owapi.eu.stats.competitive.rolling_average_stats;

        if (quickplay !== null) {
            quickplay.player_id = playerId;
            quickplay.createDate = getCurrentDate();
            quickplay.competitive = 0;
            var result = await database.insert(["rolling_average_stats", quickplay]);

            if (competitive !== null) {
                competitive.player_id = playerId;
                competitive.createDate = getCurrentDate();
                competitive.competitive = 1;
                result = await database.insert(["rolling_average_stats", competitive]);
                resolve(result);
            } else {
                resolve("no competitive played.");
            }
        } else {
            resolve("no quickplay played. skipping competitive!");
        }
    });
}

function checkActive(owapi, playerId) {
    if (debug.statistics) statistics.statistics.javascript.functionCalls++;

    return new Promise(function(resolve, reject) {
        if (typeof owapi === "object") {
            if (owapi.error === "404" || typeof owapi.eu === "undefined") {
                if (debug.verbose) {
                    console.log("Deactivating player " + playerId);
                    console.log(JSON.stringify(owapi, undefined, 4));
                }

                database.update(["players", "active = 0, modifyDate = '" + getCurrentDate() + "'", "id = " + playerId]).then(function(result, err) {
                    if (debug.statistics) statistics.statistics.playersDeactivated++;
                    resolve(false); // active = false
                });
            } else {
                resolve(true); // active = true
            }
        } else {
            resolve(false);
        }
    });
}

database.connect().then(function(response, err) {
    if (err) return;

    database.select(["players", "id, battleTag", "active = 1"]).then(function(playerList) {
        if (debug.statistics) statistics.statistics.players = playerList.length;
        updatePlayer(playerList, 0);
    });
});
