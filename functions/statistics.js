// statistics.js
// ======
// Used to store some statistics and maybe show them at the end.
// ======

module.exports = {
    show: function() {
        this.statistics.javascript.functionCalls++;
        console.log(JSON.stringify(this.statistics, undefined, 4));
    },
    statistics: {
        database: {
            queries: {
                select: 0,
                insert: 0,
                update: 0
            }
        },
        owapi: {
            requests: 0,
            responses: 0,
            errors: 0
        },
        javascript: {
            functionCalls: 0,
            executionTime: ""
        },
        players: 0,
        playersDeactivated: 0
    }
};
