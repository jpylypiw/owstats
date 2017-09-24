// database.js
// ======
// Handle the database connection properly.
// ======

const settings = require("../config/database");
const mysql = require("mysql");
const debug = require("../config/debug");
const statistics = require("../functions/statistics");

module.exports = {
    connection: null,
    connect: function() {
        if (debug.statistics) statistics.statistics.javascript.functionCalls++;

        return new Promise(function(resolve, reject) {
            this.connection = mysql.createConnection({
                host: settings.host,
                user: settings.user,
                password: settings.password,
                database: settings.database
            });

            this.connection.connect(function(err) {
                if (debug.verbose) console.log("Connecting Database...");

                if (err) {
                    throw err;
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    },
    disconnect: function() {
        if (debug.statistics) statistics.statistics.javascript.functionCalls++;

        return new Promise(function(resolve, reject) {
            if (debug.verbose) console.log("Disconnecting Database...");

            this.connection.end(function(err) {
                if (err) {
                    throw err;
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    },
    select: function(data) {
        if (debug.statistics) statistics.statistics.javascript.functionCalls++;

        return new Promise(function(resolve, reject) {
            let table = data[0],
                fields = data[1],
                where = data[2];

            this.connection.query("SELECT " + fields + " FROM `" + table + "` WHERE " + where, function(err, result, fields) {
                if (debug.statistics) statistics.statistics.database.queries.select++;
                if (err) {
                    throw err;
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    insert: function(data) {
        if (debug.statistics) statistics.statistics.javascript.functionCalls++;

        return new Promise(function(resolve, reject) {
            let table = data[0],
                values = data[1];

            this.connection.query("INSERT INTO `" + table + "` SET ?", values, function(err, result, fields) {
                if (debug.statistics) statistics.statistics.database.queries.insert++;
                if (err) {
                    throw err;
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    update: function(data) {
        if (debug.statistics) statistics.statistics.javascript.functionCalls++;

        return new Promise(function(resolve, reject) {
            let table = data[0],
                fields = data[1],
                where = data[2];

            this.connection.query("UPDATE `" + table + "` SET " + fields + " WHERE " + where, function(err, result, fields) {
                if (debug.statistics) statistics.statistics.database.queries.update++;
                if (err) {
                    throw err;
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
};
