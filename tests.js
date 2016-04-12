var charts = [{
    title: 'Test Line Chart 1',
    config: {
        type: 'line',
        data: [{
            v: 10
        }, {
            v: 20
        }, {
            v: 15
        }]
    }
}, {
    title: 'Test Bar Chart 1',
    config: {
        type: 'bar',
        data: [{
            v: 0
        }, {
            v: 1
        }, {
            v: 5
        }, {
            v: 2.45343
        }]
    }
}, {
    title: 'Test Multi Bar Chart 1',
    config: {
        type: 'bar',
        data: [{
            v: 0,
            data: [{
                v: 0
            }, {
                v: 0
            }]
        }, {
            v: 1,
            data: [{
                v: 1
            }, {
                v: 0
            }]
        }, {
            v: 5,
            data: [{
                v: 5
            }, {
                v: 0
            }, {
                v: 3
            }, {
                v: 4
            }]
        }, {
            v: 2.45343,
            data: [{
                v: 5
            }, {
                v: 2.45343
            }]
        }]
    }
}].forEach(function(chart) {
    var sec = document.createElement('section'),
        chartDOM = mimaChart(chart.config).chart;

    sec.style.cssText = 'display:inline-block;box-sizing:border-box;width:33%;padding:1%';
    sec.innerHTML = '<h2>' + chart.title + '</h2>';
    sec.appendChild(chartDOM);
    document.body.appendChild(sec);
});
