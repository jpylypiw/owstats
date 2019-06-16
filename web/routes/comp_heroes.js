var express = require("express");
var router = express.Router();
var now = require("performance-now");
var database = require("../../functions/database.js");

router.get("/", async function (req, res, next) {
    try {
        await database.connect();
        var _heroDataOverview = await database.query(
            "SELECT player.name, " +
            "gs_new.hero, " +
            "gs_new.time_played, " +
            "gs_new.games_played, gs_max.max_games_played, " +
            "gs_new.win_percentage, gs_max.max_win_percentage, " +
            "gs_new.eliminations_per_life as kpd, gs_max.max_kpd, " +
            "(gs_new.time_spent_on_fire / gs_new.time_played) as on_fire_percentage, gs_max.max_on_fire_percentage " +
            "FROM players player " +
            "INNER JOIN hero_general_stats gs_new ON gs_new.player_id = player.id AND gs_new.competitive = 1 AND gs_new.createDate = player.modifyDate " +
            "INNER JOIN (SELECT pls.id as player_id, Max(hgs.games_played) as max_games_played, Max(hgs.win_percentage) as max_win_percentage, Max(hgs.eliminations_per_life) as max_kpd , Max(hgs.time_spent_on_fire / time_played) as max_on_fire_percentage " +
            "FROM players pls " +
            "INNER JOIN hero_general_stats hgs ON hgs.player_id = pls.id AND hgs.competitive = 1 AND hgs.createDate = pls.modifyDate " +
            "WHERE hgs.games_played > 2 " +
            "GROUP BY pls.id) gs_max ON gs_max.player_id = player.id " +
            "WHERE gs_new.games_played > 2"
        );
        var _heroDataCombat = await database.query(
            "SELECT player.name, " +
            "gs_new.hero, " +
            "(gs_new.eliminations / gs_new.games_played) as eliminations, gs_max.max_eliminations, " +
            "(gs_new.objective_kills / gs_new.games_played) as objective_kills, gs_max.max_objective_kills, " +
            "(gs_new.objective_time / gs_new.games_played) * 60 as objective_time, gs_max.max_objective_time, " +
            "(gs_new.all_damage_done / gs_new.games_played) as all_damage_done, gs_max.max_all_damage_done, " +
            "(gs_new.healing_done / gs_new.games_played) as healing_done, gs_max.max_healing_done, " +
            "(ss_new.damage_blocked / gs_new.games_played) as damage_blocked, gs_max.max_damage_blocked, " +
            "(gs_new.deaths / gs_new.games_played) as deaths, gs_max.max_deaths " +
            "FROM players player " +
            "INNER JOIN hero_general_stats gs_new ON gs_new.player_id = player.id AND gs_new.competitive = 1 AND gs_new.createDate = player.modifyDate AND gs_new.games_played > 2 " +
            "INNER JOIN hero_specific_stats ss_new ON ss_new.player_id = player.id AND ss_new.competitive = 1 AND ss_new.createDate = player.modifyDate AND ss_new.hero = gs_new.hero " +
            "INNER JOIN ( " +
            "    SELECT pls.id as player_id, " +
            "    Max(hgs.eliminations / hgs.games_played) as max_eliminations, " +
            "    Max(hgs.objective_kills / hgs.games_played) as max_objective_kills, " +
            "    Max(hgs.objective_time / hgs.games_played) * 60 as max_objective_time, " +
            "    Max(hgs.all_damage_done / hgs.games_played) as max_all_damage_done, " +
            "    Max(hgs.healing_done / hgs.games_played) as max_healing_done, " +
            "    Max(hss.damage_blocked / hgs.games_played) as max_damage_blocked, " +
            "    Max(hgs.deaths / hgs.games_played) as max_deaths " +
            "    FROM players pls " +
            "    INNER JOIN hero_general_stats hgs ON hgs.player_id = pls.id AND hgs.competitive = 1 AND hgs.createDate = pls.modifyDate AND hgs.games_played > 2 " +
            "    INNER JOIN hero_specific_stats hss ON hss.player_id = pls.id AND hss.competitive = 1 AND hss.createDate = pls.modifyDate AND hss.hero = hgs.hero " +
            "    GROUP BY pls.id " +
            ") gs_max ON gs_max.player_id = player.id " +
            "ORDER BY player.name, gs_new.hero"
        );
        var _heroDataEliminations = await database.query(
            "SELECT player.name, gs_new.hero, " +
            "gs_new.eliminations_per_life as kpd, gs_max.max_kpd, " +
            "(gs_new.eliminations / gs_new.games_played) as eliminations, gs_max.max_eliminations, " +
            "(gs_new.solo_kills / gs_new.games_played) as solo_kills, gs_max.max_solo_kills, " +
            "(gs_new.final_blows / gs_new.games_played) as final_blows, gs_max.max_final_blows " +
            "FROM players player " +
            "INNER JOIN hero_general_stats gs_new ON gs_new.player_id = player.id AND gs_new.competitive = 1 AND gs_new.createDate = player.modifyDate " +
            "INNER JOIN (SELECT pls.id as player_id, " +
            "Max(hgs.eliminations / hgs.games_played) as max_eliminations, " +
            "Max(hgs.eliminations_per_life) as max_kpd, " +
            "Max(hgs.solo_kills / hgs.games_played) as max_solo_kills, " +
            "Max(hgs.final_blows / hgs.games_played) as max_final_blows " +
            "FROM players pls " +
            "INNER JOIN hero_general_stats hgs ON hgs.player_id = pls.id AND hgs.competitive = 1 AND hgs.createDate = pls.modifyDate " +
            "WHERE hgs.games_played > 2 " +
            "GROUP BY pls.id) gs_max ON gs_max.player_id = player.id " +
            "WHERE gs_new.games_played > 2"
        );
        var _heroDataMedals = await database.query(
            "SELECT player.name, gs_new.hero, " +
            "(gs_new.medals / gs_new.games_played) as medals, gs_max.max_medals, " +
            "(gs_new.medals_gold / gs_new.games_played) as medals_gold, gs_max.max_medals_gold, " +
            "(gs_new.medals_silver / gs_new.games_played) as medals_silver, gs_max.max_medals_silver, " +
            "(gs_new.medals_bronze / gs_new.games_played) as medals_bronze, gs_max.max_medals_bronze, " +
            "(gs_new.cards / gs_new.games_played) as cards, gs_max.max_cards " +
            "FROM players player " +
            "INNER JOIN hero_general_stats gs_new ON gs_new.player_id = player.id AND gs_new.competitive = 1 AND gs_new.createDate = player.modifyDate " +
            "INNER JOIN (SELECT pls.id as player_id, " +
            "Max(hgs.medals / hgs.games_played) as max_medals, " +
            "Max(hgs.medals_gold / hgs.games_played) as max_medals_gold, " +
            "Max(hgs.medals_silver / hgs.games_played) as max_medals_silver, " +
            "Max(hgs.medals_bronze / hgs.games_played) as max_medals_bronze, " +
            "Max(hgs.cards / hgs.games_played) as max_cards " +
            "FROM players pls " +
            "INNER JOIN hero_general_stats hgs ON hgs.player_id = pls.id AND hgs.competitive = 1 AND hgs.createDate = pls.modifyDate " +
            "WHERE hgs.games_played > 2 " +
            "GROUP BY pls.id) gs_max ON gs_max.player_id = player.id " +
            "WHERE gs_new.games_played > 2"
        );
        database.disconnect().then(function () {
            res.render("pages/comp_heroes", {
                breadcrumb: {
                    title: "Heroes",
                    description: "Hero specific statistics for competitive games.",
                    area: "Competitive"
                },
                footer: {
                    jsname: 'datatable-comp-heroes.js',
                    now: now,
                    startTime: now()
                },
                heroDataOverview: _heroDataOverview,
                heroDataCombat: _heroDataCombat,
                heroDataEliminations: _heroDataEliminations,
                heroDataMedals: _heroDataMedals,
                url: req.originalUrl
            });
        });
    } catch (e) {
        next(e);
    }
});

module.exports = router;
