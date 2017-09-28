var comp_general = function() {

    var initCharts = function() {
        $('iframe').css('height', $(window).height() + 'px');

        // Set Global Chart.js configuration
        // Chart.defaults.global.defaultFontColor = '#999';
        // Chart.defaults.global.defaultFontFamily = 'Open Sans';
        // Chart.defaults.global.defaultFontStyle = '600';
        // Chart.defaults.scale.gridLines.color = "rgba(0,0,0,.05)";
        // Chart.defaults.scale.gridLines.zeroLineColor = "rgba(0,0,0,.1)";
        // Chart.defaults.global.elements.line.borderWidth = 2;
        // Chart.defaults.global.elements.point.radius = 4;
        // Chart.defaults.global.elements.point.hoverRadius = 6;
        // Chart.defaults.global.tooltips.titleFontFamily = 'Source Sans Pro';
        // Chart.defaults.global.tooltips.bodyFontFamily = 'Open Sans';
        // Chart.defaults.global.tooltips.cornerRadius = 3;
        // Chart.defaults.global.legend.labels.boxWidth = 15;

        // Get Chart Containers
        // var $chartLines1Con = jQuery('.js-chart-lines1');
        // var $chart2BarsCon = jQuery('.js-chartjs2-bars');
        // var $chart2RadarCon = jQuery('.js-chartjs2-radar');
        // var $chart2PolarCon = jQuery('.js-chartjs2-polar');
        // var $chart2PieCon = jQuery('.js-chartjs2-pie');
        // var $chart2DonutCon = jQuery('.js-chartjs2-donut');

        // Set Chart and Chart Data variables
        // let $chartLines1;
        // var $chart2Lines, $chart2Bars, $chart2Radar, $chart2Polar, $chart2Pie, $chart2Donut;
        // var $chart2LinesBarsRadarData, $chart2PolarPieDonutData;

        // var $chartLines1Data = {

        // }

        // Lines/Bar/Radar Chart Data
        // var $chart2LinesBarsRadarData = {
        //     labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
        //     datasets: [{
        //             label: 'Last Week',
        //             fill: true,
        //             backgroundColor: 'rgba(220,220,220,.3)',
        //             borderColor: 'rgba(220,220,220,1)',
        //             pointBackgroundColor: 'rgba(220,220,220,1)',
        //             pointBorderColor: '#fff',
        //             pointHoverBackgroundColor: '#fff',
        //             pointHoverBorderColor: 'rgba(220,220,220,1)',
        //             data: [30, 32, 40, 45, 43, 38, 55]
        //         },
        //         {
        //             label: 'This Week',
        //             fill: true,
        //             backgroundColor: 'rgba(171, 227, 125, .3)',
        //             borderColor: 'rgba(171, 227, 125, 1)',
        //             pointBackgroundColor: 'rgba(171, 227, 125, 1)',
        //             pointBorderColor: '#fff',
        //             pointHoverBackgroundColor: '#fff',
        //             pointHoverBorderColor: 'rgba(171, 227, 125, 1)',
        //             data: [15, 16, 20, 25, 23, 25, 32]
        //         }
        //     ]
        // };

        // Polar/Pie/Donut Data
        // var $chart2PolarPieDonutData = {
        //     labels: [
        //         'Earnings',
        //         'Sales',
        //         'Tickets'
        //     ],
        //     datasets: [{
        //         data: [
        //             48,
        //             26,
        //             26
        //         ],
        //         backgroundColor: [
        //             'rgba(171, 227, 125, 1)',
        //             'rgba(250, 219, 125, 1)',
        //             'rgba(117, 176, 235, 1)'
        //         ],
        //         hoverBackgroundColor: [
        //             'rgba(171, 227, 125, .75)',
        //             'rgba(250, 219, 125, .75)',
        //             'rgba(117, 176, 235, .75)'
        //         ],
        //         borderWidth: [
        //             0,
        //             0,
        //             0
        //         ]
        //     }]
        // };

        // Init Charts
        // $chart2Lines = new Chart($chart2LinesCon, { type: 'line', data: $chart2LinesBarsRadarData });
        // $chart2Bars = new Chart($chart2BarsCon, { type: 'bar', data: $chart2LinesBarsRadarData });
        // $chart2Radar = new Chart($chart2RadarCon, { type: 'radar', data: $chart2LinesBarsRadarData });
        // $chart2Polar = new Chart($chart2PolarCon, { type: 'polarArea', data: $chart2PolarPieDonutData });
        // $chart2Pie = new Chart($chart2PieCon, { type: 'pie', data: $chart2PolarPieDonutData });
        // $chart2Donut = new Chart($chart2DonutCon, { type: 'doughnut', data: $chart2PolarPieDonutData });
    };

    return {
        init: function() {
            initCharts();
        }
    };
}();

jQuery(function() { comp_general.init(); });