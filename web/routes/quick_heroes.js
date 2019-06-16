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
            "gs_new.games_won, " +
            "gs_max.max_games_won, " +
            "gs_new.games_won - gs_old.games_won as games_won_change, " +
            "gs_new.eliminations / gs_new.deaths as kpd, " +
            "gs_max.max_kpd, " +
            "gs_new.eliminations / gs_new.deaths - gs_old.eliminations / gs_old.deaths as kpd_change, " +
            "gs_new.time_spent_on_fire / gs_new.time_played as on_fire_percentage, " +
            "gs_max.max_on_fire_percentage, " +
            "gs_new.time_spent_on_fire / gs_new.time_played - gs_old.time_spent_on_fire / gs_old.time_played as on_fire_percentage_change " +
            "FROM players player " +
            "INNER JOIN hero_general_stats gs_new ON gs_new.player_id = player.id " +
            "AND gs_new.competitive = 0 " +
            "AND gs_new.createDate = player.modifyDate " +
            "AND gs_new.games_won > 2 " +
            "INNER JOIN hero_general_stats gs_old ON gs_old.player_id = player.id " +
            "AND gs_old.competitive = 0 " +
            "AND gs_old.hero = gs_new.hero " +
            "AND gs_old.createDate = (SELECT Min(os.createDate) FROM overall_stats os WHERE os.createDate > Date_Sub(Now(), INTERVAL 7 DAY) AND os.competitive = 0 AND os.player_id = player.id) " +
            "INNER JOIN (SELECT pls.id as player_id, " +
            "Max(hgs.games_won) as max_games_won, " +
            "Max(hgs.eliminations / hgs.deaths) as max_kpd, " +
            "Max(hgs.time_spent_on_fire / time_played) as max_on_fire_percentage " +
            "FROM players pls " +
            "INNER JOIN hero_general_stats hgs ON hgs.player_id = pls.id " +
            "AND hgs.competitive = 0 " +
            "AND hgs.createDate = pls.modifyDate " +
            "WHERE hgs.games_won > 2 " +
            "GROUP BY pls.id) gs_max ON gs_max.player_id = player.id"
        );
        var _heroDataCombat = await database.query(
            "SELECT player.name, gs_new.hero, " +
            "(gs_new.eliminations / gs_new.games_won) as eliminations, " +
            "gs_max.max_eliminations, " +
            "IFNULL((gs_new.eliminations / gs_new.games_won) - (gs_old.eliminations / gs_old.games_won), 0) as eliminations_change, " +
            "(gs_new.objective_kills / gs_new.games_won) as objective_kills, " +
            "gs_max.max_objective_kills, " +
            "IFNULL((gs_new.objective_kills / gs_new.games_won) - (gs_old.objective_kills / gs_old.games_won), 0) as objective_kills_change, " +
            "(gs_new.objective_time / gs_new.games_won) * 60 as objective_time, " +
            "gs_max.max_objective_time, " +
            "IFNULL((gs_new.objective_time / gs_new.games_won) * 60 - (gs_old.objective_time / gs_old.games_won) * 60, 0) as objective_time_change, " +
            "(gs_new.all_damage_done / gs_new.games_won) as all_damage_done, " +
            "gs_max.max_all_damage_done, " +
            "IFNULL((gs_new.all_damage_done / gs_new.games_won) - (gs_old.all_damage_done / gs_old.games_won), 0) as all_damage_done_change, " +
            "(gs_new.healing_done / gs_new.games_won) as healing_done, " +
            "gs_max.max_healing_done, " +
            "IFNULL((gs_new.healing_done / gs_new.games_won) - (gs_old.healing_done / gs_old.games_won), 0) as healing_done_change, " +
            "(ss_new.damage_blocked / gs_new.games_won) as damage_blocked, " +
            "gs_max.max_damage_blocked, " +
            "IFNULL((ss_new.damage_blocked / gs_new.games_won) - (ss_old.damage_blocked / gs_old.games_won), 0) as damage_blocked_change, " +
            "(gs_new.deaths / gs_new.games_won) as deaths, " +
            "gs_max.max_deaths, " +
            "IFNULL((gs_new.deaths / gs_new.games_won) - (gs_old.deaths / gs_old.games_won), 0) as deaths_change " +
            "FROM players player " +
            "INNER JOIN hero_general_stats gs_new ON gs_new.player_id = player.id AND gs_new.competitive = 0 AND gs_new.createDate = player.modifyDate " +
            "INNER JOIN hero_general_stats gs_old ON gs_old.player_id = player.id AND gs_old.competitive = 0 AND gs_old.hero = gs_new.hero AND gs_old.createDate = " +
            "(SELECT Min(createDate) FROM overall_stats WHERE createDate > Date_Sub(Now(), INTERVAL 7 DAY) AND competitive = 0 AND player_id = player.id) " +
            "INNER JOIN hero_specific_stats ss_new ON ss_new.player_id = player.id AND ss_new.competitive = 0 AND ss_new.createDate = player.modifyDate AND ss_new.hero = gs_new.hero " +
            "INNER JOIN hero_specific_stats ss_old ON ss_old.player_id = player.id AND ss_old.competitive = 0 AND ss_old.hero = gs_new.hero AND ss_old.createDate = gs_old.createDate AND ss_old.hero = gs_new.hero " +
            "INNER JOIN (SELECT pls.id as player_id, " +
            "Max(hgs.eliminations / hgs.games_won) as max_eliminations, " +
            "Max(hgs.objective_kills / hgs.games_won) as max_objective_kills, " +
            "Max(hgs.objective_time / hgs.games_won) * 60 as max_objective_time, " +
            "Max(hgs.all_damage_done / hgs.games_won) as max_all_damage_done, " +
            "Max(hgs.healing_done / hgs.games_won) as max_healing_done, " +
            "Max(hss.damage_blocked / hgs.games_won) as max_damage_blocked, " +
            "Max(hgs.deaths / hgs.games_won) as max_deaths " +
            "FROM players pls " +
            "INNER JOIN hero_general_stats hgs ON hgs.player_id = pls.id AND hgs.competitive = 0 AND hgs.createDate = pls.modifyDate " +
            "INNER JOIN hero_specific_stats hss ON hss.player_id = pls.id AND hss.competitive = 0 AND hss.createDate = pls.modifyDate AND hss.hero = hgs.hero " +
            "WHERE hgs.games_won > 2 " +
            "GROUP BY pls.id) gs_max ON gs_max.player_id = player.id " +
            "WHERE gs_new.games_won > 2"
        );
        var _heroDataEliminations = await database.query(
            "SELECT player.name, gs_new.hero, " +
            "gs_new.eliminations_per_life as kpd, gs_max.max_kpd, " +
            "(gs_new.eliminations / gs_new.games_won) as eliminations, gs_max.max_eliminations, " +
            "(gs_new.solo_kills / gs_new.games_won) as solo_kills, gs_max.max_solo_kills, " +
            "(gs_new.final_blows / gs_new.games_won) as final_blows, gs_max.max_final_blows " +
            "FROM players player " +
            "INNER JOIN hero_general_stats gs_new ON gs_new.player_id = player.id AND gs_new.competitive = 0 AND gs_new.createDate = player.modifyDate " +
            "INNER JOIN (SELECT pls.id as player_id, " +
            "Max(hgs.eliminations / hgs.games_won) as max_eliminations, " +
            "Max(hgs.eliminations_per_life) as max_kpd, " +
            "Max(hgs.solo_kills / hgs.games_won) as max_solo_kills, " +
            "Max(hgs.final_blows / hgs.games_won) as max_final_blows " +
            "FROM players pls " +
            "INNER JOIN hero_general_stats hgs ON hgs.player_id = pls.id AND hgs.competitive = 0 AND hgs.createDate = pls.modifyDate " +
            "WHERE hgs.games_won > 2 " +
            "GROUP BY pls.id) gs_max ON gs_max.player_id = player.id " +
            "WHERE gs_new.games_won > 2"
        );
        var _heroDataMedals = await database.query(
            "SELECT player.name, gs_new.hero, " +
            "(gs_new.medals / gs_new.games_won) as medals, gs_max.max_medals, " +
            "(gs_new.medals_gold / gs_new.games_won) as medals_gold, gs_max.max_medals_gold, " +
            "(gs_new.medals_silver / gs_new.games_won) as medals_silver, gs_max.max_medals_silver, " +
            "(gs_new.medals_bronze / gs_new.games_won) as medals_bronze, gs_max.max_medals_bronze, " +
            "(gs_new.cards / gs_new.games_won) as cards, gs_max.max_cards " +
            "FROM players player " +
            "INNER JOIN hero_general_stats gs_new ON gs_new.player_id = player.id AND gs_new.competitive = 0 AND gs_new.createDate = player.modifyDate " +
            "INNER JOIN (SELECT pls.id as player_id, " +
            "Max(hgs.medals / hgs.games_won) as max_medals, " +
            "Max(hgs.medals_gold / hgs.games_won) as max_medals_gold, " +
            "Max(hgs.medals_silver / hgs.games_won) as max_medals_silver, " +
            "Max(hgs.medals_bronze / hgs.games_won) as max_medals_bronze, " +
            "Max(hgs.cards / hgs.games_won) as max_cards " +
            "FROM players pls " +
            "INNER JOIN hero_general_stats hgs ON hgs.player_id = pls.id AND hgs.competitive = 0 AND hgs.createDate = pls.modifyDate " +
            "WHERE hgs.games_won > 2 " +
            "GROUP BY pls.id) gs_max ON gs_max.player_id = player.id " +
            "WHERE gs_new.games_won > 2"
        );
        database.disconnect().then(function () {
            res.render("pages/quick_heroes", {
                breadcrumb: {
                    title: "Heroes",
                    description: "Hero stats of quickplay mode of the current ranked season.",
                    area: "Quickplay"
                },
                footer: {
                    jsname: 'datatable-quick-heroes.js',
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
