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
const fs = require("fs");
const beginDate = new Date();
var updatedPlayers = [];

function updatePlayers(playerList, count) {
    if (debug.statistics) statistics.statistics.javascript.functionCalls++;
    var player = playerList[count];

    owapi.blob(player.battleTag.replace("#", "-")).then(function(owapi) {
            checkActive(owapi, player.id).then(function(active) {
                if (active === true) {
                    insertNewPlayerData(owapi, player.id).then(function() {
                        count++;
                        if (count == playerList.length) {
                            shutdown();
                        } else {
                            updatePlayers(playerList, count);
                        }
                    });
                } else {
                    count++;
                    if (count == playerList.length) {
                        shutdown();
                    } else {
                        updatePlayers(playerList, count);
                    }
                }
            }, function(err) {
                console.log(err);
            });
        })
        .catch(function(err) {
            updatePlayers(playerList, count);
        });
}

function insertNewPlayerData(owapi, player_id) {
    if (debug.statistics) statistics.statistics.javascript.functionCalls++;

    return new Promise(async function(resolve, reject) {
        updateOverallStats(owapi, player_id).then(function() {
            updateRollingAverageStats(owapi, player_id).then(function() {
                updateGameStats(owapi, player_id).then(function() {
                    updateHeroSpecificStats(owapi, player_id).then(function() {
                        updateHeroGeneralStats(owapi, player_id).then(function() {
                            updatedPlayers.push(player_id);
                            resolve(true);
                        });
                    });
                });
            });
        });
    });
}

function shutdown() {
    if (debug.statistics) statistics.statistics.javascript.functionCalls++;

    return new Promise(async function(resolve, reject) {
        writeDelayedInserts().then(function() {
            updatePlayerTable().then(function() {
                database.disconnect().then(function(response, err) {
                    if (debug.statistics) {
                        statistics.statistics.javascript.executionTime = (now() / 1000).toFixed(2) + " seconds";
                        statistics.show();
                    }
                });
            });
        });
    });
}

function updatePlayerTable() {
    if (debug.statistics) statistics.statistics.javascript.functionCalls++;
    var count = 0;

    return new Promise(async function(resolve, reject) {
        updatedPlayers.forEach(function(player_id) {
            database.update(["players", "modifyDate = '" + getBeginDate() + "'", "id = " + player_id]).then(function(result, err) {
                if (err) {
                    reject(err);
                }
                count++;
                if (count == updatedPlayers.forEach.length) {
                    resolve(true);
                }
            });
        });
    });
}

function getBeginDate() {
    var tzoffset = new Date().getTimezoneOffset() * 60000;
    return new Date(beginDate - tzoffset)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
}

function getCurrentDate() {
    var tzoffset = new Date().getTimezoneOffset() * 60000;
    return new Date(new Date().getTime() - tzoffset)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
}

