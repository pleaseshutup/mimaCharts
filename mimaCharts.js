(function mimaChart() {
    'use strict';
    var mimaChart = function(config) {
        if (typeof config !== 'object') {
            config = {};
        }

        var m = {
                config: config,
                info: {}
            },
            defaults = {
                type: 'donut',
                scale: {},
                ratio: 0.5
            },
            k,
            gatherInfo = function(point) {
                if (!point.info) {
                    point.info = {};
                }
                if (point.v > this.info.highest || typeof this.info.highest === 'undefined') {
                    this.info.highest = point.v;
                }
                if (point.v < this.info.lowest || typeof this.info.lowest === 'undefined') {
                    this.info.lowest = point.v;
                }
                if (point.data) {
                    point.data.forEach(gatherInfo, point);
                }
            },
            generateBars = function(point, p, ar) {
                point.node = document.createElement('div');
                point.node.style.cssText = 'position:absolute;box-sizing: border-box;border:1px solid blue;width:' + (100 / ar.length) + '%;height:100px;bottom:0;left:' + ((100 / ar.length) * p) + '%;';
                this.node.appendChild(point.node);
                if (point.data) {
                    point.data.forEach(generateBars, point);
                }
            };


        for (k in defaults) {
            if (typeof config[k] === 'undefined') {
                m.config[k] = defaults[k];
            }
        }

        m.chart = document.createElement('div');
        m.chart.innerHTML = '<div style="padding-top:' + (config.ratio * 100) + '%"></div>';
        m.chart.style.cssText = 'position:relative;display:inline-block;box-sizing: border-box;width:100%;max-width: 100%;height:' + config.height + 'px;border:1px solid red';

        m.node = document.createElement('div');
        m.node.style.cssText = 'position:absolute;top:0;right:0;bottom:0;left:0';
        m.chart.appendChild(m.node);

        if (m.config.data) {
            m.config.data.forEach(gatherInfo, m);
            if (config.type === 'bar' || config.type === 'line') {
                m.config.data.forEach(generateBars, m);
            }
        }

        console.log('chart', m);
        return m;
    };

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = mimaChart;
    } else {
        window.mimaChart = mimaChart;
    }
    console.log('mimacharts yo', mimaChart);
})();
