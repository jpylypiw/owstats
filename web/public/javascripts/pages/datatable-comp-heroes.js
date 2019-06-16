jQuery(function () {
    jQuery(".js-dataTable-overview").DataTable({
        data: heroDataOverview,
        order: [[2, "asc"]],
        columns: [
            { title: "", data: "hero" },
            { title: "Hero", data: "hero" },
            { title: "Player", data: "name" },
            { title: "Playtime", data: "time_played" },
            { title: "Games", data: "games_played" },
            { title: "Win Rate", data: "win_percentage" },
            { title: "On Fire", data: "on_fire_percentage" },
            { title: "E:D Ratio", data: "kpd" }
        ],
        columnDefs: [
            {
                render: function (data, type, row) {
                    return '<img src="' + getHeroImage(data) + '" style="height:5rem">';
                },
                iDataSort: 1,
                width: "50px",
                targets: 0
            },
            {
                render: function (data, type, row) {
                    return '<span style="display:block"><strong>' + data.charAt(0).toUpperCase() + data.slice(1) + "</strong></span>" + getHeroTypeLabel(getHeroType(data));
                },
                className: "hidden-xs",
                targets: 1
            },
            {
                render: function (data, type, row) {
                    return "<strong>" + data + "</strong>";
                },
                targets: 2
            },
            {
                render: function (data, type, row) {
                    return hoursPrettyprint(data);
                },
                iDataSort: 7,
                className: "hidden-xs",
                targets: 3
            },
            {
                render: function (data, type, row) {
                    return (
                        data +
                        '<div class="progress" style="height:5px;margin-bottom:0px;margin-top:5px;">' +
                        '<div class="progress-bar" role="progressbar" aria-valuenow="' +
                        row.games_played +
                        '" aria-valuemin="0" aria-valuemax="' +
                        row.max_games_played +
                        '" style="width:' +
                        row.games_played / row.max_games_played * 100 +
                        '%"></div></div>'
                    );
                },
                targets: 4
            },
            {
                render: function (data, type, row) {
                    return (
                        (data * 100).toFixed(2) +
                        "%" +
                        '<div class="progress" style="height:5px;margin-bottom:0px;margin-top:5px;">' +
                        '<div class="progress-bar" role="progressbar" aria-valuenow="' +
                        row.win_percentage +
                        '" aria-valuemin="0" aria-valuemax="' +
                        row.max_win_percentage +
                        '" style="width:' +
                        row.win_percentage / row.max_win_percentage * 100 +
                        '%"></div></div>'
                    );
                },
                targets: 5
            },
            {
                render: function (data, type, row) {
                    return (
                        (data * 100).toFixed(2) +
                        "%" +
                        '<div class="progress" style="height:5px;margin-bottom:0px;margin-top:5px;">' +
                        '<div class="progress-bar" role="progressbar" aria-valuenow="' +
                        row.on_fire_percentage +
                        '" aria-valuemin="0" aria-valuemax="' +
                        row.max_on_fire_percentage +
                        '" style="width:' +
                        row.on_fire_percentage / row.max_on_fire_percentage * 100 +
                        '%"></div></div>'
                    );
                },
                targets: 6
            },
            {
                render: function (data, type, row) {
                    return (
                        data.toFixed(2) +
                        '<div class="progress" style="height:5px;margin-bottom:0px;margin-top:5px;">' +
                        '<div class="progress-bar" role="progressbar" aria-valuenow="' +
                        row.kpd +
                        '" aria-valuemin="0" aria-valuemax="' +
                        row.max_kpd +
                        '" style="width:' +
                        row.kpd / row.max_kpd * 100 +
                        '%"></div></div>'
                    );
                },
                targets: 7
            }
        ]
    });

    jQuery(".js-dataTable-combat").DataTable({
        data: heroDataCombat,
        order: [[2, "asc"]],
        columns: [
            { title: "", data: "hero" },
            { title: "Hero", data: "hero" },
            { title: "Player", data: "name" },
            { title: "Elimns/G", data: "eliminations" },
            { title: "Obj Elimns/G", data: "objective_kills" },
            { title: "Obj Time/G", data: "objective_time" },
            { title: "Obj. Time Hidden", data: "objective_time" },
            { title: "Damage/G", data: "all_damage_done" },
            { title: "Healing/G", data: "healing_done" },
            { title: "Blocked/G", data: "damage_blocked" },
            { title: "Deaths/G", data: "deaths" }
        ],
        columnDefs: [
            {
                render: function (data, type, row) {
                    return '<img src="' + getHeroImage(data) + '" style="height:5rem">';
                },
                iDataSort: 1,
                width: "50px",
                targets: 0
            },
            {
                render: function (data, type, row) {
                    return '<span style="display:block"><strong>' + data.charAt(0).toUpperCase() + data.slice(1) + "</strong></span>" + getHeroTypeLabel(getHeroType(data));
                },
                className: "hidden-xs",
                targets: 1
            },
            {
                render: function (data, type, row) {
                    return "<strong>" + data + "</strong>";
                },
                targets: 2
            },
            {
                render: function (data, type, row) {
                    return (
                        data.toFixed(2) +
                        '<div class="progress" style="height:5px;margin-bottom:0px;margin-top:5px;">' +
                        '<div class="progress-bar" role="progressbar" aria-valuenow="' +
                        row.eliminations +
                        '" aria-valuemin="0" aria-valuemax="' +
                        row.max_eliminations +
                        '" style="width:' +
                        row.eliminations / row.max_eliminations * 100 +
                        '%"></div></div>'
                    );
                },
                targets: 3
            },
            {
                render: function (data, type, row) {
                    return (
                        data.toFixed(2) +
                        '<div class="progress" style="height:5px;margin-bottom:0px;margin-top:5px;">' +
                        '<div class="progress-bar" role="progressbar" aria-valuenow="' +
                        row.objective_kills +
                        '" aria-valuemin="0" aria-valuemax="' +
                        row.max_objective_kills +
                        '" style="width:' +
                        row.objective_kills / row.max_objective_kills * 100 +
                        '%"></div></div>'
                    );
                },
                targets: 4
            },
            {
                render: function (data, type, row) {
                    return (
                        timePrettyPrint(data) +
                        '<div class="progress" style="height:5px;margin-bottom:0px;margin-top:5px;">' +
                        '<div class="progress-bar" role="progressbar" aria-valuenow="' +
                        row.objective_time +
                        '" aria-valuemin="0" aria-valuemax="' +
                        row.max_objective_time +
                        '" style="width:' +
                        row.objective_time / row.max_objective_time * 100 +
                        '%"></div></div>'
                    );
                },
                iDataSort: 6,
                targets: 5
            },
            {
                targets: [6],
                visible: false
            },
            {
                render: function (data, type, row) {
                    return (
                        Math.round(data) +
                        '<div class="progress" style="height:5px;margin-bottom:0px;margin-top:5px;">' +
                        '<div class="progress-bar" role="progressbar" aria-valuenow="' +
                        row.all_damage_done +
                        '" aria-valuemin="0" aria-valuemax="' +
                        row.max_all_damage_done +
                        '" style="width:' +
                        row.all_damage_done / row.max_all_damage_done * 100 +
                        '%"></div></div>'
                    );
                },
                targets: 7
            },
            {
                render: function (data, type, row) {
                    return (
                        Math.round(data) +
                        '<div class="progress" style="height:5px;margin-bottom:0px;margin-top:5px;">' +
                        '<div class="progress-bar" role="progressbar" aria-valuenow="' +
                        row.healing_done +
                        '" aria-valuemin="0" aria-valuemax="' +
                        row.max_healing_done +
                        '" style="width:' +
                        row.healing_done / row.max_healing_done * 100 +
                        '%"></div></div>'
                    );
                },
                targets: 8
            },
            {
                render: function (data, type, row) {
                    return (
                        Math.round(data) +
                        '<div class="progress" style="height:5px;margin-bottom:0px;margin-top:5px;">' +
                        '<div class="progress-bar" role="progressbar" aria-valuenow="' +
                        row.damage_blocked +
                        '" aria-valuemin="0" aria-valuemax="' +
                        row.max_damage_blocked +
                        '" style="width:' +
                        row.damage_blocked / row.max_damage_blocked * 100 +
                        '%"></div></div>'
                    );
                },
                targets: 9
            },
            {
                render: function (data, type, row) {
                    return (
                        data.toFixed(2) +
                        '<div class="progress" style="height:5px;margin-bottom:0px;margin-top:5px;">' +
                        '<div class="progress-bar" role="progressbar" aria-valuenow="' +
                        row.deaths +
                        '" aria-valuemin="0" aria-valuemax="' +
                        row.max_deaths +
                        '" style="width:' +
                        row.deaths / row.max_deaths * 100 +
                        '%"></div></div>'
                    );
                },
                targets: 10
            }
        ]
    });

    jQuery(".js-dataTable-eliminations").DataTable({
        data: heroDataEliminations,
        order: [[2, "asc"]],
        columns: [
            { title: "", data: "hero" },
            { title: "Hero", data: "hero" },
            { title: "Player", data: "name" },
            { title: "E:D Ratio", data: "kpd" },
            { title: "Eliminations/G", data: "eliminations" },
            { title: "Solo Kills/G", data: "solo_kills" },
            { title: "Final Blows/G", data: "final_blows" }
        ],
        columnDefs: [
            {
                render: function (data, type, row) {
                    return '<img src="' + getHeroImage(data) + '" style="height:5rem">';
                },
                iDataSort: 1,
                width: "50px",
                targets: 0
            },
            {
                render: function (data, type, row) {
                    return '<span style="display:block"><strong>' + data.charAt(0).toUpperCase() + data.slice(1) + "</strong></span>" + getHeroTypeLabel(getHeroType(data));
                },
                className: "hidden-xs",
                targets: 1
            },
            {
                render: function (data, type, row) {
                    return "<strong>" + data + "</strong>";
                },
                targets: 2
            },
            {
                render: function (data, type, row) {
                    return (
                        data.toFixed(2) +
                        '<div class="progress" style="height:5px;margin-bottom:0px;margin-top:5px;">' +
                        '<div class="progress-bar" role="progressbar" aria-valuenow="' +
                        row.kpd +
                        '" aria-valuemin="0" aria-valuemax="' +
                        row.max_kpd +
                        '" style="width:' +
                        row.kpd / row.max_kpd * 100 +
                        '%"></div></div>'
                    );
                },
                targets: 3
            },
            {
                render: function (data, type, row) {
                    return (
                        data.toFixed(2) +
                        '<div class="progress" style="height:5px;margin-bottom:0px;margin-top:5px;">' +
                        '<div class="progress-bar" role="progressbar" aria-valuenow="' +
                        row.eliminations +
                        '" aria-valuemin="0" aria-valuemax="' +
                        row.max_eliminations +
                        '" style="width:' +
                        row.eliminations / row.max_eliminations * 100 +
                        '%"></div></div>'
                    );
                },
                targets: 4
            },
            {
                render: function (data, type, row) {
                    return (
                        data.toFixed(2) +
                        '<div class="progress" style="height:5px;margin-bottom:0px;margin-top:5px;">' +
                        '<div class="progress-bar" role="progressbar" aria-valuenow="' +
                        row.solo_kills +
                        '" aria-valuemin="0" aria-valuemax="' +
                        row.max_solo_kills +
                        '" style="width:' +
                        row.solo_kills / row.max_solo_kills * 100 +
                        '%"></div></div>'
                    );
                },
                targets: 5
            },
            {
                render: function (data, type, row) {
                    return (
                        data.toFixed(2) +
                        '<div class="progress" style="height:5px;margin-bottom:0px;margin-top:5px;">' +
                        '<div class="progress-bar" role="progressbar" aria-valuenow="' +
                        row.final_blows +
                        '" aria-valuemin="0" aria-valuemax="' +
                        row.max_final_blows +
                        '" style="width:' +
                        row.final_blows / row.max_final_blows * 100 +
                        '%"></div></div>'
                    );
                },
                targets: 6
            }
        ]
    });

    jQuery(".js-dataTable-medals").DataTable({
        data: heroDataMedals,
        order: [[2, "asc"]],
        columns: [
            { title: "", data: "hero" },
            { title: "Hero", data: "hero" },
            { title: "Player", data: "name" },
            { title: "Medals", data: "medals" },
            { title: "Gold", data: "medals_gold" },
            { title: "Silver", data: "medals_silver" },
            { title: "Bronze", data: "medals_bronze" },
            { title: "Cards", data: "cards" }
        ],
        columnDefs: [
            {
                render: function (data, type, row) {
                    return '<img src="' + getHeroImage(data) + '" style="height:5rem">';
                },
                iDataSort: 1,
                width: "50px",
                targets: 0
            },
            {
                render: function (data, type, row) {
                    return '<span style="display:block"><strong>' + data.charAt(0).toUpperCase() + data.slice(1) + "</strong></span>" + getHeroTypeLabel(getHeroType(data));
                },
                className: "hidden-xs",
                targets: 1
            },
            {
                render: function (data, type, row) {
                    return "<strong>" + data + "</strong>";
                },
                targets: 2
            },
            {
                render: function (data, type, row) {
                    return (
                        data.toFixed(2) +
                        '<div class="progress" style="height:5px;margin-bottom:0px;margin-top:5px;">' +
                        '<div class="progress-bar" role="progressbar" aria-valuenow="' +
                        row.medals +
                        '" aria-valuemin="0" aria-valuemax="' +
                        row.max_medals +
                        '" style="width:' +
                        row.medals / row.max_medals * 100 +
                        '%"></div></div>'
                    );
                },
                targets: 3
            },
            {
                render: function (data, type, row) {
                    return (
                        data.toFixed(2) +
                        '<div class="progress" style="height:5px;margin-bottom:0px;margin-top:5px;">' +
                        '<div class="progress-bar" role="progressbar" aria-valuenow="' +
                        row.medals_gold +
                        '" aria-valuemin="0" aria-valuemax="' +
                        row.max_medals_gold +
                        '" style="width:' +
                        row.medals_gold / row.max_medals_gold * 100 +
                        '%"></div></div>'
                    );
                },
                targets: 4
            },
            {
                render: function (data, type, row) {
                    return (
                        data.toFixed(2) +
                        '<div class="progress" style="height:5px;margin-bottom:0px;margin-top:5px;">' +
                        '<div class="progress-bar" role="progressbar" aria-valuenow="' +
                        row.medals_silver +
                        '" aria-valuemin="0" aria-valuemax="' +
                        row.max_medals_silver +
                        '" style="width:' +
                        row.medals_silver / row.max_medals_silver * 100 +
                        '%"></div></div>'
                    );
                },
                targets: 5
            },
            {
                render: function (data, type, row) {
                    return (
                        data.toFixed(2) +
                        '<div class="progress" style="height:5px;margin-bottom:0px;margin-top:5px;">' +
                        '<div class="progress-bar" role="progressbar" aria-valuenow="' +
                        row.medals_bronze +
                        '" aria-valuemin="0" aria-valuemax="' +
                        row.max_medals_bronze +
                        '" style="width:' +
                        row.medals_bronze / row.max_medals_bronze * 100 +
                        '%"></div></div>'
                    );
                },
                targets: 6
            },
            {
                render: function (data, type, row) {
                    return (
                        data.toFixed(2) +
                        '<div class="progress" style="height:5px;margin-bottom:0px;margin-top:5px;">' +
                        '<div class="progress-bar" role="progressbar" aria-valuenow="' +
                        row.cards +
                        '" aria-valuemin="0" aria-valuemax="' +
                        row.max_cards +
                        '" style="width:' +
                        row.cards / row.max_cards * 100 +
                        '%"></div></div>'
                    );
                },
                targets: 7
            }
        ],
    });

    $(".table tfoot th").each(function () {
        var title = $(this).text();
        if (title != "") $(this).html('<input type="text" placeholder="Search ' + title + '" style="width:100%;" />');
    });

    jQuery(function () {
        jQuery.each($(".table"), function (index, val) {
            var table = $(val).DataTable();
            table.columns().every(function () {
                var that = this;
                $("input", this.footer()).on("keyup change", function () {
                    if (that.search() !== this.value) {
                        that.search(this.value, true).draw();
                    }
                });
            });
        });
    });
});