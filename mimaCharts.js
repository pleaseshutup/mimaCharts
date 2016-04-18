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

        // svg name space for convenience
        svgNS = 'http://www.w3.org/2000/svg',

        // all classes will start with this prefix, we threw it into a variable to make changing it easier
        cssPrefix = '_mima_',

        // adds if not already set a stylesheet to the document
        setStyleSheet = function() {
            if (!document.getElementById(cssPrefix + 'sheet')) {
                var style = document.createElement('style');
                style.id = cssPrefix + 'sheet';
                style.appendChild(document.createTextNode('\
                .' + cssPrefix + 'abs{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none}\
                .' + cssPrefix + 'sq:before{content:"";display:block;padding-top: 100%;}\
                .' + cssPrefix + 'dot{position:absolute;margin-left:-0.5%;border-radius:50%;min-width:4px;max-width:10px;}\
                .' + cssPrefix + 'pe{pointer-events: all}\
                .' + cssPrefix + 'tooltip{position:absolute;z-index:1;left:0;top:0;min-width:100px;min-height:100px;border-radius:4px;background-color:#000;color:white;box-shadow:0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)}\
                '));
                document.head.appendChild(style);
            }
        },

        xyRadius = function(cx, cy, radius, degrees) {
            //lets have zero be at the left and go clockwise
            //degrees = (360 - (degrees + 90));
            return {
                x: cx + radius * Math.sin(degrees * Math.PI / 180),
                y: cy + radius * Math.cos(degrees * Math.PI / 180)
            };
        },

        // these are just the hue values of the css colors for hsla() after these it's dynamically set
        baseColors = [200, 16, 285],

        // the default configuration passed into mimaChart() for the config parameter
        defaults = {
            type: 'donut',
            scale: {},
            ratio: 1,
            scaleStart: 0,
        },

        // this is the function exposed
        mimaChart = function(config, data) {

            // alows us to accept just data and use default config
            data = typeof data !== 'object' ? config : data;
            data = typeof data !== 'object' ? [] : data;
            config = typeof config !== 'object' ? {} : config;

            config.type1 = (config.type || '')[0] || '';
            if (config.type1 === 'b' || config.type1 === 'l') {
                config.ratio = 0.5;
            }

            var k, m = {
                    config: config,
                    data: data,
                    dataref: {},
                    series: 0,
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
                        color.hsla = m.getColorValue(color);
                        return color;
                    },
                    toolTip: function(e, point) {
                        if(!m.currentToolTip){
                            m.currentToolTip = document.createElement('div');
                            m.currentToolTip.className = cssPrefix + 'tooltip';
                            m.chart.appendChild(m.currentToolTip);
                        }
                        var chartBox = m.chart.getBoundingClientRect(),
                            st = (document.body.scrollTop || document.documentElement.scrollTop),
                            sl = (document.body.scrollLeft || document.documentElement.scrollLeft),
                            x = (e.pageX - (chartBox.left+sl)),
                            y = (e.pageY - (chartBox.top+st)) ;
                        m.currentToolTip.style.left = (x) + 'px';
                        m.currentToolTip.style.top = (y) + 'px';

                        //debug
                        var showPointDebug = {};
                        for(var k in point){
                            if(k !== 'parent'){
                                showPointDebug[k] = point[k];
                            }
                        }
                        m.currentToolTip.innerHTML = '<pre>'+JSON.stringify(showPointDebug, undefined, 2)+'</pre>';
                    }
                },

                // simplify the initialization of the info setting for the top level and each data segment
                initInfo = function(point, level) {
                    point.info = {
                        level: level,
                        lowest: config.scaleStart !== 'auto' ? config.scaleStart : undefined,
                        sum: 0,
                        average: 0,
                        cx: 50,
                        cy: 50,
                        o_rad: 40,
                        i_rad: 20
                    };
                    if(level === 0){
                        point.info.id = 0;
                    }
                },

                // first pass at looping the data structure to figure out highest/lowest values
                gatherInfo1 = function(point, p, ar) {
                    point.parent = this;
                    point.i = p;

                    //set and increment id
                    point.id = m.info.id * 1;
                    m.dataref[point.id] = point;
                    m.info.id++;

                    // we'll assume blank/undefined as zero to not break any math
                    if (!point.v) {
                        point.v = 0;
                    }

                    initInfo(point, this.info.level + 1);

                    this.info.sum += point.v;

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

                    // if point.v is zero or point.v minus lowest is zero just make percent zero to not break math dividing zero by something
                    point.percent_scale = (point.v - this.info.lowest) ? 100 * ((point.v - this.info.lowest) / this.info.highest) : 0;
                    point.percent_series = this.info.sum && point.v ? point.v / this.info.sum * 100 : 0;

                    if (point.data) {
                        point.data.forEach(gatherInfo2, point);
                    }
                },

                // this is executed in gatherInfo1 to figure out soley based on data segment length what even spacing should be
                summaryInfo = function(info, ar) {
                    info.gap = 10;
                    info.gap_less = info.gap * (ar.length + 1);
                    info.seriesIndex = m.series * 1;

                    info.average = info.sum ? info.sum / ar.length : 0;

                    // sets a color for the series
                    info.color = m.getColor(info.seriesIndex, ar.length, false);

                    m.series++;
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

                    if (!point.data || this.info.level === m.config.dataLevel) {
                        // this generates bars within the parent item only for the lowest level of data available
                        point.bar = document.createElement('div');
                        point.bar.style.cssText = objectCSS({
                            position: 'absolute',
                            'background-color': point.color.hsla,
                            bottom: 0,
                            width: '100%',
                            'min-height': '1px',
                            height: point.percent_scale + '%'
                        });
                        point.node.appendChild(point.bar);
                    }

                    if (point.data) {
                        point.data.forEach(generateVerticalBars, point);
                    }
                },

                // line chart lines
                generateLines = function(point, p, ar) {

                    if (!point.data || this.info.level === m.config.dataLevel) {
                        // color is same for series and comes from the parent
                        point.color = this.info.color;

                        point.dot = document.createElement('span');
                        point.dot.className = cssPrefix + 'dot ' + cssPrefix + 'sq';

                        var x = (this.info.gap * (p + 1)) + (((100 - this.info.gap_less) / ar.length) * p),
                            y = 100 - point.percent_scale,
                            w = 2;

                        point.dot.style.cssText = objectCSS({
                            left: x + '%',
                            top: y + '%',
                            margin: '-' + (w * 0.5) + '% 0 0 -' + (w * 0.5) + '%',
                            width: w + '%',
                            'background-color': point.color.hsla
                        });
                        m.node.appendChild(point.dot);

                        if (p > 0) {
                            point.line = document.createElementNS(svgNS, 'path');
                            point.line.setAttribute('d', 'M' + this.info.lastPoint.x + ',' + this.info.lastPoint.y + ' ' + x + ',' + y);
                            point.line.setAttribute('stroke', point.color.hsla);
                            point.line.setAttribute('stroke-width', '0.5%');
                            m.svg.appendChild(point.line);
                        }
                        this.info.lastPoint = {
                            x: x,
                            y: y
                        };

                    }

                    if (point.data) {
                        point.data.forEach(generateLines, point);
                    }
                },

                // pie / donut slices only render the first series of points
                generateSlices = function(point, p, ar) {
                    point.color = m.getColor(p, ar.length, this.color ? this.color : false);

                    point.deg = 360 * (100 / point.percent_series);
                    point.lastDeg = this.info.lastPoint ? this.info.lastPoint.deg : 0;

                    point.p1 = xyRadius(this.info.cx, this.info.cy, this.info.i_rad, point.lastDeg);
                    point.p2 = xyRadius(this.info.cx, this.info.cy, this.info.o_rad, point.lastDeg);
                    point.p3 = xyRadius(this.info.cx, this.info.cy, this.info.o_rad, point.deg);
                    point.p4 = xyRadius(this.info.cx, this.info.cy, this.info.i_rad, point.deg);

                    point.o_sweep = point.percent_series >= 50 ? '0 1,1' : '0 0,1';
                    point.i_sweep = point.percent_series >= 50 ? '0 1,0' : '0 0,0';

                    point.line = document.createElementNS(svgNS, 'path');
                    point.line.setAttribute('d',
                        'M' + point.p1.x + ',' + point.p1.y +
                        ' L' + point.p2.x + ',' + point.p2.y +
                        ' A' + this.info.o_rad + ',' + this.info.o_rad + ' ' + point.o_sweep + ' ' + point.p3.x + ',' + point.p3.y +
                        ' L' + point.p4.x + ',' + point.p4.y +
                        ' A' + this.info.i_rad + ',' + this.info.i_rad + ' ' + point.i_sweep + ' ' + point.p1.x + ',' + point.p1.y
                    );
                    point.line.setAttribute('class', cssPrefix + 'pe');
                    point.line.setAttribute('fill', point.color.hsla);
                    point.line.setAttribute('stroke-width', 1);
                    point.line.setAttribute('stroke', point.color.hsla);
                    point.line.setAttribute('data-point', point.id);
                    m.svg.appendChild(point.line);

                    this.info.lastPoint = {
                        deg: point.deg
                    };

                },

                //all pointer events
                pointerEvents = function(e){
                    if(e.target){
                        var pointID = e.target.getAttribute('data-point');
                        if(pointID !== null){
                            pointID = pointID * 1;
                            if(m.dataref[pointID]){
                                m.toolTip(e, m.dataref[pointID]);
                            } else {
                                console.error('No dataref to id', pointID);
                            }
                        }
                    }
                };


            for (k in defaults) {
                if (typeof config[k] === 'undefined') {
                    m.config[k] = defaults[k];
                }
            }

            initInfo(m, 0);

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

            m.svg = document.createElementNS(svgNS, 'svg');
            m.svg.setAttribute('viewBox', '0 0 100 100');
            m.svg.setAttribute('width', '100%');
            m.svg.setAttribute('height', '100%');
            m.svg.setAttribute('preserveAspectRatio', 'none');
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
                } else if (config.type === 'pie' || config.type === 'donut') {
                    generatorFunc = generateSlices;
                }
                m.data.forEach(generatorFunc, m);

            }

            m.chart.addEventListener('mousemove', pointerEvents);

            console.log('chart', m);
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
