var comp_general = (function() {
    var initCharts = function() {
        // $("iframe").css("height", $(window).height() + "px");

        $(window).load(function() {
            $("#preloader").fadeOut("slow", function() {
                $(this).hide();
            });

            $("iframe").each(function(pos, elem) {
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