function updateHeroSpecificStats(owapi, playerId) {
    if (debug.statistics) statistics.statistics.javascript.functionCalls++;

    return new Promise(async function(resolve, reject) {
        let finishedCP = false,
            finishedQP = false,
            countCP = 0,
            countQP = 0;

        if (owapi.eu.heroes.stats.competitive != null && childCount(owapi.eu.heroes.stats.competitive) > 0) {
            var heroesCP = await getPlayedHeroes(owapi.eu.heroes.playtime.competitive);
            heroesCP.forEach(async function(hero) {
                if (owapi.eu.heroes.stats.competitive[hero] != null) {
                    var hero_stats = await correctStatsKey(owapi.eu.heroes.stats.competitive[hero].hero_stats);
                    hero_stats.player_id = playerId;
                    hero_stats.createDate = getBeginDate();
                    hero_stats.competitive = 1;
                    hero_stats.hero = hero;
                    if (hero == "brigitte") {
                        var general_stats = await correctStatsKey(owapi.eu.heroes.stats.competitive[hero].general_stats);
                        if (general_stats.damage_blocked != null) { hero_stats.damage_blocked = general_stats.damage_blocked; }
                        if (general_stats.damage_blocked_most_in_game != null) { hero_stats.damage_blocked_most_in_game = general_stats.damage_blocked_most_in_game; }
                        if (general_stats.armor_provided_most_in_game != null) { hero_stats.armor_provided_most_in_game = general_stats.armor_provided_most_in_game; }
                        if (general_stats.armor_provided != null) { hero_stats.armor_provided = general_stats.armor_provided; }
                    }
                    var response = await database.insert_file(["hero_specific_stats", hero_stats]);
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

        if (owapi.eu.heroes.playtime.quickplay != null) {
            var heroesQP = await getPlayedHeroes(owapi.eu.heroes.playtime.quickplay);
            heroesQP.forEach(async function(hero) {
                if (owapi.eu.heroes.stats.quickplay[hero]) {
                    var hero_stats = await correctStatsKey(owapi.eu.heroes.stats.quickplay[hero].hero_stats);
                    hero_stats.player_id = playerId;
                    hero_stats.createDate = getBeginDate();
                    hero_stats.competitive = 0;
                    hero_stats.hero = hero;
                    if (hero == "brigitte") {
                        var general_stats = await correctStatsKey(owapi.eu.heroes.stats.quickplay[hero].general_stats);
                        if (general_stats.damage_blocked != null) { hero_stats.damage_blocked = general_stats.damage_blocked; }
                        if (general_stats.damage_blocked_most_in_game != null) { hero_stats.damage_blocked_most_in_game = general_stats.damage_blocked_most_in_game; }
                        if (general_stats.armor_provided_most_in_game != null) { hero_stats.armor_provided_most_in_game = general_stats.armor_provided_most_in_game; }
                        if (general_stats.armor_provided != null) { hero_stats.armor_provided = general_stats.armor_provided; }
                    }
                    var response = await database.insert_file(["hero_specific_stats", hero_stats]);
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

function updateHeroGeneralStats(owapi, playerId) {
    if (debug.statistics) statistics.statistics.javascript.functionCalls++;

    return new Promise(async function(resolve, reject) {
        let finishedCP = false,
            finishedQP = false,
            countCP = 0,
            countQP = 0;

        if (owapi.eu.heroes.stats.competitive != null && childCount(owapi.eu.heroes.stats.competitive) > 0) {
            var heroesCP = await getPlayedHeroes(owapi.eu.heroes.playtime.competitive);
            heroesCP.forEach(async function(hero) {
                if (owapi.eu.heroes.stats.competitive[hero] != null) {
                    var general_stats = await correctStatsKey(owapi.eu.heroes.stats.competitive[hero].general_stats);
                    general_stats.player_id = playerId;
                    general_stats.createDate = getBeginDate();
                    general_stats.competitive = 1;
                    general_stats.hero = hero;
                    if (hero == "brigitte") {
                        delete general_stats.damage_blocked;
                        delete general_stats.damage_blocked_most_in_game;
                        delete general_stats.armor_provided_most_in_game;
                        delete general_stats.armor_provided;
                    }
                    var response = await database.insert_file(["hero_general_stats", general_stats]);
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

        if (owapi.eu.heroes.playtime.quickplay != null) {
            var heroesQP = await getPlayedHeroes(owapi.eu.heroes.playtime.quickplay);
            heroesQP.forEach(async function(hero) {
                if (owapi.eu.heroes.stats.quickplay[hero]) {
                    var general_stats = await correctStatsKey(owapi.eu.heroes.stats.quickplay[hero].general_stats);
                    general_stats.player_id = playerId;
                    general_stats.createDate = getBeginDate();
                    general_stats.competitive = 0;
                    general_stats.hero = hero;
                    if (hero == "brigitte") {
                        delete general_stats.damage_blocked;
                        delete general_stats.damage_blocked_most_in_game;
                        delete general_stats.armor_provided_most_in_game;
                        delete general_stats.armor_provided;
                    }
                    var response = await database.insert_file(["hero_general_stats", general_stats]);
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

        if (owapi.eu.stats.quickplay != null) quickplay = owapi.eu.stats.quickplay.game_stats;
        if (owapi.eu.stats.competitive != null) competitive = owapi.eu.stats.competitive.game_stats;

        if (quickplay != null) {
            quickplay.player_id = playerId;
            quickplay.createDate = getBeginDate();
            quickplay.competitive = 0;
            quickplay = await correctStatsKey(quickplay);

            var result = await database.insert_file(["game_stats", quickplay]);

            if (competitive != null) {
                competitive.player_id = playerId;
                competitive.createDate = getBeginDate();
                competitive.competitive = 1;
                competitive = await correctStatsKey(competitive);

                result = await database.insert_file(["game_stats", competitive]);
                resolve(result);
            } else {
                resolve("no competitive played.");
            }
        } else {
            resolve("no quickplay played. skipping competitive!");
        }
    });
}

function correctStatsKey(list) {
    if (debug.statistics) statistics.statistics.javascript.functionCalls++;

    return new Promise(async function(resolve, reject) {
        var keys = Object.keys(list);
        while (keys.find(function(key) { return key.startsWith("overwatchguid"); }) != null) {
            var key = keys.find(function(key) { return key.startsWith("overwatchguid"); });
            delete list[key];
            var index = keys.indexOf(key);
            if (index > -1) {
                keys.splice(index, 1);
            }
        }

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
        if (list.hasOwnProperty("coalescence_kill")) list = await renameJsonKey([list, "coalescence_kill", "coalescence_kills"]);
        if (list.hasOwnProperty("coalescence_kill_most_in_game"))
            list = await renameJsonKey([list, "coalescence_kill_most_in_game", "coalescence_kills_most_in_game"]);
        if (list.hasOwnProperty("supercharger_assist")) list = await renameJsonKey([list, "supercharger_assist", "supercharger_assists"]);
        if (list.hasOwnProperty("supercharger_assist_most_in_game"))
            list = await renameJsonKey([list, "supercharger_assist_most_in_game", "supercharger_assists_most_in_game"]);
        if (list.hasOwnProperty("helix_rockets_kills")) list = await renameJsonKey([list, "helix_rockets_kills", "helix_rocket_kills"]);
        if (list.hasOwnProperty("helix_rockets_kills_most_in_game"))
            list = await renameJsonKey([list, "helix_rockets_kills_most_in_game", "helix_rocket_kills_most_in_game"]);
        if (list.hasOwnProperty("meteor_strike_kill")) list = await renameJsonKey([list, "meteor_strike_kill", "meteor_strike_kills"]);
        if (list.hasOwnProperty("meteor_strike_kill_most_in_game"))
            list = await renameJsonKey([list, "meteor_strike_kill_most_in_game", "meteor_strike_kills_most_in_game"]);
        if (list.hasOwnProperty("venom_mine_kill_most_in_game"))
            list = await renameJsonKey([list, "venom_mine_kill_most_in_game", "venom_mine_kills_most_in_game"]);
        if (list.hasOwnProperty("charge_kill_most_in_game"))
            list = await renameJsonKey([list, "charge_kill_most_in_game", "charge_kills_most_in_game"]);
        if (list.hasOwnProperty("earthshatter_kill_most_in_game"))
            list = await renameJsonKey([list, "earthshatter_kill_most_in_game", "earthshatter_kills_most_in_game"]);
        if (list.hasOwnProperty("earthshatter_kill")) list = await renameJsonKey([list, "earthshatter_kill", "earthshatter_kills"]);
        if (list.hasOwnProperty("rocket_direct_hit")) list = await renameJsonKey([list, "rocket_direct_hit", "rocket_direct_hits"]);
        if (list.hasOwnProperty("scoped_critical_hit_most_in_game"))
            list = await renameJsonKey([list, "scoped_critical_hit_most_in_game", "scoped_critical_hits_most_in_game"]);
        if (list.hasOwnProperty("rocket_direct_hit_most_in_game"))
            list = await renameJsonKey([list, "rocket_direct_hit_most_in_game", "rocket_direct_hits_most_in_game"]);
        if (list.hasOwnProperty("molten_core_kill_most_in_game"))
            list = await renameJsonKey([list, "molten_core_kill_most_in_game", "molten_core_kills_most_in_game"]);
        if (list.hasOwnProperty("player_teleported_most_in_game"))
            list = await renameJsonKey([list, "player_teleported_most_in_game", "players_teleported_most_in_game"]);
        if (list.hasOwnProperty("player_teleported")) list = await renameJsonKey([list, "player_teleported", "players_teleported"]);
        if (list.hasOwnProperty("blizzard_kill_most_in_game"))
            list = await renameJsonKey([list, "blizzard_kill_most_in_game", "blizzard_kills_most_in_game"]);
        if (list.hasOwnProperty("blizzard_kill")) list = await renameJsonKey([list, "blizzard_kill", "blizzard_kills"]);
        if (list.hasOwnProperty("enemy_frozen")) list = await renameJsonKey([list, "enemy_frozen", "enemies_frozen"]);
        if (list.hasOwnProperty("enemy_frozen_most_in_game"))
            list = await renameJsonKey([list, "enemy_frozen_most_in_game", "enemies_frozen_most_in_game"]);
        if (list.hasOwnProperty("scoped_critical_hit")) list = await renameJsonKey([list, "scoped_critical_hit", "scoped_critical_hits"]);
        if (list.hasOwnProperty("torbjorn_kill_most_in_game"))
            list = await renameJsonKey([list, "torbjorn_kill_most_in_game", "torbjorn_kills_most_in_game"]);
        if (list.hasOwnProperty("pulse_bomb_kill")) list = await renameJsonKey([list, "pulse_bomb_kill", "pulse_bomb_kills"]);
        if (list.hasOwnProperty("player_resurrected")) list = await renameJsonKey([list, "player_resurrected", "players_resurrected"]);
        if (list.hasOwnProperty("torbjorn_kill")) list = await renameJsonKey([list, "torbjorn_kill", "torbjorn_kills"]);
        if (list.hasOwnProperty("pulse_bomb_kill_most_in_game"))
            list = await renameJsonKey([list, "pulse_bomb_kill_most_in_game", "pulse_bomb_kills_most_in_game"]);
        if (list.hasOwnProperty("player_resurrected_most_in_game"))
            list = await renameJsonKey([list, "player_resurrected_most_in_game", "players_resurrected_most_in_game"]);
        if (list.hasOwnProperty("melee_kill")) list = await renameJsonKey([list, "melee_kill", "melee_kills"]);
        if (list.hasOwnProperty("melee_kill_most_in_game")) list = await renameJsonKey([list, "melee_kill_most_in_game", "melee_kills_most_in_game"]);
        if (list.hasOwnProperty("dragonstrike_kill")) list = await renameJsonKey([list, "dragonstrike_kill", "dragonstrike_kills"]);
        if (list.hasOwnProperty("dragonstrike_kill_most_in_game"))
            list = await renameJsonKey([list, "dragonstrike_kill_most_in_game", "dragonstrike_kills_most_in_game"]);
        if (list.hasOwnProperty("pulse_bomb_attached")) list = await renameJsonKey([list, "pulse_bomb_attached", "pulse_bombs_attached"]);
        if (list.hasOwnProperty("pulse_bomb_attached_most_in_game"))
            list = await renameJsonKey([list, "pulse_bomb_attached_most_in_game", "pulse_bombs_attached_most_in_game"]);
        if (list.hasOwnProperty("barrage_kill_most_in_game"))
            list = await renameJsonKey([list, "barrage_kill_most_in_game", "barrage_kills_most_in_game"]);
        if (list.hasOwnProperty("barrage_kill")) list = await renameJsonKey([list, "barrage_kill", "barrage_kills"]);
        if (list.hasOwnProperty("recon_kill")) list = await renameJsonKey([list, "recon_kill", "recon_kills"]);
        if (list.hasOwnProperty("recon_kill_most_in_game")) list = await renameJsonKey([list, "recon_kill_most_in_game", "recon_kills_most_in_game"]);
        if (list.hasOwnProperty("sentry_kill_most_in_game"))
            list = await renameJsonKey([list, "sentry_kill_most_in_game", "sentry_kills_most_in_game"]);
        if (list.hasOwnProperty("sentry_kill")) list = await renameJsonKey([list, "sentry_kill", "sentry_kills"]);
        if (list.hasOwnProperty("death_blossom_kill_most_in_game"))
            list = await renameJsonKey([list, "death_blossom_kill_most_in_game", "death_blossom_kills_most_in_game"]);
        if (list.hasOwnProperty("death_blossom_kill")) list = await renameJsonKey([list, "death_blossom_kill", "death_blossom_kills"]);
        if (list.hasOwnProperty("venom_mine_kill")) list = await renameJsonKey([list, "venom_mine_kill", "venom_mine_kills"]);
        if (list.hasOwnProperty("deadeye_kill_most_in_game"))
            list = await renameJsonKey([list, "deadeye_kill_most_in_game", "deadeye_kills_most_in_game"]);
        if (list.hasOwnProperty("deadeye_kill")) list = await renameJsonKey([list, "deadeye_kill", "deadeye_kills"]);
        if (list.hasOwnProperty("dragonblade")) list = await renameJsonKey([list, "dragonblade", "dragonblades"]);
        if (list.hasOwnProperty("biotic_field_deployed")) list = await renameJsonKey([list, "biotic_field_deployed", "biotic_fields_deployed"]);
        if (list.hasOwnProperty("fan_the_hammer_kill")) list = await renameJsonKey([list, "fan_the_hammer_kill", "fan_the_hammer_kills"]);
        if (list.hasOwnProperty("molten_core_kill")) list = await renameJsonKey([list, "molten_core_kill", "molten_core_kills"]);
        if (list.hasOwnProperty("rip_tire_kill_most_in_game"))
            list = await renameJsonKey([list, "rip_tire_kill_most_in_game", "rip_tire_kills_most_in_game"]);
        if (list.hasOwnProperty("rip_tire_kill")) list = await renameJsonKey([list, "rip_tire_kill", "rip_tire_kills"]);
        if (list.hasOwnProperty("mech_called_most_in_game"))
            list = await renameJsonKey([list, "mech_called_most_in_game", "mechs_called_most_in_game"]);
        if (list.hasOwnProperty("jump_pack_kill_most_in_game"))
            list = await renameJsonKey([list, "jump_pack_kill_most_in_game", "jump_pack_kills_most_in_game"]);
        if (list.hasOwnProperty("dragonblade_kill_most_in_game"))
            list = await renameJsonKey([list, "dragonblade_kill_most_in_game", "dragonblade_kills_most_in_game"]);
        if (list.hasOwnProperty("high_energy_kill_most_in_game"))
            list = await renameJsonKey([list, "high_energy_kill_most_in_game", "high_energy_kills_most_in_game"]);
        if (list.hasOwnProperty("high_energy_kill")) list = await renameJsonKey([list, "high_energy_kill", "high_energy_kills"]);
        if (list.hasOwnProperty("dragonblade_kill")) list = await renameJsonKey([list, "dragonblade_kill", "dragonblade_kills"]);
        if (list.hasOwnProperty("nano_boost_assist_most_in_game"))
            list = await renameJsonKey([list, "nano_boost_assist_most_in_game", "nano_boost_assists_most_in_game"]);
        if (list.hasOwnProperty("nano_boost_assist")) list = await renameJsonKey([list, "nano_boost_assist", "nano_boost_assists"]);
        if (list.hasOwnProperty("jump_pack_kill")) list = await renameJsonKey([list, "jump_pack_kill", "jump_pack_kills"]);
        if (list.hasOwnProperty("nano_boost_applied")) list = await renameJsonKey([list, "nano_boost_applied", "nano_boosts_applied"]);
        if (list.hasOwnProperty("tactical_visor_kill_most_in_game"))
            list = await renameJsonKey([list, "tactical_visor_kill_most_in_game", "tactical_visor_kills_most_in_game"]);
        if (list.hasOwnProperty("tactical_visor_kill")) list = await renameJsonKey([list, "tactical_visor_kill", "tactical_visor_kills"]);
        if (list.hasOwnProperty("mech_death")) list = await renameJsonKey([list, "mech_death", "mech_deaths"]);
        if (list.hasOwnProperty("mech_called")) list = await renameJsonKey([list, "mech_called", "mechs_called"]);
        if (list.hasOwnProperty("whole_hog_kill_most_in_game"))
            list = await renameJsonKey([list, "whole_hog_kill_most_in_game", "whole_hog_kills_most_in_game"]);
        if (list.hasOwnProperty("whole_hog_kill")) list = await renameJsonKey([list, "whole_hog_kill", "whole_hog_kills"]);
        if (list.hasOwnProperty("hook_attempted")) list = await renameJsonKey([list, "hook_attempted", "hooks_attempted"]);
        if (list.hasOwnProperty("fire_strike_kill_most_in_game"))
            list = await renameJsonKey([list, "fire_strike_kill_most_in_game", "fire_strike_kills_most_in_game"]);
        if (list.hasOwnProperty("fire_strike_kill")) list = await renameJsonKey([list, "fire_strike_kill", "fire_strike_kills"]);
        if (list.hasOwnProperty("charge_kill")) list = await renameJsonKey([list, "charge_kill", "charge_kills"]);
        if (list.hasOwnProperty("graviton_surge_kill")) list = await renameJsonKey([list, "graviton_surge_kill", "graviton_surge_kill"]);
        if (list.hasOwnProperty("graviton_surge_kill_most_in_game"))
            list = await renameJsonKey([list, "graviton_surge_kill_most_in_game", "graviton_surge_kills_most_in_game"]);
        if (list.hasOwnProperty("scatter_arrow_kill_most_in_game"))
            list = await renameJsonKey([list, "scatter_arrow_kill_most_in_game", "scatter_arrow_kills_most_in_game"]);
        if (list.hasOwnProperty("scatter_arrow_kill")) list = await renameJsonKey([list, "scatter_arrow_kill", "scatter_arrow_kills"]);
        if (list.hasOwnProperty("tank_kill_most_in_game")) list = await renameJsonKey([list, "tank_kill_most_in_game", "tank_kills_most_in_game"]);
        if (list.hasOwnProperty("tank_kill")) list = await renameJsonKey([list, "tank_kill", "tank_kills"]);
        if (list.hasOwnProperty("player_knocked_back_most_in_game"))
            list = await renameJsonKey([list, "player_knocked_back_most_in_game", "players_knocked_back_most_in_game"]);
        if (list.hasOwnProperty("player_knocked_back")) list = await renameJsonKey([list, "player_knocked_back", "players_knocked_back"]);
        if (list.hasOwnProperty("enemy_trapped_most_in_game"))
            list = await renameJsonKey([list, "enemy_trapped_most_in_game", "enemies_trapped_most_in_game"]);
        if (list.hasOwnProperty("enemy_trapped")) list = await renameJsonKey([list, "enemy_trapped", "enemies_trapped"]);
        if (list.hasOwnProperty("sentry_turret_kill_most_in_game"))
            list = await renameJsonKey([list, "sentry_turret_kill_most_in_game", "sentry_turret_kills_most_in_game"]);
        if (list.hasOwnProperty("sentry_turret_kill")) list = await renameJsonKey([list, "sentry_turret_kill", "sentry_turret_kills"]);
        if (list.hasOwnProperty("projected_barrier_applied"))
            list = await renameJsonKey([list, "projected_barrier_applied", "projected_barriers_applied"]);
        if (list.hasOwnProperty("turret_kill")) list = await renameJsonKey([list, "turret_kill", "turret_kills"]);
        if (list.hasOwnProperty("armor_pack_created")) list = await renameJsonKey([list, "armor_pack_created", "armor_packs_created"]);
        if (list.hasOwnProperty("sound_barrier_provided")) list = await renameJsonKey([list, "sound_barrier_provided", "sound_barriers_provided"]);
        if (list.hasOwnProperty("sound_barrier_provided_most_in_game"))
            list = await renameJsonKey([list, "sound_barrier_provided_most_in_game", "sound_barriers_provided_most_in_game"]);
        if (list.hasOwnProperty("enemy_hooked_most_in_game"))
            list = await renameJsonKey([list, "enemy_hooked_most_in_game", "enemies_hooked_most_in_game"]);
        if (list.hasOwnProperty("enemy_hooked")) list = await renameJsonKey([list, "enemy_hooked", "enemies_hooked"]);
        if (list.hasOwnProperty("jump_kill")) list = await renameJsonKey([list, "jump_kill", "jump_kills"]);
        if (list.hasOwnProperty("weapon_kill")) list = await renameJsonKey([list, "weapon_kill", "weapon_kills"]);
        if (list.hasOwnProperty("game_lost")) list = await renameJsonKey([list, "game_lost", "games_lost"]);
        if (list.hasOwnProperty("game_played")) list = await renameJsonKey([list, "game_played", "games_played"]);
        if (list.hasOwnProperty("game_tied")) list = await renameJsonKey([list, "game_tied", "games_tied"]);
        if (list.hasOwnProperty("game_won")) list = await renameJsonKey([list, "game_won", "games_won"]);
        if (list.hasOwnProperty("medal_silver")) list = await renameJsonKey([list, "medal_silver", "medals_silver"]);
        if (list.hasOwnProperty("medal_gold")) list = await renameJsonKey([list, "medal_gold", "medals_gold"]);
        if (list.hasOwnProperty("medal_bronze")) list = await renameJsonKey([list, "medal_bronze", "medals_bronze"]);
        if (list.hasOwnProperty("medal")) list = await renameJsonKey([list, "medal", "medals"]);
        if (list.hasOwnProperty("storm_arrow_kill_most_in_game")) list = await renameJsonKey([list, "storm_arrow_kill_most_in_game", "storm_arrow_kills_most_in_game"]);
        if (list.hasOwnProperty("storm_arrow_kill")) list = await renameJsonKey([list, "storm_arrow_kill", "storm_arrow_kills"]);
        if (list.hasOwnProperty("deflection_kill")) list = await renameJsonKey([list, "deflection_kill", "deflection_kills"]);
        if (list.hasOwnProperty("hammer_kill")) list = await renameJsonKey([list, "hammer_kill", "hammer_kills"]);
        if (list.hasOwnProperty("hammer_kill_most_in_game")) list = await renameJsonKey([list, "hammer_kill_most_in_game", "hammer_kills_most_in_game"]);
        if (list.hasOwnProperty("amplification_matrix_assist")) list = await renameJsonKey([list, "amplification_matrix_assist", "amplification_matrix_assists"]);
        if (list.hasOwnProperty("amplification_matrix_assist_best_in_game")) list = await renameJsonKey([list, "amplification_matrix_assist_best_in_game", "amplification_matrix_assists_best_in_game"]);
        if (list.hasOwnProperty("amplification_matrix_cast")) list = await renameJsonKey([list, "amplification_matrix_cast", "amplification_matrix_casts"]);
        if (list.hasOwnProperty("amplification_matrix_cast_most_in_game")) list = await renameJsonKey([list, "amplification_matrix_cast_most_in_game", "amplification_matrix_casts_most_in_game"]);
        if (list.hasOwnProperty("bob_kill")) list = await renameJsonKey([list, "bob_kill", "bob_kills"]);
        if (list.hasOwnProperty("bob_kill_most_in_game")) list = await renameJsonKey([list, "bob_kill_most_in_game", "bob_kills_most_in_game"]);
        if (list.hasOwnProperty("coach_gun_kill")) list = await renameJsonKey([list, "coach_gun_kill", "coach_gun_kills"]);
        if (list.hasOwnProperty("coach_gun_kill_most_in_game")) list = await renameJsonKey([list, "coach_gun_kill_most_in_game", "coach_gun_kills_most_in_game"]);
        if (list.hasOwnProperty("dynamite_kill")) list = await renameJsonKey([list, "dynamite_kill", "dynamite_kills"]);
        if (list.hasOwnProperty("dynamite_kill_most_in_game")) list = await renameJsonKey([list, "dynamite_kill_most_in_game", "dynamite_kills_most_in_game"]);
        if (list.hasOwnProperty("overload_kill")) list = await renameJsonKey([list, "overload_kill", "overload_kills"]);
        if (list.hasOwnProperty("overload_kill_most_in_game")) list = await renameJsonKey([list, "overload_kill_most_in_game", "overload_kills_most_in_game"]);
        if (list.hasOwnProperty("scoped_critical_hit_kill")) list = await renameJsonKey([list, "scoped_critical_hit_kill", "scoped_critical_hit_kills"]);
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

        if (owapi.eu.stats.quickplay != null) quickplay = owapi.eu.stats.quickplay.overall_stats;
        if (owapi.eu.stats.competitive != null) competitive = owapi.eu.stats.competitive.overall_stats;

        if (quickplay != null) {
            quickplay.player_id = playerId;
            quickplay.createDate = getBeginDate();
            quickplay.competitive = 0;
            quickplay.ties = 0;
            var result = await database.insert_file(["overall_stats", quickplay]);

            if (competitive != null) {
                competitive.player_id = playerId;
                competitive.createDate = getBeginDate();
                competitive.competitive = 1;
                result = await database.insert_file(["overall_stats", competitive]);
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

        if (owapi.eu.stats.quickplay != null) quickplay = owapi.eu.stats.quickplay.rolling_average_stats;
        if (owapi.eu.stats.competitive != null) competitive = owapi.eu.stats.competitive.rolling_average_stats;

        if (quickplay != null) {
            quickplay.player_id = playerId;
            quickplay.createDate = getBeginDate();
            quickplay.competitive = 0;
            var result = await database.insert_file(["rolling_average_stats", quickplay]);

            if (competitive != null) {
                competitive.player_id = playerId;
                competitive.createDate = getBeginDate();
                competitive.competitive = 1;
                result = await database.insert_file(["rolling_average_stats", competitive]);
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
            database.select(["players", "failCount", "id = " + playerId]).then(function(result, err) {
                if (err != null) {
                    console.log(err);
                    reject(err);
                }
                var failCount = result[0].failCount;

                if (owapi.error === "404" || owapi.error === "500" || typeof owapi.eu === "undefined") {
                    increaseFailCount(playerId, failCount);

                    if (failCount >= 50) {
                        database.update(["players", "active = 0", "id = " + playerId]).then(function(result, err) {
                            if (err != null) {
                                console.log(err);
                                reject(err);
                            }
                            if (debug.statistics) statistics.statistics.playersDeactivated++;
                            resolve(false);
                        });
                    } else {
                        resolve(false);
                    }
                } else {
                    if (failCount > 0)
                        resetFailCount(playerId);
                    resolve(true);
                }
            });
        } else {
            resolve(false);
        }
    });
}

function increaseFailCount(playerId, failCount) {
    if (debug.statistics) statistics.statistics.javascript.functionCalls++;
    if (debug.verbose) {
        console.log(getCurrentDate() + " Increasing Fail Count to " + (failCount + 1) + " for PlayerID " + playerId);
        console.log(getCurrentDate() + JSON.stringify(owapi, undefined, 4));
    }

    return new Promise(function(resolve, reject) {
        database.update(["players", "failCount = " + (failCount + 1), "id = " + playerId]).then(function(result, err) {
            if (err != null) {
                console.log(err);
                reject(err);
            }
            resolve(true);
        });
    });
}

function resetFailCount(playerId) {
    if (debug.statistics) statistics.statistics.javascript.functionCalls++;
    if (debug.verbose) {
        console.log(getCurrentDate() + " Resetting Fail Count for PlayerID " + playerId);
        console.log(getCurrentDate() + JSON.stringify(owapi, undefined, 4));
    }

    return new Promise(function(resolve, reject) {
        database.update(["players", "failCount = 0", "id = " + playerId]).then(function(result, err) {
            if (err != null) {
                console.log(err);
                reject(err);
            }
            resolve(true);
        });
    });
}

function deleteOldValues(retensionDays) {
    return new Promise(async function(resolve, reject) {
        if (debug.statistics) statistics.statistics.javascript.functionCalls++;
        if (debug.verbose) console.log(getCurrentDate() + " Beginning Database Cleanup...");

        if (debug.verbose) console.log(getCurrentDate() + " Cleaning rows in game_stats older than " + retensionDays + " days");
        await database.delete(["game_stats", "createDate < Date_Sub(NOW(), INTERVAL " + retensionDays + " DAY)"]);

        if (debug.verbose) console.log(getCurrentDate() + " Cleaning rows in hero_general_stats older than " + retensionDays + " days");
        await database.delete(["hero_general_stats", "createDate < Date_Sub(NOW(), INTERVAL " + retensionDays + " DAY)"]);

        if (debug.verbose) console.log(getCurrentDate() + " Cleaning rows in hero_specific_stats older than " + retensionDays + " days");
        await database.delete(["hero_specific_stats", "createDate < Date_Sub(NOW(), INTERVAL " + retensionDays + " DAY)"]);

        if (debug.verbose) console.log(getCurrentDate() + " Cleaning rows in rolling_average_stats older than " + retensionDays + " days");
        await database.delete(["rolling_average_stats", "createDate < Date_Sub(NOW(), INTERVAL " + retensionDays + " DAY)"]);

        if (debug.verbose) console.log(getCurrentDate() + " Cleaning rows in overall_stats older than " + retensionDays + " days");
        await database.delete(["overall_stats", "createDate < Date_Sub(NOW(), INTERVAL " + retensionDays + " DAY)"]);

        if (debug.verbose) console.log(getCurrentDate() + " Finished cleaning Database!");
        resolve(true);
    });
}

function writeDelayedInserts() {
    return new Promise(async function(resolve, reject) {
        if (debug.statistics) statistics.statistics.javascript.functionCalls++;
        if (debug.verbose) console.log(getCurrentDate() + " Beginning writing INSERTS into the Database...");

        fs.readdir(database.getTmpPath(), function(err, files) {
            if (err) {
                console.log(err);
                reject(err);
            }
            var itemsProcessed = 0;
            files.forEach(async function(file) {

                if (file.indexOf("load_data_") > -1) {
                    var tablename = file.substring(file.indexOf("load_data_") + 10);
                    if (debug.verbose) console.log(getCurrentDate() + " Writing INSERTs into " + tablename);
                    var result = await database.load_data(tablename);
                    if (debug.verbose) console.log(JSON.stringify(result, null, 2));
                }

                itemsProcessed++;
                if (itemsProcessed === files.length) {
                    if (debug.verbose) console.log(getCurrentDate() + " Finished writing INSERTs into the Database!");
                    resolve(true);
                }
            }, this);
        });
    });
}

function childCount(data) {
    var count = 0;
    for (var propName in data) {
        if (data.hasOwnProperty(propName)) {
            count++;
        }
    }
    return count;
}


database.connect().then(async function(response, err) {
    if (err) return;
    await deleteOldValues(8);

    database.select(["players", "id, battleTag", "active = 1 ORDER BY name ASC"]).then(function(playerList) {
        if (debug.statistics) statistics.statistics.players = playerList.length;
        updatePlayers(playerList, 0);
    });
});