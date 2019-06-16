// *************************************************
// ****************** IFRAME Size ******************
// *************************************************

$(window).load(function () {
    $("iframe").each(function (pos, elem) {
        var minHeight = 500;
        var calculatedHeight = $("#main-container").height() - $(".content.bg-gray-lighter").outerHeight() - 40;
        var height = calculatedHeight < minHeight ? minHeight : calculatedHeight;

        if ($(elem).height() == 150) $(elem).height(height);
        $(elem).attr("src", $(elem).attr("x-src"));
    });
});

// *************************************************
// ******************* Preloader *******************
// *************************************************

$(window).load(function () {
    hideLoader();
});

function showLoader() {
    $("#preloader").show();
}

function hideLoader() {
    $("#preloader").fadeOut("slow", function () {
        $(this).hide();
    });
}

// *************************************************
// **************** DataTables Init ****************
// *************************************************

jQuery(function () {
    var $DataTable = jQuery.fn.dataTable;

    // Set the defaults for DataTables init
    jQuery.extend(true, $DataTable.defaults, {
        dom: "<'row'<'col-sm-6'l><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-6'i><'col-sm-6'p>>",
        renderer: "bootstrap",
        oLanguage: {
            sLengthMenu: "_MENU_",
            sInfo: "Showing <strong>_START_</strong>-<strong>_END_</strong> of <strong>_TOTAL_</strong>",
            oPaginate: {
                sPrevious: '<i class="fa fa-angle-left"></i>',
                sNext: '<i class="fa fa-angle-right"></i>'
            }
        }
    });

    // Custom Defaults for OWSTATS
    jQuery.extend(true, $DataTable.defaults, {
        fnDrawCallback: function (oSettings, json) {
            $('[data-toggle="tooltip"]').tooltip();
        },
        aLengthMenu: [[10, 20, 50, 100], [10, 20, 50, 100]],
        bAutoWidth: false,
        responsive: true,
        pageLength: 10,
        sPaginationType: "full_numbers",
        bStateSave: false
    });

    // Default class modification
    jQuery.extend($DataTable.ext.classes, {
        sWrapper: "dataTables_wrapper form-inline dt-bootstrap",
        sFilterInput: "form-control",
        sLengthSelect: "form-control"
    });

    // Bootstrap paging button renderer
    $DataTable.ext.renderer.pageButton.bootstrap = function (settings, host, idx, buttons, page, pages) {
        var api = new $DataTable.Api(settings);
        var classes = settings.oClasses;
        var lang = settings.oLanguage.oPaginate;
        var btnDisplay, btnClass;

        var attach = function (container, buttons) {
            var i, ien, node, button;
            var clickHandler = function (e) {
                e.preventDefault();
                if (!jQuery(e.currentTarget).hasClass("disabled")) {
                    api.page(e.data.action).draw(false);
                }
            };

            for (i = 0, ien = buttons.length; i < ien; i++) {
                button = buttons[i];

                if (jQuery.isArray(button)) {
                    attach(container, button);
                } else {
                    btnDisplay = "";
                    btnClass = "";

                    switch (button) {
                        case "ellipsis":
                            btnDisplay = "&hellip;";
                            btnClass = "disabled";
                            break;

                        case "first":
                            btnDisplay = lang.sFirst;
                            btnClass = button + (page > 0 ? "" : " disabled");
                            break;

                        case "previous":
                            btnDisplay = lang.sPrevious;
                            btnClass = button + (page > 0 ? "" : " disabled");
                            break;

                        case "next":
                            btnDisplay = lang.sNext;
                            btnClass = button + (page < pages - 1 ? "" : " disabled");
                            break;

                        case "last":
                            btnDisplay = lang.sLast;
                            btnClass = button + (page < pages - 1 ? "" : " disabled");
                            break;

                        default:
                            btnDisplay = button + 1;
                            btnClass = page === button ? "active" : "";
                            break;
                    }

                    if (btnDisplay) {
                        node = jQuery("<li>", {
                            class: classes.sPageButton + " " + btnClass,
                            "aria-controls": settings.sTableId,
                            tabindex: settings.iTabIndex,
                            id: idx === 0 && typeof button === "string" ? settings.sTableId + "_" + button : null
                        })
                            .append(
                                jQuery("<a>", {
                                    href: "#"
                                }).html(btnDisplay)
                            )
                            .appendTo(container);

                        settings.oApi._fnBindAction(node, { action: button }, clickHandler);
                    }
                }
            }
        };

        attach(
            jQuery(host)
                .empty()
                .html('<ul class="pagination"/>')
                .children("ul"),
            buttons
        );
    };

    // TableTools Bootstrap compatibility - Required TableTools 2.1+
    if ($DataTable.TableTools) {
        // Set the classes that TableTools uses to something suitable for Bootstrap
        jQuery.extend(true, $DataTable.TableTools.classes, {
            container: "DTTT btn-group",
            buttons: {
                normal: "btn btn-default",
                disabled: "disabled"
            },
            collection: {
                container: "DTTT_dropdown dropdown-menu",
                buttons: {
                    normal: "",
                    disabled: "disabled"
                }
            },
            print: {
                info: "DTTT_print_info"
            },
            select: {
                row: "active"
            }
        });

        // Have the collection use a bootstrap compatible drop down
        jQuery.extend(true, $DataTable.TableTools.DEFAULTS.oTags, {
            collection: {
                container: "ul",
                button: "li",
                liner: "a"
            }
        });
    }
});

