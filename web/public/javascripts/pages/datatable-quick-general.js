jQuery(function () {
    jQuery(".js-dataTable-overview").DataTable({
        data: quickGeneralOverview,
        order: [[1, "asc"]],
        columns: [
            { title: "", data: "avatar" },
            { title: "Player", data: "name" },
            { title: "Rank", data: "comprank" },
            { title: "Level", data: "level" },
            { title: "Wins", data: "games_won" },
            { title: "On Fire", data: "on_fire" },
            { title: "K:D Ratio", data: "kpd" }
        ],
        columnDefs: [
            {
                render: function (data, type, row) {
                    return '<img src="' + data + '" style="height:5rem;margin-left:5px;margin-right:5px;">';
                },
                iDataSort: 1,
                width: "50px",
                className: "no-padding middle hidden-xs",
                targets: 0
            },
            {
                render: function (data, type, row) {
                    return '<span style="font-weight:bold; font-size:20px;">' + data + "</span><br>" + "<span>" + row.battleTag + "</span>";
                },
                className: "middle",
                targets: 1
            },
            {
                render: function (data, type, row) {
                    return "<strong>" + data + '</strong><br/><img src="' + row.tier_image + '" style="height:4rem">';
                },
                width: "20px",
                className: "text-center",
                targets: 2
            },
            {
                render: function (data, type, row) {
                    return (
                        '<div style="background-image:url(' +
                        row.rank_image +
                        '); background-size:auto 100%; text-align:center; width:80px; height:80px; margin:0 auto;"><div style="top:50%; position:relative; transform:translateY(-50%);">' +
                        data +
                        "</div></div>"
                    );
                },
                width: "80px",
                className: "no-padding",
                targets: 3
            },
            {
                render: function (data, type, row) {
                    if (type == "sort" || type == "type") return data;
                    return getColumnValue(data, row.games_won_change, "");
                },
                className: "middle",
                targets: 4
            },
            {
                render: function (data, type, row) {
                    if (type == "sort" || type == "type") return data;
                    return getColumnValue((data * 100).toFixed(2), (row.on_fire_change * 100).toFixed(2), "%");
                },
                className: "middle",
                targets: 5
            },
            {
                render: function (data, type, row) {
                    if (type == "sort" || type == "type") return data;
                    return getColumnValue(data, row.kpd_change.toFixed(2), "");
                },
                className: "middle",
                targets: 6
            }
        ],
    });

    jQuery(".js-dataTable-roles").DataTable({
        data: quickGeneralRoles,
        order: [[1, "asc"]],
        columns: [
            { title: "", data: "avatar" },
            { title: "Player", data: "name" },
            { title: "Offensive", data: "off_games_won" },
            { title: "Defensive", data: "deff_games_won" },
            { title: "Tank", data: "tank_games_won" },
            { title: "Support", data: "supp_games_won" }
        ],
        columnDefs: [
            {
                render: function (data, type, row) {
                    return '<img src="' + data + '" style="height:5rem;margin-left:5px;margin-right:5px;">';
                },
                iDataSort: 1,
                width: "50px",
                className: "no-padding middle hidden-xs",
                targets: 0
            },
            {
                render: function (data, type, row) {
                    return '<span style="font-weight:bold; font-size:20px;">' + data + "</span><br>" + "<span>" + row.battleTag + "</span>";
                },
                className: "middle",
                targets: 1
            },
            {
                render: function (data, type, row) {
                    if (type == "sort" || type == "type") return data;
                    return "<span style=\"font-weight:bold;\">" + data + " Wins</span><br><span>" + hoursPrettyprint(row.off_time_played) + "</span>"
                },
                width: "150px",
                className: "text-center",
                targets: 2
            },
            {
                render: function (data, type, row) {
                    if (type == "sort" || type == "type") return data;
                    return "<span style=\"font-weight:bold;\">" + data + " Wins</span><br><span>" + hoursPrettyprint(row.deff_time_played) + "</span>"
                },
                width: "150px",
                className: "text-center",
                targets: 3
            },
            {
                render: function (data, type, row) {
                    if (type == "sort" || type == "type") return data;
                    return "<span style=\"font-weight:bold;\">" + data + " Wins</span><br><span>" + hoursPrettyprint(row.tank_time_played) + "</span>"
                },
                width: "150px",
                className: "text-center",
                targets: 4
            },
            {
                render: function (data, type, row) {
                    if (type == "sort" || type == "type") return data;
                    return "<span style=\"font-weight:bold;\">" + data + " Wins</span><br><span>" + hoursPrettyprint(row.supp_time_played) + "</span>"
                },
                width: "150px",
                className: "text-center",
                targets: 5
            }
        ]
    });

    jQuery(".js-dataTable-combat").DataTable({
        data: quickGeneralCombat,
        order: [[1, "asc"]],
        columns: [
            { title: "", data: "avatar" },
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
                    return '<img src="' + data + '" style="height:5rem;margin-left:5px;margin-right:5px;">';
                },
                iDataSort: 1,
                width: "50px",
                className: "no-padding middle hidden-xs",
                targets: 0
            },
            {
                render: function (data, type, row) {
                    return '<span style="font-weight:bold; font-size:20px;">' + data + "</span><br>" + "<span>" + row.battleTag + "</span>";
                },
                className: "middle",
                targets: 1
            },
            {
                render: function (data, type, row) {
                    if (type == "sort" || type == "type") return data;
                    return getColumnProgressBar(data, row.max_eliminations, row.eliminations_change, 2);
                },
                targets: 2
            },
            {
                render: function (data, type, row) {
                    if (type == "sort" || type == "type") return data;
                    return getColumnProgressBar(data, row.max_objective_kills, row.objective_kills_change, 2);
                },
                targets: 3
            },
            {
                render: function (data, type, row) {
                    if (type == "sort" || type == "type") return data;
                    return getColumnProgressBar(data, row.max_objective_time, row.objective_time_change, 2, '', true);
                },
                targets: 4
            },
            {
                render: function (data, type, row) {
                    if (type == "sort" || type == "type") return data;
                    return getColumnProgressBar(data, row.max_all_damage_done, row.all_damage_done_change, 0);
                },
                targets: 5
            },
            {
                render: function (data, type, row) {
                    if (type == "sort" || type == "type") return data;
                    return getColumnProgressBar(data, row.max_healing_done, row.healing_done_change, 0);
                },
                targets: 6
            },
            {
                render: function (data, type, row) {
                    if (type == "sort" || type == "type") return data;
                    return getColumnProgressBar(data, row.max_damage_blocked, row.damage_blocked_change, 0);
                },
                targets: 7
            },
            {
                render: function (data, type, row) {
                    if (type == "sort" || type == "type") return data;
                    return getColumnProgressBar(data, row.max_deaths, row.deaths_change, 2);
                },
                targets: 8
            }
        ]
    });

    jQuery(".js-dataTable-medals").DataTable({
        data: quickGeneralMedals,
        order: [[1, "asc"]],
        columns: [
            { title: "", data: "avatar" },
            { title: "Player", data: "name" },
            { title: "Level", data: "level" },
            { title: "Medals", data: "medals" },
            { title: "Gold", data: "medals_gold" },
            { title: "Silver", data: "medals_silver" },
            { title: "Bronze", data: "medals_bronze" },
            { title: "Cards", data: "cards" }
        ],
        columnDefs: [
            {
                render: function (data, type, row) {
                    return '<img src="' + data + '" style="height:5rem;margin-left:5px;margin-right:5px;">';
                },
                iDataSort: 1,
                width: "50px",
                className: "no-padding middle hidden-xs",
                targets: 0
            },
            {
                render: function (data, type, row) {
                    return '<span style="font-weight:bold; font-size:20px;">' + data + "</span><br>" + "<span>" + row.battleTag + "</span>";
                },
                className: "middle",
                targets: 1
            },
            {
                render: function (data, type, row) {
                    return (
                        '<div style="background-image:url(' +
                        row.rank_image +
                        '); background-size:auto 100%; text-align:center; width:80px; height:80px; margin:0 auto;"><div style="top:50%; position:relative; transform:translateY(-50%);">' +
                        data +
                        "</div></div>"
                    );
                },
                width: "80px",
                className: "no-padding",
                targets: 2
            },
            {
                render: function (data, type, row) {
                    if (type == "sort" || type == "type") return data;
                    return getColumnProgressBar(data, row.max_medals, row.medals_change, 2);
                },
                targets: 3
            },
            {
                render: function (data, type, row) {
                    if (type == "sort" || type == "type") return data;
                    return getColumnProgressBar(data, row.max_medals_gold, row.medals_gold_change, 2);
                },
                targets: 4
            },
            {
                render: function (data, type, row) {
                    if (type == "sort" || type == "type") return data;
                    return getColumnProgressBar(data, row.max_medals_silver, row.medals_silver_change, 2);
                },
                targets: 5
            },
            {
                render: function (data, type, row) {
                    if (type == "sort" || type == "type") return data;
                    return getColumnProgressBar(data, row.max_medals_bronze, row.medals_bronze_change, 2);
                },
                targets: 6
            },
            {
                render: function (data, type, row) {
                    if (type == "sort" || type == "type") return data;
                    return getColumnProgressBar(data, row.max_cards, row.cards_change, 2);
                },
                targets: 7
            }
        ]
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
