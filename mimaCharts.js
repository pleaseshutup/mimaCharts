(function mimaCharts() {
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

		// constants for convenience
		materialShadow1 = '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',

		// all classes will start with this prefix, we threw it into a variable to make changing it easier
		cssPrefix = '_mima_',

		shadowDom = document.createElement('div'),

		// adds if not already set a stylesheet to the document
		setStyleSheet = function() {
			if (!document.getElementById(cssPrefix + 'sheet')) {
				var style = document.createElement('style');
				style.id = cssPrefix + 'sheet';
				style.appendChild(document.createTextNode('\
				.' + cssPrefix + 'abs{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none}\
				.' + cssPrefix + 'sq:before{content:"";display:block;padding-top: 100%;}\
				.' + cssPrefix + 'dot{position:absolute;margin:-1.5% 0 0 -1.5%;border-radius:50%;width:3%}\
				.' + cssPrefix + 'pe{pointer-events: all}\
				.' + cssPrefix + 'slice,.' + cssPrefix + 'bar,.' + cssPrefix + 'dot{transition: transform 0.15s ease-in-out, filter 0.15s ease-in-out; transform: translate3d(0,0,0); transform-origin: 50% 50%; }\
				.' + cssPrefix + 'hoverContainer{z-index:1;pointer-events:none;position:absolute;left:0;top:0;border:1px solid #eaeaea; padding:4px;background-color:#fff;box-shadow:'+materialShadow1+';transition: all 0.15s ease-out;}\
				.' + cssPrefix + 'scaleLine{position: absolute; top: 0; left: 0; right: 0; height: 1px; background-color: #ccc; }\
				.' + cssPrefix + 'scaleText{display: inline-block; position: absolute; top: 0; left: 0; font-size: 12px; color: #999; line-height: 10%; text-align:right; }\
				.' + cssPrefix + 'legend{display: inline-block; position: absolute; top: 0; left: 0; font-size: 12px; color: #666; }\
				.' + cssPrefix + 'legend span{display: inline-block; vertical-align:middle; pointer-events:none; }\
				.' + cssPrefix + 'legendColor{ border-radius: 50%; width: 12px; height: 12px; margin-right: 4px; }\
				'));
				document.head.appendChild(style);
			}
		},

		xyRadius = function(cx, cy, radius, degrees) {
			//lets have zero be at the left and go clockwise
			//degrees = degrees + 180;
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
			ratio: 0.5
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
					hover: function(e) {
						var point,
							pointID = e.target ? e.target.getAttribute('data-point') : null,
							point = m.dataref[pointID * 1],
							show = e.type === 'mouseover';

						if (pointID && point && show) {
							if (!m.currentHover) {
								m.currentHover = document.createElement('div');
								m.currentHover.className = cssPrefix + 'hoverContainer';
								m.chart.appendChild(m.currentHover);
							} else {
								m.currentHover.style.display = '';
							}
							var chartBox = m.chart.getBoundingClientRect(),
								st = (document.body.scrollTop || document.documentElement.scrollTop),
								sl = (document.body.scrollLeft || document.documentElement.scrollLeft),
								x = (e.pageX - (chartBox.left + sl)),
								y = (e.pageY - (chartBox.top + st));

							m.currentHover.style.left = (x) + 'px';
							m.currentHover.style.top = (y) + 'px';

							if(point.slice){
								point.slice.style.transform = 'scale(1.05)';
								point.slice.setAttribute('filter', 'url(#'+cssPrefix+'material-shadow-1)');
								point.slice.parentNode.appendChild(point.slice);
								point.legend.style.transform = 'scale(1.1)';
							}
							if(point.bar){
								point.bar.style.transform = 'scale(1.05)';
								point.bar.style.boxShadow = materialShadow1;
							}
							if(point.dot){
								point.dot.style.transform = 'scale(1.2)';
							}

							if (false) {
								//debug
								var showPointDebug = {};
								for (var k in point) {
									if (k !== 'parent') {
										showPointDebug[k] = point[k];
									}
								}
								m.currentHover.innerHTML = '<pre>' + JSON.stringify(m.info, undefined, 2) + '</pre>';
							} else {
								if (!point.hoverContent) {
									show = false;
								} else {
									m.currentHover.innerHTML = point.hoverContent || '';
								}
							}
						} else {
							if (!point) {
								console.error('No dataref to id', pointID);
							}
						}
						if (!show) {
							if (m.currentHover) {
								m.currentHover.style.display = 'none';

								if(point.slice){
									point.slice.style.transform = 'scale(1)';
									point.slice.setAttribute('filter', '');
									point.legend.style.transform = 'scale(1)';
								}
								if(point.bar){
									point.bar.style.transform = 'scale(1)';
									point.bar.boxShadow = '';
								}
								if(point.dot){
									point.dot.style.transform = 'scale(1)';
								}
								if(point.line){
									point.line.style.transform = 'scale(1)';
									point.line.setAttribute('filter', '');
								}

							}
						}
					}
				},

				// simplify the initialization of the info setting for the top level and each data segment
				initInfo = function(point, level) {
					point.info = {
						level: level,
						lowest: config.scale.lowest,
						highest: config.scale.highest,
						sum: 0,
						average: 0,
						cx: 25,
						cy: 25,
						o_rad: 22,
						i_rad: 12
					};
					if (level === 0) {
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
				generateBars = function(point, p, ar) {
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
						point.bar.className = cssPrefix + 'bar';
						point.bar.style.cssText = objectCSS({
							position: 'absolute',
							'background-color': point.color.hsla,
							bottom: 0,
							width: '100%',
							'min-height': '1px',
							height: point.percent_scale + '%'
						});
						point.bar.setAttribute('class', cssPrefix + 'pe');
						point.bar.setAttribute('data-point', point.id);
						point.node.appendChild(point.bar);
					}

					point.hoverContent = (point.l || '') + ' ' + Math.round(point.v);

					if (point.data) {
						point.data.forEach(generateBars, point);
					}
				},

				// line chart lines
				generateLines = function(point, p, ar) {

					if (!point.data || this.info.level === m.config.dataLevel) {
						// color is same for series and comes from the parent
						point.color = this.info.color;

						point.dot = document.createElement('span');
						point.dot.className = cssPrefix + 'dot ' + cssPrefix + 'sq ' + cssPrefix + 'pe';

						var x = (this.info.gap * (p + 1)) + (((100 - this.info.gap_less) / ar.length) * p),
							y = 100 - point.percent_scale;

						point.dot.style.cssText = objectCSS({
							left: x + '%',
							top: y + '%',
							'background-color': point.color.hsla
						});
						point.dot.setAttribute('data-point', point.id);
						m.node.appendChild(point.dot);

						if (p > 0) {
							point.line = document.createElementNS(svgNS, 'path');
							point.line.setAttribute('class', cssPrefix + 'pe');
							point.line.setAttribute('data-point', point.id);
							point.line.setAttribute('d', 'M' + this.info.lastPoint.x + ',' + (this.info.lastPoint.y * m.config.ratio) + ' ' + x + ',' + (y * m.config.ratio));
							point.line.setAttribute('stroke', point.color.hsla);
							point.line.setAttribute('stroke-width', '1%');
							m.svg.appendChild(point.line);
						}

						point.hoverContent = (point.l || '') + ' ' + Math.round(point.v);

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

					point.percent_decimal = point.percent_series ? point.percent_series / 100 : 0;
					point.deg_from = this.info.lastDegTo || 0;
					point.deg_to = point.deg_from + (360 * point.percent_decimal);
					this.info.lastDegTo = point.deg_to * 1;

					point.p1 = xyRadius(this.info.cx, this.info.cy, this.info.i_rad, point.deg_from);
					point.p2 = xyRadius(this.info.cx, this.info.cy, this.info.o_rad, point.deg_from);
					point.p3 = xyRadius(this.info.cx, this.info.cy, this.info.o_rad, point.deg_to);
					point.p4 = xyRadius(this.info.cx, this.info.cy, this.info.i_rad, point.deg_to);

					point.o_sweep = point.deg_to - point.deg_from > 180 ? '0 1,0' : '0 0,0';
					point.i_sweep = point.deg_to - point.deg_from > 180 ? '0 1,1' : '0 0,1';

					point.slice = document.createElementNS(svgNS, 'path');
					point.d = '';
					if (point.percent_decimal >= 1) {

						// two line hack for cicles
						point.p3a = xyRadius(this.info.cx, this.info.cy, this.info.o_rad, point.deg_to * 0.5);
						point.p1a = xyRadius(this.info.cx, this.info.cy, this.info.i_rad, point.deg_to * 0.5);

						point.d =
							'M' + point.p1.x + ',' + point.p1.y +
							' L' + point.p2.x + ',' + point.p2.y +
							' A' + this.info.o_rad + ',' + this.info.o_rad + ' ' + point.o_sweep + ' ' + point.p3a.x + ',' + point.p3a.y +
							' A' + this.info.o_rad + ',' + this.info.o_rad + ' ' + point.o_sweep + ' ' + point.p3.x + ',' + point.p3.y +
							' L' + point.p4.x + ',' + point.p4.y +
							' A' + this.info.i_rad + ',' + this.info.i_rad + ' ' + point.i_sweep + ' ' + point.p1a.x + ',' + point.p1a.y +
							' A' + this.info.i_rad + ',' + this.info.i_rad + ' ' + point.i_sweep + ' ' + point.p1.x + ',' + point.p1.y;
					} else {
						point.d =
							'M' + point.p1.x + ',' + point.p1.y +
							' L' + point.p2.x + ',' + point.p2.y +
							' A' + this.info.o_rad + ',' + this.info.o_rad + ' ' + point.o_sweep + ' ' + point.p3.x + ',' + point.p3.y +
							' L' + point.p4.x + ',' + point.p4.y +
							' A' + this.info.i_rad + ',' + this.info.i_rad + ' ' + point.i_sweep + ' ' + point.p1.x + ',' + point.p1.y;
					}
					point.slice.setAttribute('d', point.d);
					point.slice.setAttribute('class', cssPrefix + 'slice ' + cssPrefix + 'pe');
					point.slice.setAttribute('fill', point.color.hsla);
					point.slice.setAttribute('stroke-width', 1);
					point.slice.setAttribute('stroke', point.color.hsla);
					point.slice.setAttribute('data-point', point.id);
					point.hoverContent = (point.l || '') + ' ' + Math.round(point.v) + ' (' + Math.round(point.percent_series) + '%)';
					m.svg.appendChild(point.slice);

					point.legend = document.createElement('div');
					point.legendColor = document.createElement('span');
					point.legendColor.className = cssPrefix + 'legendColor';
					point.legendColor.style.backgroundColor = point.color.hsla;
					point.legend.appendChild(point.legendColor);
					point.legendText = document.createElement('span');
					point.legendText.textContent = point.hoverContent;
					point.legend.appendChild(point.legendText);
					point.legend.className = cssPrefix + 'legend '+cssPrefix + 'pe';
					point.legend.setAttribute('data-point', point.id);
					point.legend.style.top = p * 20 + 'px';
					point.legend.style.left = '50%';
					m.node.appendChild(point.legend);

				},

				// generate the scale!
				generateScale = function() {

					m.scale = document.createElement('div');
					m.scale.className = cssPrefix + 'abs';
					m.chart.insertBefore(m.scale, m.chart.firstChild);

					if (typeof m.config.scale.steps != 'number') {
						m.config.scale.steps = 5;
					}
					if (m.config.scale.steps > 0) {
						var num, percent, range = (m.info.highest - m.info.lowest),
							step = (range / m.config.scale.steps),
							displayNum, line, text, w = 0, lines = [], texts = [];

						for (var i = 0; i < m.config.scale.steps+1; i++) {
							num = step * i;
							percent = num / range;
							displayNum = (num + m.info.lowest);
							line = document.createElement('div');
							line.className = cssPrefix + 'scaleLine';
							line.style.top = (100 - (percent * 100)) + '%';
							m.scale.appendChild(line);
							lines.push(line);

							text = document.createElement('span');
							text.textContent = displayNum;
							text.className = cssPrefix + 'scaleText';
							text.style.top = (100 - (percent * 100)) + '%';
							m.scale.appendChild(text);
							texts.push(text);
							if(text.offsetWidth > w){
								w = text.offsetWidth * 1;
							}

						}
						for (var i = 0; i < m.config.scale.steps+1; i++) {
							lines[i].style.left = (w + 4) + 'px';
							texts[i].style.width = w + 'px';
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
			m.chart.innerHTML = '<div style="padding-top:' + (config.ratio * 100) + '%;pointer-events:none"></div>';
			m.chart.style.cssText = objectCSS({
				position: 'relative',
				display: 'inline-block',
				'box-sizing': 'border-box',
				width: '100%',
				'max-width': '100%',
				height: config.height + 'px'
			});
			shadowDom.appendChild(m.chart);

			m.svg = document.createElementNS(svgNS, 'svg');
			m.svg.setAttribute('viewBox', '0 0 100 ' + (100 * m.config.ratio));
			m.svg.setAttribute('width', '100%');
			m.svg.setAttribute('height', '100%');
			//m.svg.setAttribute('preserveAspectRatio', 'none');
			m.svg.setAttribute('class', cssPrefix + 'abs');
			m.chart.appendChild(m.svg);
			//m.svg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#icon-' + name);
			m.filter = document.createElementNS(svgNS, 'filter');
			m.filter.id = cssPrefix + 'material-shadow-1';
			m.filter.innerHTML = '<feGaussianBlur in="SourceAlpha" stdDeviation="0.5"/><feOffset dx="0" dy="0" result="offsetblur"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>';
			m.svg.appendChild(m.filter);

			m.node = document.createElement('div');
			m.node.className = cssPrefix + 'abs';
			m.chart.appendChild(m.node);

			// ok so we're going to put this div on the window so we can still get calculations of sizes of things
			// we'll hide it so that it isn't available until the user appends it somewhere. This should not require paints.

			shadowDom.style.opacity = 0;
			shadowDom.style.position = 'absolute';
			shadowDom.style.left = -10000 + 'px';
			document.body.appendChild(shadowDom);

			if (m.data) {
				m.data.forEach(gatherInfo1, m);
				m.data.forEach(gatherInfo2, m);

				var generatorFunc = generateBars;
				if (config.type1 === 'l') {
					generatorFunc = generateLines;
				} else if (config.type1 === 'p' || config.type1 === 'd') {
					generatorFunc = generateSlices;
				}
				m.data.forEach(generatorFunc, m);

			}

			m.chart.addEventListener('mouseover', m.hover);
			m.chart.addEventListener('mouseout', m.hover);
			if (config.scale && (config.type1 === 'l' || config.type1 === 'b')) {
				generateScale();
			}

			setStyleSheet();
			return m;
		};

	// *could* be used in a server-side dom situation but I doubt it. Just throwing it here in case
	// it is to be modularized in the future somehow
	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
		module.exports = mimaCharts;
	} else {
		window.mimaCharts = mimaChart;
	}

})();
