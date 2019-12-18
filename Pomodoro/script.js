
let myChart;
let timer;

let progress_bar;


function settingChart() {
    Chart.defaults.global.defaultFontColor = 'white';
    Chart.defaults.global.defaultFontFamily = 'Roboto';
    Chart.defaults.global.defaultFontStyle = 'bold';
    Chart.defaults.global.defaultFontSize = 16;

    var ctx = document.getElementById('chart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['12/15', '12/16', '12/17', '12/18', '12/19', '12/20', '12/21'],
            datasets: [{
                data: [16, 12, 16, 8, 12, 4, 20],
                backgroundColor: [
                    'white',
                    'white',
                    '#ff4384',
                    'white',
                    'white',
                    'white',
                    'white'
                ],
                maxBarThickness: 32
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        min: 0,
                        max: 24,
                        stepSize: 4,
                        callback: function(value, index) {
                            if (value !== 0) return value;
                        },
                        padding: 7
                    },
                    gridLines: {
                        color: 'white',
                        drawBorder: true,
                        drawTicks: false,
                        drawOnChartArea: false
                    }
                }],
                xAxes: [{
                    ticks: {
                        padding: 16
                    },
                    gridLines: {
                        color: 'white',
                        drawBorder: true,
                        drawTicks: false,
                        drawOnChartArea: false
                    }
                }]
            },
            legend: {
                display: false
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem) {
                        return tooltipItem.yLabel;
                    }
                }
            }
        }
    });
};

function setChart() {
    myChart.data.datasets.data = [0, 0, 0, 0, 0, 0, 0];
    myChart.data.datasets.backgroundColor = ['white', 'white', 'white', 'white', 'white', 'white', 'white'];
    myChart.update();
};

function isSidePanelOpen() {
    return $('.panel-left').css('width') === '0px';
}

function openSidePanel() {
    $('.panel-left').css('flex', '0');
    $('.panel-left').css('width', '0');
    $('.progress-circle').hide();
    $('.panel-right nav').css('left', '85px');
    $('.panel-right nav').css('right', 'auto');
    $('#panel-btn-close').show();
    deactiveAllNavBtns();
}

function closeSidePanel() {
    $('.panel-left').css('flex', '7');
    $('.panel-left').css('width', 'auto');
    $('.progress-circle').show();
    $('.panel-right nav').css('left', 'auto');
    $('.panel-right nav').css('right', '85px');
    $('#panel-btn-close').hide();
    hideAllPanelPages();
    foldNavBtn();
}

function deactiveAllNavBtns() {
    $('.panel-right nav .nav-btn').addClass('deactive');
}

function activeNavBtn(target) {
    $('.nav-btn>span').show();
    $(target).removeClass('deactive');
    $(target).addClass('active');
}

function foldNavBtn() {
    $('.panel-right nav .nav-btn').removeClass('deactive');
    $('.panel-right nav .nav-btn').removeClass('active');
    $('.nav-btn>span').hide();
}

function hideAllPanelPages() {
    $('.panel-page-content').hide();
}

function showPanelPageToDo() {
    $('#panel-page-todo').show();
}

function showPanelPageAnalytics() {
    $('#panel-page-analytics').show();
}

function showPanelPageRingtones() {
    $('#panel-page-ringtones').show();
}

function openPanelTodo() {
    if(!isSidePanelOpen()) openSidePanel();
    deactiveAllNavBtns();
    activeNavBtn('#nav-btn-todo');
    hideAllPanelPages();
    showPanelPageToDo();
}

function openPanelAnalytics() {
    if(!isSidePanelOpen()) openSidePanel();
    deactiveAllNavBtns();
    activeNavBtn('#nav-btn-analytics');
    hideAllPanelPages();
    showPanelPageAnalytics();
}

function openPanelRingtones() {
    if(!isSidePanelOpen()) openSidePanel();
    deactiveAllNavBtns();
    activeNavBtn('#nav-btn-ringtones');
    hideAllPanelPages();
    showPanelPageRingtones();
}

function setProgressBar(value) {
    /*59.7 = circle_r * 2 * Pi */
    $('#progress-bar').attr('stroke-dasharray', `calc(${value} * 0.597) 59.7`);
}

function settingListener() {
    $('#nav-btn-todo').click(() => {openPanelTodo();});
    $('#nav-btn-analytics').click(() => {openPanelAnalytics();});
    $('#nav-btn-ringtones').click(() => {openPanelRingtones();});
    $('#panel-btn-close').click(() => {closeSidePanel();});
}

//initialize
settingChart();
closeSidePanel();
settingListener();