// *************************************************
// *************** Datatable Columns ***************
// *************************************************

function getColumnProgressBar(value, value_max, value_change, digits, unit, is_time, color) {
    color = typeof color !== 'undefined' ? color : "blue";
    unit = typeof unit !== 'undefined' ? unit : "";
    digits = typeof digits !== 'undefined' ? digits : 0;
    value_change = typeof value_change !== 'undefined' ? value_change : 0;

    var title = "", badge = "", html = "";

    if (value_change > 0) {
        title = "Increased by ";
        badge = "badge-success";
    } else if (value_change < 0) {
        title = "Decreased by ";
        badge = "badge-danger";
    }

    if (digits == 0) {
        value = Math.round(value);
        value_max = Math.round(value_max);
        value_change = Math.round(value_change);
    } else {
        value = value.toFixed(digits);
        value_max = value_max.toFixed(digits);
        value_change = value_change.toFixed(digits);
    }

    if (is_time === true) {
        html = '<span style="font-weight:bold;">' + timePrettyPrint(value) + unit + "</span>&nbsp;&nbsp;";
    } else {
        html = '<span style="font-weight:bold;">' + value + unit + "</span>&nbsp;&nbsp;";
    }

    if (value_change > 0 || value_change < 0) {
        if (is_time === true) value_change = timePrettyPrint(value_change);
        value_change = value_change > 0 ? '+' + value_change : value_change;
        html = html +
            '<span data-toggle="tooltip" data-placement="top" title="' +
            title +
            value_change +
            unit +
            ' over 7 days" class="badge ' + badge + '">' +
            value_change +
            unit +
            "</span>";
    }

    switch (color) {
        case "blue":
            color = "#337ab7";
            break;
        case "red":
            color = "#d9534f";
            break;
        case "yellow":
            color = "#f0ad4e";
            break;
        case "white":
            color = "#fefefe";
            break;
        case "green":
            color = "#8fbc8f";
            break;
        default:
            color = "#777";
    }

    if (value_max > 0) {
        html =
            html +
            '<div class="progress" style="height:5px;margin-bottom:0px;margin-top:5px;">' +
            '<div class="progress-bar" role="progressbar" aria-valuenow="' +
            value +
            '" aria-valuemin="0" aria-valuemax="' +
            value_max +
            '" style="width:' +
            value / value_max * 100 +
            "%; background-color:" +
            color +
            '"></div></div>';
    }

    return html;
}

function getColumnValue(value, value_change, unit) {
    var title = "", badge = "", html = "";

    if (value_change > 0) {
        title = "Increased by ";
        badge = "badge-success";
    } else if (value_change < 0) {
        title = "Decreased by ";
        badge = "badge-danger";
    }

    html = '<span style="font-weight:bold;">' + value + unit + "</span>";

    if (value_change > 0 || value_change < 0) {
        value_change = value_change > 0 ? '+' + value_change : value_change;
        html = html +
            '&nbsp;<span data-toggle="tooltip" data-placement="top" title="' +
            title +
            value_change +
            unit +
            ' over 7 days" class="badge ' + badge + '">' +
            value_change +
            unit +
            "</span>";
    }

    return html;
}

// *************************************************
// **************** Helper Functions ***************
// *************************************************

