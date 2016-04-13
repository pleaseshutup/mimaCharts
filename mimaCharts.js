(function mimaChart() {
    'use strict';
    var objectCSS = function(obj) {
            var string = '';
            for (var k in obj) {
                string += k + ':' + obj[k] + ';';
            }
            return string;
        },
        cssPrefix = '_mima_',
        setStyleSheet = function() {
            if (!document.getElementById(cssPrefix + 'sheet')) {
                var style = document.createElement('style');
                style.id = cssPrefix + 'sheet';
                style.appendChild(document.createTextNode('\
                .' + cssPrefix + 'abs{position:absolute;top:0;left:0;width:100%;height:100%}\
                '));
                document.head.appendChild(style);
            }
        },
        mimaChart = function(config, data) {
            if (typeof data !== 'object') {
                // alows us to accept just data and use default config
                data = config;
            }
            data = typeof data !== 'object' ? [] : data;
            config = typeof config !== 'object' ? {} : config;

            var k, m = {
                    config: config,
                    data: data,
                    info: {},
                    getColor: function(i, len) {
                        var hue = Math.round((360 / len) * i);
                        return 'hsla(' + hue + ', 100%, 68%, 1)';
                    },
                },
                defaults = {
                    type: 'donut',
                    scale: {},
                    ratio: 0.5
                },
                gatherInfo1 = function(point, p, ar) {
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
                        point.data.forEach(gatherInfo1, point);
                    }
                    if (p === ar.length - 1) {
                        summaryInfo(this.info, ar);
                    }
                },
                gatherInfo2 = function(point, p, ar) {
                    point.percent = 100 * ((point.v - this.info.lowest) / this.info.highest);
                    if (point.data) {
                        point.data.forEach(gatherInfo2, point);
                    }
                },
                summaryInfo = function(info, ar) {
                    info.gap = 1;
                    info.gap_less = info.gap * (ar.length + 1);
                },
                generateVerticalBars = function(point, p, ar) {
                    point.node = document.createElement('div');
                    point.node.style.cssText = objectCSS({
                        position: 'absolute',
                        width: ((100 - this.info.gap_less) / ar.length) + '%',
                        top: 0,
                        bottom: 0,
                        left: (this.info.gap * (p + 1)) + (((100 - this.info.gap_less) / ar.length) * p) + '%'
                    });
                    this.node.appendChild(point.node);

                    point.bar = document.createElement('div');
                    point.bar.style.cssText = objectCSS({
                        position: 'absolute',
                        margin: '0 auto',
                        'background-color': m.getColor(p, ar.length),
                        bottom: 0,
                        width: '100%',
                        'min-height': '1px',
                        'max-width': '20px',
                        height: point.percent + '%'
                    });
                    point.node.appendChild(point.bar);

                    if (point.data) {
                        point.data.forEach(generateVerticalBars, point);
                    }
                };


            for (k in defaults) {
                if (typeof config[k] === 'undefined') {
                    m.config[k] = defaults[k];
                }
            }

            m.chart = document.createElement('div');
            m.chart.innerHTML = '<div style="padding-top:' + (config.ratio * 100) + '%"></div>';
            m.chart.style.cssText = objectCSS({
                position: 'relative',
                display: 'inline-block',
                'box-sizing': 'border-box',
                width: '100%',
                'max-width': '100%',
                height: config.height + 'px',
                outline: '1px solid #ccc'
            });

            m.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            m.svg.setAttribute('class', cssPrefix + 'abs');
            m.chart.appendChild(m.svg);
            // example for xlink if used use.elements[0].setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#icon-' + name);

            m.node = document.createElement('div');
            m.node.className = cssPrefix + 'abs';
            m.chart.appendChild(m.node);

            if (m.data) {
                m.data.forEach(gatherInfo1, m);
                m.data.forEach(gatherInfo2, m);

                m.data.forEach(generateVerticalBars, m);

            }

            console.log('chart', m);
            setStyleSheet();
            return m;
        };

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = mimaChart;
    } else {
        window.mimaChart = mimaChart;
    }
})();
