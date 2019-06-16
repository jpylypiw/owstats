var express = require("express");
var router = express.Router();
var now = require("performance-now");
var database = require("../../functions/database.js");

router.get("/", async function (req, res, next) {
    try {
        await database.connect();
        var _compGeneralOverview = await database.query(
            "SELECT player.name, " +
            "player.battleTag, " +
            "os_new.avatar, " +
            "IFNULL(os_new.tier_image, '/images/icons/question.png') as tier_image, " +
            "IFNULL(os_new.tier, 'unranked') as tier, " +
            "IFNULL(os_new.comprank, 0) as comprank, " +
            "IFNULL(os_new.comprank - os_old.comprank, 0) AS comprank_change, " +
            "os_new.rank_image, " +
            "os_new.prestige * 100 + os_new.`level` as `level`, " +
            "os_new.`level` - os_old.`level` as level_change, " +
            "gs_new.games_played, " +
            "gs_new.games_won, " +
            "gs_new.games_tied, " +
            "gs_new.games_lost, " +
            "(gs_new.games_played - gs_old.games_played) games_played_change, " +
            "(gs_new.games_won - gs_old.games_won) games_won_change, " +
            "(gs_new.games_tied - gs_old.games_tied) games_tied_change, " +
            "(gs_new.games_lost - gs_old.games_lost) games_lost_change, " +
            "os_new.win_rate, " +
            "IFNULL(os_new.win_rate - os_old.win_rate, 0) AS win_rate_change, " +
            "(gs_new.time_spent_on_fire / gs_new.time_played) as on_fire, " +
            "(gs_new.time_spent_on_fire / gs_new.time_played) - (gs_old.time_spent_on_fire / gs_old.time_played) as on_fire_change, " +
            "gs_new.kpd, " +
            "gs_new.kpd - gs_old.kpd as kpd_change " +
            "FROM players player " +
            "INNER JOIN overall_stats os_new ON os_new.player_id = player.id AND os_new.competitive = 1 AND os_new.createDate = player.modifyDate " +
            "INNER JOIN overall_stats os_old ON os_old.player_id = player.id AND os_old.competitive = 1 AND os_old.createDate = ( " +
            "SELECT Min(createDate) FROM overall_stats WHERE createDate > Date_Sub(Now(), INTERVAL 7 DAY) AND competitive = 1 AND player_id = player.id) " +
            "INNER JOIN game_stats gs_new ON gs_new.player_id = player.id AND gs_new.competitive = 1 AND gs_new.createDate = player.modifyDate " +
            "INNER JOIN game_stats gs_old ON gs_old.player_id = player.id AND gs_old.competitive = 1 AND gs_old.createDate = os_old.createDate " +
            "WHERE gs_new.games_played > 2"
        );
        var _compGeneralRoles = await database.query(
            "SELECT pls.name, " +
            "pls.battleTag, " +
            "os.avatar, " +
            "off_hero.time_played as off_time_played, " +
            "off_hero.games_played as off_games_played, " +
            "tank_hero.time_played as tank_time_played, " +
            "tank_hero.games_played as tank_games_played, " +
            "supp_hero.time_played as supp_time_played, " +
            "supp_hero.games_played as supp_games_played " +
            "FROM players pls " +
            "INNER JOIN overall_stats os ON os.player_id = pls.id AND os.competitive = 1 AND os.createDate = pls.modifyDate " +
            "LEFT OUTER JOIN( " +
            "SELECT hero_general_stats.player_id, " +
            "SUM(hero_general_stats.time_played) AS time_played, " +
            "SUM(hero_general_stats.games_played) AS games_played " +
            "FROM hero_general_stats, players " +
            "WHERE hero_general_stats.hero IN('genji', 'mccree', 'soldier76', 'tracer', 'pharah', 'reaper', 'sombra', 'doomfist', 'junkrat', 'widowmaker', 'hanzo', 'mei', 'torbjorn', 'bastion', 'symmetra') " +
            "AND hero_general_stats.competitive = 1 " +
            "AND hero_general_stats.createDate = players.modifyDate " +
            "AND hero_general_stats.player_id = players.id " +
            "GROUP BY hero_general_stats.player_id " +
            ") AS off_hero ON off_hero.player_id = pls.id " +
            "LEFT OUTER JOIN( " +
            "SELECT hero_general_stats.player_id, " +
            "SUM(hero_general_stats.time_played) AS time_played, " +
            "SUM(hero_general_stats.games_played) AS games_played " +
            "FROM hero_general_stats, players " +
            "WHERE hero_general_stats.hero IN('dva', 'reinhardt', 'roadhog', 'winston', 'zarya', 'orisa', 'wrecking_b') " +
            "AND hero_general_stats.competitive = 1 " +
            "AND hero_general_stats.createDate = players.modifyDate " +
            "AND hero_general_stats.player_id = players.id " +
            "GROUP BY hero_general_stats.player_id " +
            ") AS tank_hero ON tank_hero.player_id = pls.id " +
            "LEFT OUTER JOIN( " +
            "SELECT hero_general_stats.player_id, " +
            "SUM(hero_general_stats.time_played) AS time_played, " +
            "SUM(hero_general_stats.games_played) AS games_played " +
            "FROM hero_general_stats, players " +
            "WHERE hero_general_stats.hero IN('moira', 'mercy', 'zenyatta', 'ana', 'lucio', 'brigitte') " +
            "AND hero_general_stats.competitive = 1 " +
            "AND hero_general_stats.createDate = players.modifyDate " +
            "AND hero_general_stats.player_id = players.id " +
            "GROUP BY hero_general_stats.player_id " +
            ") AS supp_hero ON supp_hero.player_id = pls.id"
        );
        var _compGeneralCombat = await database.query(
            "SELECT pls.name, " +
            "pls.battleTag, " +
            "os_new.avatar, " +
            "(gs_new.eliminations / gs_new.games_played) AS eliminations, " +
            "gs_max.max_eliminations, " +
            "IFNULL((gs_new.eliminations / gs_new.games_played) - (gs_old.eliminations / gs_old.games_played), 0) as eliminations_change, " +
            "(gs_new.objective_kills / gs_new.games_played) as objective_kills, " +
            "gs_max.max_objective_kills, " +
            "IFNULL((gs_new.objective_kills / gs_new.games_played) - (gs_old.objective_kills / gs_old.games_played), 0) as objective_kills_change, " +
            "(gs_new.objective_time / gs_new.games_played) * 60 as objective_time, " +
            "gs_max.max_objective_time, " +
            "IFNULL((gs_new.objective_time / gs_new.games_played) * 60 - (gs_old.objective_time / gs_old.games_played) * 60, 0) as objective_time_change, " +
            "(gs_new.all_damage_done / gs_new.games_played) as all_damage_done, " +
            "gs_max.max_all_damage_done, " +
            "IFNULL((gs_new.all_damage_done / gs_new.games_played) - (gs_old.all_damage_done / gs_old.games_played), 0) as all_damage_done_change, " +
            "(gs_new.healing_done / gs_new.games_played) as healing_done, " +
            "gs_max.max_healing_done, " +
            "IFNULL((gs_new.healing_done / gs_new.games_played) - (gs_old.healing_done / gs_old.games_played), 0) as healing_done_change, " +
            "(ss_new.damage_blocked / gs_new.games_played) as damage_blocked, " +
            "gs_max.max_damage_blocked, " +
            "IFNULL((ss_new.damage_blocked / gs_new.games_played) - (ss_old.damage_blocked / gs_old.games_played), 0) as damage_blocked_change, " +
            "(gs_new.deaths / gs_new.games_played) as deaths, " +
            "gs_max.max_deaths, " +
            "IFNULL((gs_new.deaths / gs_new.games_played) - (gs_old.deaths / gs_old.games_played), 0) as deaths_change " +
            "FROM players pls " +
            "INNER JOIN overall_stats os_new ON os_new.player_id = pls.id AND os_new.competitive = 1 AND os_new.createDate = pls.modifyDate " +
            "INNER JOIN game_stats gs_new ON gs_new.player_id = pls.id AND gs_new.competitive = 1 AND gs_new.createDate = pls.modifyDate " +
            "INNER JOIN overall_stats os_old ON os_old.player_id = pls.id AND os_old.competitive = 1 AND os_old.createDate =  " +
            "(SELECT Min(createDate) FROM overall_stats WHERE createDate > Date_Sub(Now(), INTERVAL 7 DAY) AND competitive = 1 AND player_id = pls.id) " +
            "INNER JOIN game_stats gs_old ON gs_old.player_id = pls.id AND gs_old.competitive = 1 AND gs_old.createDate = os_old.createDate " +
            "INNER JOIN ( " +
            "SELECT pls_new_tmp.id AS player_id, " +
            "SUM(hss_new_tmp.damage_blocked) AS damage_blocked " +
            "FROM players pls_new_tmp " +
            "INNER JOIN hero_specific_stats hss_new_tmp ON hss_new_tmp.player_id = pls_new_tmp.id AND hss_new_tmp.competitive = 1 AND hss_new_tmp.createDate = pls_new_tmp.modifyDate " +
            "GROUP BY pls_new_tmp.id " +
            ") AS ss_new ON ss_new.player_id = pls.id " +
            "INNER JOIN ( " +
            "SELECT pls_old_tmp.id AS player_id, " +
            "SUM(hss_old_tmp.damage_blocked) AS damage_blocked " +
            "FROM players pls_old_tmp " +
            "INNER JOIN hero_specific_stats hss_old_tmp ON hss_old_tmp.player_id = pls_old_tmp.id AND hss_old_tmp.competitive = 1 AND hss_old_tmp.createDate =  " +
            "(SELECT Min(createDate) FROM overall_stats WHERE createDate > Date_Sub(Now(), INTERVAL 7 DAY) AND competitive = 1 AND player_id = pls_old_tmp.id) " +
            "GROUP BY pls_old_tmp.id " +
            ") AS ss_old ON ss_old.player_id = pls.id " +
            "LEFT JOIN ( " +
            "SELECT Max(gs_max.eliminations / gs_max.games_played) AS max_eliminations, " +
            "Max(gs_max.objective_kills / gs_max.games_played) AS max_objective_kills, " +
            "Max(gs_max.objective_time / gs_max.games_played) AS max_objective_time, " +
            "Max(gs_max.all_damage_done / gs_max.games_played) AS max_all_damage_done, " +
            "Max(gs_max.healing_done / gs_max.games_played) AS max_healing_done, " +
            "Max(hss_max.damage_blocked / gs_max.games_played) AS max_damage_blocked, " +
            "Max(gs_max.deaths / gs_max.games_played) AS max_deaths " +
            "FROM players pls_max " +
            "LEFT OUTER JOIN game_stats gs_max ON gs_max.player_id = pls_max.id AND gs_max.competitive = 1 AND gs_max.createDate = pls_max.modifyDate " +
            "LEFT JOIN ( " +
            "SELECT pls_max2.id AS player_id, " +
            "SUM(hss_max2.damage_blocked) AS damage_blocked " +
            "FROM players pls_max2 " +
            "INNER JOIN hero_specific_stats hss_max2 ON hss_max2.player_id = pls_max2.id AND hss_max2.competitive = 1 AND hss_max2.createDate = pls_max2.modifyDate " +
            "GROUP BY pls_max2.id " +
            ") AS hss_max ON hss_max.player_id = pls_max.id " +
            ") AS gs_max ON 1 = 1 "
        );
        var _compGeneralMedals = await database.query(
            "SELECT SQL_NO_CACHE pls.name, " +
            "pls.battleTag, " +
            "os_new.avatar, " +
            "os_new.`level`, " +
            "os_new.rank_image, " +
            "(gs_new.medals / gs_new.games_played) AS medals, " +
            "ROUND((gs_new.medals / gs_new.games_played) - (gs_old.medals / gs_old.games_played), 2) AS medals_change, " +
            "gs_max.max_medals, " +
            "(gs_new.medals_gold / gs_new.games_played) AS medals_gold, " +
            "ROUND((gs_new.medals_gold / gs_new.games_played) - (gs_old.medals_gold / gs_old.games_played), 2) AS medals_gold_change, " +
            "gs_new.medals_gold AS medals_gold_total, " +
            "gs_max.max_medals_gold, " +
            "(gs_new.medals_silver / gs_new.games_played) AS medals_silver, " +
            "ROUND((gs_new.medals_silver / gs_new.games_played) - (gs_old.medals_silver / gs_old.games_played), 2) AS medals_silver_change, " +
            "gs_max.max_medals_silver, " +
            "(gs_new.medals_bronze / gs_new.games_played) AS medals_bronze, " +
            "ROUND((gs_new.medals_bronze / gs_new.games_played) - (gs_old.medals_bronze / gs_old.games_played), 2) AS medals_bronze_change, " +
            "gs_max.max_medals_bronze, " +
            "(gs_new.cards / gs_new.games_played) AS cards, " +
            "ROUND((gs_new.cards / gs_new.games_played) - (gs_old.cards / gs_old.games_played), 2) AS cards_change, " +
            "gs_max.max_cards " +
            "FROM players pls " +
            "INNER JOIN game_stats gs_new ON gs_new.player_id = pls.id AND gs_new.competitive = 1 AND gs_new.createDate = pls.modifyDate " +
            "INNER JOIN game_stats gs_old ON gs_old.player_id = pls.id AND gs_old.competitive = 1 AND gs_old.createDate = " +
            "(SELECT Min(createDate) FROM overall_stats WHERE createDate > Date_Sub(Now(), INTERVAL 7 DAY) AND competitive = 1 AND player_id = pls.id) " +
            "INNER JOIN overall_stats os_new ON os_new.player_id = pls.id AND os_new.competitive = 1 AND os_new.createDate = pls.modifyDate " +
            "LEFT JOIN ( " +
            "SELECT Max(gs_temp.medals / gs_temp.games_played) AS max_medals, " +
            "Max(gs_temp.medals_gold / gs_temp.games_played) AS max_medals_gold, " +
            "Max(gs_temp.medals_silver / gs_temp.games_played) AS max_medals_silver, " +
            "Max(gs_temp.medals_bronze / gs_temp.games_played) AS max_medals_bronze, " +
            "Max(gs_temp.cards / gs_temp.games_played) AS max_cards " +
            "FROM players pls_temp " +
            "LEFT OUTER JOIN game_stats gs_temp ON gs_temp.player_id = pls_temp.id AND gs_temp.competitive = 1 AND gs_temp.createDate = pls_temp.modifyDate " +
            ") gs_max ON 1 = 1"
        );
        database.disconnect().then(function () {
            res.render("pages/comp_general", {
                breadcrumb: {
                    title: "General",
                    description: "The general overall stats of the current season.",
                    area: "Competitive"
                },
                footer: {
                    jsname: "datatable-comp-general.js",
                    now: now,
                    startTime: now()
                },
                compGeneralOverview: _compGeneralOverview,
                compGeneralRoles: _compGeneralRoles,
                compGeneralCombat: _compGeneralCombat,
                compGeneralMedals: _compGeneralMedals,
                url: req.originalUrl
            });
        });
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;
