var charts = [{
    title: 'Line',
    config: {
        type: 'line'
    },
    data: [{
        v: 10
    }, {
        v: 20
    }, {
        v: 15
    }]
}, {
    title: 'Multi Line',
    config: {
        type: 'line'
    },
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
}, {
    title: 'Bar',
    config: {
        type: 'bar'
    },
    data: [{
        v: 0
    }, {
        v: 1
    }, {
        v: 5
    }, {
        v: 2.45343
    }]
}, {
    title: 'Multi-Bar',
    config: {
        type: 'bar'
    },
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
}, {
    title: 'Pie',
    config: {
        type: 'pie'
    },
    data: [{
        v: 10
    }, {
        v: 20
    }, {
        v: 15
    }]
}, {
    title: 'Donut',
    config: {
        type: 'donut'
    },
    data: [{
        v: 10
    }, {
        v: 20
    }, {
        v: 15
    }]
}, {
    title: 'Dial',
    config: {
        type: 'dial'
    },
    data: [{
        v: 10
    }, {
        v: 20
    }, {
        v: 15
    }]
}];

var types = ['line','bar','donut','pie','dial'];

// two random charts
var genRandomDataSegment = function(){
    var data = [],
        numZeros = Math.random() * 10;
    for(var i=0; i< Math.round(Math.random() * 10); i++){
        data.push({v: Math.round(Math.random() * 10) * numZeros});
    }
    return data;
}, addDataSegment = function(item, level, maxLevels){
    var data = genRandomDataSegment();
    item.data.forEach(function(point){
        point.data = genRandomDataSegment();
        if(level < maxLevels){
            addDataSegment(point, level+1, maxLevels);
        }
    });
};
for(var i=0; i<5; i++){
    var dataItem = {
        title: 'Random '+i,
        config: {
            type: types[Math.round(Math.random() * (types.length-1))]
        },
        data: genRandomDataSegment()
    }, levels = Math.round(Math.random() * 3);
    if(levels){
        addDataSegment(dataItem, 1, levels);
    }
    charts.push(dataItem);
}

charts.forEach(function(chart) {
    var sec = document.createElement('section'),
        chartDOM = mimaChart(chart.config, chart.data).chart;

    sec.style.cssText = 'display:inline-block;box-sizing:border-box;width:25%;padding:0 1%';
    sec.innerHTML = '<h2>' + chart.title + '</h2>';
    sec.appendChild(chartDOM);
    document.body.appendChild(sec);
});

var mimaInstance = mimaChart(),
    colorSec = document.createElement('div');
[1,2,3,5,12,20,100,200,600].forEach(function(num){
    var colors = document.createElement('div');
    colors.innerHTML = '<div>'+num+' colors</div>';
    for(var i=0; i<num;i++){
        var color = document.createElement('span'),
            getColor = mimaInstance.getColor(i, num);
        color.setAttribute('title', JSON.stringify(getColor));
        color.style.cssText = 'display:inline-block;box-sizing:border-box;width:20px;height:16px;margin:0 6px 6px 0;background-color:'+getColor.color;
        colors.appendChild(color);
    }
    colorSec.appendChild(colors);
});
document.body.appendChild(colorSec);
