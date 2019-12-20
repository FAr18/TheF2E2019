
const work_sec = 25 * 60;
const rest_sec = 5 * 60;

let myChart;

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

function updateTimeLeft() {
    $('#time-left-text').text(formatTimeLeft(time_left));
}

function updateProgress() {
    let maxTimeLeft = isWorking() ? work_sec : rest_sec;
    let percentage = time_left / maxTimeLeft * 100;
    setProgressBar(percentage);
}

let currentTodoList = [];
let currentDate = new Date();
let currentTodoIndex = -1;

let timer;
let time_left;
let currentTimerState;

const workingState = 'working';
const restingState = 'resting';

function initializeData() {
    currentTodoList = loadTodayTodoList() || [];

}

function loadSpecificDateTodoList(date) {
    return JSON.parse(localStorage.getItem(date));
}

function loadTodayTodoList() {
    let date = new Date();
    return loadSpecificDateTodoList(formatDate(date));
}

function saveTodoList(date, todoList) {
    if (!date || !todoList) return;
    let dateStr = formatDate(date);
    localStorage.setItem(dateStr, JSON.stringify(todoList));
}

function formatDate(date) {
    return `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`;
}

function formatTimeLeft(timeLeftSec) {
    let min = parseInt(timeLeftSec / 60);
    let sec = timeLeftSec % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function initTodoList() {
    currentTodoList = [];
    currentTodoIndex = -1;
}

function addTodo(todo) {
    currentTodoList.push({
        title: todo,
        done_times: 0,
        is_done: false
    });
    updateTodoList();
}

function addTodoDoneTimes() {
    if (currentTodoIndex) {
        currentTodoList[currentTodoList].done_times++;
        updateTodoList();
    }
}

function setTodoDone(todoIndex) {
    if (currentTodoList[todoIndex]) {
        currentTodoList[todoIndex].is_done = true;
        updateTodoList();
    }
}

function updateTodoList() {
    saveTodayTodoList(currentDate, currentTodoList);
    if (currentDate !== formatDate(new Date())) {
        initTodoList();
        currentDate = new Date();
    }
    //todo: update view
}

function startWorkTime() {
    time_left = work_sec;
    currentTimerState = workingState;
    //todo: setup timer
}

function startRestTime() {
    time_left = rest_sec;
    currentTimerState = restingState;
    //todo: setup timer
}

function pauseTimer() {
    //todo: pause timer

}

function isWorking() {
    return timer && currentTimerState === workingState;
}

function isResting() {
    return timer && currentTimerState === restingState;
}

function isWaiting() {
    return !isWorking() && !isResting();
}

$(document).ready(function() {
    //initialize
    settingChart();
    closeSidePanel();
    settingListener();
    initializeData();
});