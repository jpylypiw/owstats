/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Exportiere Struktur von Tabelle owstats.game_stats
DROP TABLE IF EXISTS `game_stats`;
CREATE TABLE IF NOT EXISTS `game_stats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `player_id` int(11),
  `competitive` bit(1) NOT NULL,
  `eliminations` double NOT NULL DEFAULT '0',
  `final_blows` double NOT NULL DEFAULT '0',
  `healing_done_most_in_game` double NOT NULL DEFAULT '0',
  `overwatchguid0x086000000000052a` double NOT NULL DEFAULT '0',
  `solo_kills` double NOT NULL DEFAULT '0',
  `medals_silver` double NOT NULL DEFAULT '0',
  `kill_streak_best` double NOT NULL DEFAULT '0',
  `defensive_assists_most_in_game` double NOT NULL DEFAULT '0',
  `cards` double NOT NULL DEFAULT '0',
  `recon_assists` double NOT NULL DEFAULT '0',
  `kpd` double NOT NULL DEFAULT '0',
  `objective_kills_most_in_game` double NOT NULL DEFAULT '0',
  `melee_final_blows_most_in_game` double NOT NULL DEFAULT '0',
  `turrets_destroyed` double NOT NULL DEFAULT '0',
  `teleporter_pads_destroyed_most_in_game` double NOT NULL DEFAULT '0',
  `time_spent_on_fire_most_in_game` double NOT NULL DEFAULT '0',
  `medals_bronze` double NOT NULL DEFAULT '0',
  `recon_assists_most_in_game` double NOT NULL DEFAULT '0',
  `shield_generators_destroyed_most_in_game` double NOT NULL DEFAULT '0',
  `objective_time` double NOT NULL DEFAULT '0',
  `hero_damage_done` double NOT NULL DEFAULT '0',
  `offensive_assists_most_in_game` double NOT NULL DEFAULT '0',
  `all_damage_done_most_in_game` double NOT NULL DEFAULT '0',
  `environmental_kills` double NOT NULL DEFAULT '0',
  `multikills` double NOT NULL DEFAULT '0',
  `time_spent_on_fire` double NOT NULL DEFAULT '0',
  `games_played` double NOT NULL DEFAULT '0',
  `games_won` double NOT NULL DEFAULT '0',
  `games_tied` double NOT NULL DEFAULT '0',
  `games_lost` double NOT NULL DEFAULT '0',
  `defensive_assists` double NOT NULL DEFAULT '0',
  `deaths` double NOT NULL DEFAULT '0',
  `offensive_assists` double NOT NULL DEFAULT '0',
  `healing_done` double NOT NULL DEFAULT '0',
  `shield_generators_destroyed` double NOT NULL DEFAULT '0',
  `eliminations_most_in_game` double NOT NULL DEFAULT '0',
  `barrier_damage_done` double NOT NULL DEFAULT '0',
  `objective_kills` double NOT NULL DEFAULT '0',
  `final_blows_most_in_game` double NOT NULL DEFAULT '0',
  `medals_gold` double NOT NULL DEFAULT '0',
  `medals` double NOT NULL DEFAULT '0',
  `all_damage_done` double NOT NULL DEFAULT '0',
  `time_played` double NOT NULL DEFAULT '0',
  `turrets_destroyed_most_in_game` double NOT NULL DEFAULT '0',
  `objective_time_most_in_game` double NOT NULL DEFAULT '0',
  `melee_final_blows` double NOT NULL DEFAULT '0',
  `solo_kills_most_in_game` double NOT NULL DEFAULT '0',
  `teleporter_pads_destroyed` double NOT NULL DEFAULT '0',
  `environmental_kills_most_in_game` double NOT NULL DEFAULT '0',
  `multikill_best` double NOT NULL DEFAULT '0',
  `hero_damage_done_most_in_game` double NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `createDate` (`createDate`),
  KEY `FK_game_stats_players` (`player_id`),
  CONSTRAINT `FK_game_stats_players` FOREIGN KEY (`player_id`) REFERENCES `players` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Daten Export vom Benutzer nicht ausgewählt


-- Exportiere Struktur von Tabelle owstats.overall_stats
DROP TABLE IF EXISTS `overall_stats`;
CREATE TABLE IF NOT EXISTS `overall_stats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `player_id` int(11),
  `competitive` bit(1) NOT NULL,
  `level` tinyint(4) DEFAULT NULL,
  `comprank` smallint(6) DEFAULT NULL,
  `games` int(11) DEFAULT NULL,
  `win_rate` float DEFAULT NULL,
  `losses` int(11) DEFAULT NULL,
  `rank_image` varchar(100) DEFAULT NULL,
  `wins` int(11) DEFAULT NULL,
  `ties` int(11) DEFAULT NULL,
  `prestige` tinyint(4) DEFAULT NULL,
  `avatar` varchar(100) DEFAULT NULL,
  `tier` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `comprank` (`comprank`),
  KEY `tier` (`tier`),
  KEY `FK__players` (`player_id`),
  KEY `createDate` (`createDate`),
  CONSTRAINT `overall_stats_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `players` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Daten Export vom Benutzer nicht ausgewählt


-- Exportiere Struktur von Tabelle owstats.players
DROP TABLE IF EXISTS `players`;
CREATE TABLE IF NOT EXISTS `players` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `createDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `modifyDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `battleTag` varchar(25) DEFAULT NULL,
  `active` bit(1) DEFAULT b'1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `battleTag` (`battleTag`),
  KEY `active` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Daten Export vom Benutzer nicht ausgewählt


-- Exportiere Struktur von Tabelle owstats.rolling_average_stats
DROP TABLE IF EXISTS `rolling_average_stats`;
CREATE TABLE IF NOT EXISTS `rolling_average_stats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `player_id` int(11) DEFAULT NULL,
  `competitive` bit(1) NOT NULL,
  `solo_kills` float DEFAULT '0',
  `hero_damage_done` float DEFAULT '0',
  `objective_time` float DEFAULT '0',
  `final_blows` float DEFAULT '0',
  `healing_done` float DEFAULT '0',
  `deaths` float DEFAULT '0',
  `all_damage_done` float DEFAULT '0',
  `eliminations` float DEFAULT '0',
  `objective_kills` float DEFAULT '0',
  `time_spent_on_fire` float DEFAULT '0',
  `barrier_damage_done` float DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `competitive` (`competitive`),
  KEY `FK__players` (`player_id`),
  KEY `createDate` (`createDate`),
  CONSTRAINT `FK__players` FOREIGN KEY (`player_id`) REFERENCES `players` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Daten Export vom Benutzer nicht ausgewählt
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
