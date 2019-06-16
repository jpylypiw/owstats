jQuery(function () {
    jQuery(".js-dataTable-overview").DataTable({
        data: heroDataOverview,
        order: [[2, "asc"]],
        columns: [
            { title: "", data: "hero" },
            { title: "Hero", data: "hero" },
            { title: "Player", data: "name" },
            { title: "Playtime", data: "time_played" },
            { title: "Wins", data: "games_won" },
            { title: "On Fire", data: "on_fire_percentage" },
            { title: "E:D Ratio", data: "kpd" }
        ],
        columnDefs: [
            {
                render: function (data, type, row) {
                    return '<img src="' + getHeroImage(data) + '" style="height:5rem;margin-left:5px;margin-right:5px;">';
                },
                iDataSort: 1,
                width: "50px",
                className: "no-padding middle",
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
                    if (type == "sort" || type == "type") return data;
                    return hoursPrettyprint(data);
                },
                className: "hidden-xs",
                targets: 3
            },
            {
                render: function (data, type, row) {
                    if (type == "sort" || type == "type") return data;
                    return getColumnProgressBar(data, row.max_games_won, row.games_won_change);
                },
                targets: 4
            },
            {
                render: function (data, type, row) {
                    if (type == "sort" || type == "type") return data;
                    return getColumnProgressBar(data * 100, row.max_on_fire_percentage * 100, row.on_fire_percentage_change * 100, 2, '%');
                },
                targets: 5
            },
            {
                render: function (data, type, row) {
                    if (type == "sort" || type == "type") return data;
                    return getColumnProgressBar(data, row.max_kpd, row.kpd_change, 2);
                },
                targets: 6
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
            { title: "Damage/G", data: "all_damage_done" },
            { title: "Healing/G", data: "healing_done" },
            { title: "Blocked/G", data: "damage_blocked" },
            { title: "Deaths/G", data: "deaths" }
        ],
        columnDefs: [
            {
                render: function (data, type, row) {
                    return '<img src="' + getHeroImage(data) + '" style="height:5rem;margin-left:5px;margin-right:5px;">';
                },
                iDataSort: 1,
                width: "50px",
                className: "no-padding middle",
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
                    if (type == "sort" || type == "type") return data;
                    return getColumnProgressBar(data, row.max_eliminations, row.eliminations_change, 2);
                },
                targets: 3
            },
            {
                render: function (data, type, row) {
                    if (type == "sort" || type == "type") return data;
                    return getColumnProgressBar(data, row.max_objective_kills, row.objective_kills_change, 2);
                },
                targets: 4
            },
            {
                render: function (data, type, row) {
                    if (type == "sort" || type == "type") return data;
                    return getColumnProgressBar(data, row.max_objective_time, row.objective_time_change, 2, '', true);
                },
                targets: 5
            },
            {
                render: function (data, type, row) {
                    if (type == "sort" || type == "type") return data;
                    return getColumnProgressBar(data, row.max_all_damage_done, row.all_damage_done_change, 0);
                },
                targets: 6
            },
            {
                render: function (data, type, row) {
                    if (type == "sort" || type == "type") return data;
                    return getColumnProgressBar(data, row.max_healing_done, row.healing_done_change, 0);
                },
                targets: 7
            },
            {
                render: function (data, type, row) {
                    if (type == "sort" || type == "type") return data;
                    return getColumnProgressBar(data, row.max_damage_blocked, row.damage_blocked_change, 0);
                },
                targets: 8
            },
            {
                render: function (data, type, row) {
                    if (type == "sort" || type == "type") return data;
                    return getColumnProgressBar(data, row.max_deaths, row.deaths_change, 2);
                },
                targets: 9
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
                    return '<img src="' + getHeroImage(data) + '" style="height:5rem;margin-left:5px;margin-right:5px;">';
                },
                iDataSort: 1,
                width: "50px",
                className: "no-padding middle",
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
        ],
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
                    return '<img src="' + getHeroImage(data) + '" style="height:5rem;margin-left:5px;margin-right:5px;">';
                },
                iDataSort: 1,
                width: "50px",
                className: "no-padding middle",
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