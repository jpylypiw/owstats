// database.js
// ======
// Handle the database connection properly.
// ======

const settings = require("../config/database");
const mysql = require("mysql");
const debug = require("../config/debug");
const statistics = require("../functions/statistics");
const fs = require("fs");

module.exports = {
    connection: null,
    connect: function() {
        if (debug.statistics) { statistics.statistics.javascript.functionCalls++; }

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
                    if (debug.verbose) console.log("Error in database.js (connect): " + err);
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
                    if (debug.verbose) console.log("Error in database.js (disconnect): " + err);
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

            this.connection.query(
                "SELECT " + fields + " FROM " + table + " WHERE " + where,
                function(err, result, fields) {
                    if (debug.statistics) statistics.statistics.database.queries.select++;
                    if (err) {
                        if (debug.verbose) console.log("Error in database.js (select): " + err);
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });
    },
    insert: function(data) {
        if (debug.statistics) statistics.statistics.javascript.functionCalls++;

        return new Promise(function(resolve, reject) {
            let table = data[0],
                values = data[1];

            this.connection.query(
                "INSERT INTO `" + table + "` SET ?",
                values,
                function(err, result, fields) {
                    if (debug.statistics) statistics.statistics.database.queries.insert++;
                    if (err) {
                        if (debug.verbose) console.log("Error in database.js (insert): " + err);
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });
    },
    update: function(data) {
        if (debug.statistics) statistics.statistics.javascript.functionCalls++;

        return new Promise(function(resolve, reject) {
            let table = data[0],
                fields = data[1],
                where = data[2];

            this.connection.query(
                "UPDATE `" + table + "` SET " + fields + " WHERE " + where,
                function(err, result, fields) {
                    if (debug.statistics) statistics.statistics.database.queries.update++;
                    if (err) {
                        if (debug.verbose) console.log("Error in database.js (update): " + err);
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });
    },
    delete: function(data) {
        if (debug.statistics) statistics.statistics.javascript.functionCalls++;

        return new Promise(function(resolve, reject) {
            let table = data[0],
                where = data[1];

            this.connection.query(
                "DELETE FROM `" + table + "` WHERE " + where,
                function(err, result, fields) {
                    if (debug.statistics) statistics.statistics.database.queries.delete++;
                    if (err) {
                        if (debug.verbose) console.log("Error in database.js (delete): " + err);
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });
    },
    query: function(data) {
        if (debug.statistics) statistics.statistics.javascript.functionCalls++;

        return new Promise(function(resolve, reject) {
            this.connection.query(data, function(err, result, fields) {
                if (debug.statistics) statistics.statistics.database.queries.select++;
                if (err) {
                    if (debug.verbose) console.log("Error in database.js (query): " + err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    desc: function(table) {
        if (debug.statistics) statistics.statistics.javascript.functionCalls++;

        return new Promise(function(resolve, reject) {

        });
    },
    insert_file: function(data) {
        if (debug.statistics) statistics.statistics.javascript.functionCalls++;

        return new Promise(function(resolve, reject) {
            let table = data[0],
                values = data[1];

            this.connection.query("DESCRIBE " + table, function(err, result, fields) {
                if (err) {
                    if (debug.verbose) console.log("Error in database.js (insert_file): " + err);
                    reject(err);
                } else {
                    var txtrow = "";
                    var filename = settings.tmppath + 'load_data_' + table;
                    result.forEach(element => {
                        var field = element.Field;
                        var value = "";
                        if (values[field] != undefined) {
                            value = values[field];
                        } else { value = ""; }
                        txtrow += '"' + value + '"|';
                        delete values[field];
                    });
                    txtrow = txtrow.substring(0, txtrow.length - 1);
                    txtrow += "\n";

                    if (values.length > 0) {
                        if (debug.verbose) console.log("Error in database.js (insert_file): \n Missing Columns in Table " + table + " found. \n Columns: " + JSON.stringify(values, null, 2));
                    }

                    fs.appendFile(filename, txtrow, function(err) {
                        if (debug.statistics) statistics.statistics.database.queries.insert_file++;
                        if (err) {
                            if (debug.verbose) console.log("Error in database.js (insert_file): " + err);
                            reject(err);
                        } else {
                            resolve(true);
                        }
                    });

                }
            });
        });
    },
    load_data: function(table) {
        if (debug.statistics) statistics.statistics.javascript.functionCalls++;

        return new Promise(function(resolve, reject) {
            var filename = settings.tmppath + 'load_data_' + table;
            var query = 'LOAD DATA LOCAL INFILE "' + filename + '" INTO TABLE ' + table + ' FIELDS TERMINATED BY \'|\' OPTIONALLY ENCLOSED BY \'"\' LINES TERMINATED BY \'\n\';';

            this.connection.query(query, function(err, result, fields) {
                if (err) {
                    if (debug.verbose) console.log("Error in database.js (load_data): " + err);
                    reject(err);
                } else {
                    fs.unlink(filename, function(err) {
                        if (debug.statistics) statistics.statistics.database.queries.load_data++;
                        if (err) {
                            if (debug.verbose) console.log("Error in database.js (load_data): " + err);
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                }
            });
        });
    },
    getTmpPath: function() {
        if (debug.statistics) statistics.statistics.javascript.functionCalls++;
        return settings.tmppath;
    },
};