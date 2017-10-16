var comp_general = (function() {
    var initCharts = function() {
        // $("iframe").css("height", $(window).height() + "px");

        $(window).load(function() {
            $("#preloader").fadeOut("slow", function() {
                $(this).hide();
            });

            $("iframe").each(function(pos, elem) {
                var minHeight = 500;
                var calculatedHeight = $("#main-container").height() - $(".content.bg-gray-lighter").outerHeight() - 40;
                var height = calculatedHeight < minHeight ? minHeight : calculatedHeight;

                if ($(elem).height() == 150) $(elem).height(height);
                $(elem).attr("src", $(elem).attr("x-src"));
            });
        });
    };

    return {
        init: function() {
            initCharts();
        }
    };
})();

jQuery(function() {
    comp_general.init();
});

$("img.hero").click(function() {
    var hero = $(this)[0].id;
    var table = $(".hero-frame")
        .contents()
        .find("table");
    var rows = table.find("tr");
    rows.show(); // Reset Table

    rows.find("td").each(function() {
        var text = correctText($(this).text());
        if (isHero(text)) {
            if (text != hero) {
                $(this)
                    .parent()
                    .hide();
            }
        }
    });

    $(".block-content img").each(function() {
        if (this.id != hero) {
            setGreyscale($(this));
        } else {
            resetGreyscale($(this));
        }
    });
});

function showLoader() {
    $("#preloader").show();
}

function hideLoader() {
    $("#preloader").fadeOut("slow", function() {
        $(this).hide();
    });
}

function setGreyscale(elem) {
    elem.css("-webkit-filter", "grayscale(100%)");
    elem.css("filter", "grayscale(100%)");
}

function resetGreyscale(elem) {
    elem.css("-webkit-filter", "");
    elem.css("filter", "");
}

function correctText(text) {
    if (text.startsWith("Hero")) {
        return text.substring(4);
    }
    return text;
}

function isHero(value) {
    switch (value) {
        case "ana":
            return true;
            break;
        case "bastion":
            return true;
            break;
        case "doomfist":
            return true;
            break;
        case "dva":
            return true;
            break;
        case "genji":
            return true;
            break;
        case "hanzo":
            return true;
            break;
        case "junkrat":
            return true;
            break;
        case "lucio":
            return true;
            break;
        case "mccree":
            return true;
            break;
        case "mei":
            return true;
            break;
        case "mercy":
            return true;
            break;
        case "orisa":
            return true;
            break;
        case "pharah":
            return true;
            break;
        case "reaper":
            return true;
            break;
        case "reinhardt":
            return true;
            break;
        case "roadhog":
            return true;
            break;
        case "soldier76":
            return true;
            break;
        case "sombra":
            return true;
            break;
        case "symmetra":
            return true;
            break;
        case "torbjorn":
            return true;
            break;
        case "tracer":
            return true;
            break;
        case "widowmaker":
            return true;
            break;
        case "winston":
            return true;
            break;
        case "zarya":
            return true;
            break;
        case "zenyatta":
            return true;
            break;
        default:
            return false;
    }
}
