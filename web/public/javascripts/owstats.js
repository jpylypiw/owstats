var comp_general = function() {

    var initCharts = function() {
        $('iframe').css('height', $(window).height() + 'px');

        $(window).load(function() {
            $('#preloader').fadeOut('slow', function() { $(this).remove(); });
        });
    };

    return {
        init: function() {
            initCharts();
        }
    };
}();

jQuery(function() { comp_general.init(); });