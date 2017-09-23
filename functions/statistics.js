// statistics.js
// ======
// Used to store some statistics and maybe show them at the end.
// ======

module.exports = {
    active: true,
    show: function() {
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
        players: 0,
        playersDeactivated: 0
    }
};