function getHeroImage(hero) {
    if (hero == "soldier76") {
        return "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E000000000006E.png";
    } else if (hero == "winston") {
        return "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E0000000000009.png";
    } else if (hero == "mercy") {
        return "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E0000000000004.png";
    } else if (hero == "reinhardt") {
        return "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E0000000000007.png";
    } else if (hero == "mccree") {
        return "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E0000000000042.png";
    } else if (hero == "mei") {
        return "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E00000000000DD.png";
    } else if (hero == "torbjorn") {
        return "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E0000000000006.png";
    } else if (hero == "roadhog") {
        return "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E0000000000040.png";
    } else if (hero == "junkrat") {
        return "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E0000000000065.png";
    } else if (hero == "orisa") {
        return "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E000000000013E.png";
    } else if (hero == "reaper") {
        return "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E0000000000002.png";
    } else if (hero == "zarya") {
        return "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E0000000000068.png";
    } else if (hero == "hanzo") {
        return "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E0000000000005.png";
    } else if (hero == "pharah") {
        return "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E0000000000008.png";
    } else if (hero == "bastion") {
        return "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E0000000000015.png";
    } else if (hero == "lucio") {
        return "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E0000000000079.png";
    } else if (hero == "dva") {
        return "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E000000000007A.png";
    } else if (hero == "widowmaker") {
        return "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E000000000000A.png";
    } else if (hero == "ana") {
        return "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E000000000013B.png";
    } else if (hero == "sombra") {
        return "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E000000000012E.png";
    } else if (hero == "tracer") {
        return "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E0000000000003.png";
    } else if (hero == "symmetra") {
        return "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E0000000000016.png";
    } else if (hero == "zenyatta") {
        return "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E0000000000020.png";
    } else if (hero == "genji") {
        return "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E0000000000029.png";
    } else if (hero == "doomfist") {
        return "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E000000000012F.png";
    } else if (hero == "moira") {
        return "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E00000000001A2.png";
    } else if (hero == "brigitte") {
        return "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E0000000000195.png";
    } else if (hero == "wrecking_b") {
        return "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E00000000001CA.png";
    } else {
        return "";
    }
}

function getHeroType(hero) {
    if (hero == "soldier76") {
        return "OFFENSE";
    } else if (hero == "winston") {
        return "TANK";
    } else if (hero == "mercy") {
        return "SUPPORT";
    } else if (hero == "reinhardt") {
        return "TANK";
    } else if (hero == "mccree") {
        return "OFFENSE";
    } else if (hero == "mei") {
        return "DEFENSE";
    } else if (hero == "torbjorn") {
        return "DEFENSE";
    } else if (hero == "roadhog") {
        return "TANK";
    } else if (hero == "junkrat") {
        return "DEFENSE";
    } else if (hero == "orisa") {
        return "TANK";
    } else if (hero == "reaper") {
        return "OFFENSE";
    } else if (hero == "zarya") {
        return "TANK";
    } else if (hero == "hanzo") {
        return "DEFENSE";
    } else if (hero == "pharah") {
        return "OFFENSE";
    } else if (hero == "bastion") {
        return "DEFENSE";
    } else if (hero == "lucio") {
        return "SUPPORT";
    } else if (hero == "dva") {
        return "TANK";
    } else if (hero == "widowmaker") {
        return "DEFENSE";
    } else if (hero == "ana") {
        return "SUPPORT";
    } else if (hero == "sombra") {
        return "OFFENSE";
    } else if (hero == "tracer") {
        return "OFFENSE";
    } else if (hero == "symmetra") {
        return "SUPPORT";
    } else if (hero == "zenyatta") {
        return "SUPPORT";
    } else if (hero == "genji") {
        return "OFFENSE";
    } else if (hero == "doomfist") {
        return "OFFENSE";
    } else if (hero == "moira") {
        return "SUPPORT";
    } else {
        return "";
    }
}

function getHeroTypeLabel(type) {
    if (type == "OFFENSE") {
        return '<span class="label label-danger"><i class="glyphicon glyphicon-fire"></i> ' + type + "</span>";
    } else if (type == "DEFENSE") {
        return '<span class="label label-primary"><i class="glyphicon glyphicon-tower"></i> ' + type + "</span>";
    } else if (type == "TANK") {
        return '<span class="label label-default"><i class="fa fa-shield"></i> ' + type + "</span>";
    } else if (type == "SUPPORT") {
        return '<span class="label label-warning"><i class="glyphicon glyphicon-plus"></i> ' + type + "</span>";
    } else {
        return "";
    }
}

function hoursPrettyprint(input) {
    var days,
        hours,
        minutes = 0;

    if (input > 12) {
        return Math.round(input / 12) + " days";
    } else if (input < 1) {
        return Math.round(input * 60) + " minutes";
    } else {
        return Math.round(input) + " hours";
    }
}

function timePrettyPrint(input) {
    var totalsec = input * 60;
    var minutes = Math.floor(totalsec / 60);
    var seconds = Math.floor(totalsec - minutes * 60);
    return pad(minutes, 2) + ":" + pad(seconds, 2);
}

function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}
