(function mimaChart() {
    'use strict';

    var objectCSS = function(obj) {
            // takes an object and simply converts it into a css string for convenience
            var string = '';
            for (var k in obj) {
                string += k + ':' + obj[k] + ';';
            }
            return string;
        },

        // all classes will start with this prefix, we threw it into a variable to make changing it easier
        cssPrefix = '_mima_',

        // adds if not already set a stylesheet to the document
        setStyleSheet = function() {
            if (!document.getElementById(cssPrefix + 'sheet')) {
                var style = document.createElement('style');
                style.id = cssPrefix + 'sheet';
                style.appendChild(document.createTextNode('\
                .' + cssPrefix + 'abs{position:absolute;top:0;left:0;width:100%;height:100%}\
                .' + cssPrefix + 'sq:before{content:"";display:block;padding-top: 100%;}\
                '));
                document.head.appendChild(style);
            }
        },

        // these are just the hue values of the css colors for hsla() after these it's dynamically set
        baseColors = [200, 16, 285],

        // the default configuration passed into mimaChart() for the config parameter
        defaults = {
            type: 'donut',
            scale: {},
            ratio: 0.5,
            scaleStart: 0,
        },

        // this is the function exposed
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
                    getColorValue: function(color) {
                        return 'hsla(' + color.h + ',' + color.s + ',' + color.l + ',' + color.a + ')';
                    },
                    getColor: function(i, len, parent) {
                        var color = {
                            h: 0,
                            s: '100%',
                            l: '64%',
                            a: 1
                        };
                        if (parent) {
                            var div = (50 / len);
                            color.h = parent.h;
                            color.l = 24 + Math.round((div * 0.5) + (div * i)) + '%';
                        } else {
                            if (i < baseColors.length) {
                                color.h = baseColors[i];
                            } else {
                                var div = (360 / len);
                                color.h = Math.round((div * 0.5) + (div * i));
                            }
                        }
                        color.color = m.getColorValue(color);
                        return color;
                    },
                },

                // first pass at looping the data structure to figure out highest/lowest values
                gatherInfo1 = function(point, p, ar) {
                    if (!point.info) {
                        point.info = {
                            lowest: config.scaleStart !== 'auto' ? config.scaleStart : undefined
                        };
                    }
                    if (point.v > this.info.highest || typeof this.info.highest === 'undefined') {
                        this.info.highest = point.v;
                    }
                    if (config.scaleStart === 'auto') {
                        if (point.v < this.info.lowest || typeof this.info.lowest === 'undefined') {
                            this.info.lowest = point.v;
                        }
                    }
                    if (point.data) {
                        point.data.forEach(gatherInfo1, point);
                    }
                    if (p === ar.length - 1) {
                        summaryInfo(this.info, ar);
                    }
                },

                //second pass after we know the highest/lowest values (scale stuff) we can set the percent relative here
                gatherInfo2 = function(point, p, ar) {
                    point.percent = 100 * ((point.v - this.info.lowest) / this.info.highest);
                    if (point.data) {
                        point.data.forEach(gatherInfo2, point);
                    }
                },

                // this is executed in gatherInfo1 to figure out soley based on data segment length what even spacing should be
                summaryInfo = function(info, ar) {
                    info.gap = 10;
                    info.gap_less = info.gap * (ar.length + 1);
                },

                // bar chart bars
                generateVerticalBars = function(point, p, ar) {
                    point.color = m.getColor(p, ar.length, this.color ? this.color : false);

                    point.node = document.createElement('div');
                    point.node.style.cssText = objectCSS({
                        position: 'absolute',
                        width: ((100 - this.info.gap_less) / ar.length) + '%',
                        top: 0,
                        bottom: 0,
                        left: (this.info.gap * (p + 1)) + (((100 - this.info.gap_less) / ar.length) * p) + '%'
                    });
                    this.node.appendChild(point.node);

                    if (!point.data) {
                        // this generates bars within the parent item only for the lowest level of data available
                        point.bar = document.createElement('div');
                        point.bar.style.cssText = objectCSS({
                            position: 'absolute',
                            'background-color': point.color.color,
                            bottom: 0,
                            width: '100%',
                            'min-height': '1px',
                            height: point.percent + '%'
                        });
                        point.node.appendChild(point.bar);
                    }

                    if (point.data) {
                        point.data.forEach(generateVerticalBars, point);
                    }
                },

                // line chart lines
                generateLines = function(point, p, ar) {
                    point.color = m.getColor(p, ar.length, this.color ? this.color : false);

                    point.node = document.createElement('div');
                    point.node.style.cssText = objectCSS({
                        position: 'absolute',
                        width: ((100 - this.info.gap_less) / ar.length) + '%',
                        top: 0,
                        bottom: 0,
                        left: (this.info.gap * (p + 1)) + (((100 - this.info.gap_less) / ar.length) * p) + '%'
                    });
                    this.node.appendChild(point.node);

                    if (!point.data) {
                        // this generates bars within the parent item only for the lowest level of data available
                        point.dot = document.createElement('div');
                        point.dot.className = cssPrefix + 'sq';
                        point.dot.style.cssText = objectCSS({
                            position: 'absolute',
                            left: '50%',
                            top: ((100 - point.percent) + 0.5) + '%',
                            'margin-left': '-0.5%',
                            'border-radius': '50%',
                            width: '20%',
                            'min-width': '4px',
                            'max-width': '20px',
                            'background-color': point.color.color

                        });
                        point.node.appendChild(point.dot);
                    }

                    if (point.data) {
                        point.data.forEach(generateVerticalBars, point);
                    }
                };


            for (k in defaults) {
                if (typeof config[k] === 'undefined') {
                    m.config[k] = defaults[k];
                }
            }

            m.info = {
                lowest: config.scaleStart !== 'auto' ? config.scaleStart : undefined
            };

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

                var generatorFunc = generateVerticalBars;
                if (config.type === 'line') {
                    generatorFunc = generateLines;
                }
                m.data.forEach(generatorFunc, m);

            }

            setStyleSheet();
            return m;
        };

    // *could* be used in a server-side dom situation but I doubt it. Just throwing it here in case
    // it is to be modularized in the future somehow
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = mimaChart;
    } else {
        window.mimaChart = mimaChart;
    }

})();
