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
		safeText = function(text) {
			var t = document.createElement('span');
			t.innerText = text || '';
			return t.innerHTML;
		},
		raf = function(func, delay) {
			return delay ? setTimeout(function() {
				raf(func, false)
			}, delay) : window.requestAnimationFrame(func) || setTimeout(function() {
				func()
			}, 1000 / 60);
		},

		// svg name space for convenience
		svgNS = 'http://www.w3.org/2000/svg',
		//xlinkNS = 'http://www.w3.org/1999/xlink',

		// constants for convenience
		materialShadow1 = '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
		materialShadow2 = '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
		materialTransition1 = 'cubic-bezier(.25,.8,.25,1)',
		icons = {
			'close': '<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>',
			'chart-bar': '<path d="M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z" />',
			'chart-pie': '<path d="M21,11H13V3A8,8 0 0,1 21,11M19,13C19,15.78 17.58,18.23 15.43,19.67L11.58,13H19M11,21C8.22,21 5.77,19.58 4.33,17.43L10.82,13.68L14.56,20.17C13.5,20.7 12.28,21 11,21M3,13A8,8 0 0,1 11,5V12.42L3.83,16.56C3.3,15.5 3,14.28 3,13Z" />',
			'chart-donut': '<path d="M16.18,19.6L14.17,16.12C15.15,15.4 15.83,14.28 15.97,13H20C19.83,15.76 18.35,18.16 16.18,19.6M13,7.03V3C17.3,3.26 20.74,6.7 21,11H16.97C16.74,8.91 15.09,7.26 13,7.03M7,12.5C7,13.14 7.13,13.75 7.38,14.3L3.9,16.31C3.32,15.16 3,13.87 3,12.5C3,7.97 6.54,4.27 11,4V8.03C8.75,8.28 7,10.18 7,12.5M11.5,21C8.53,21 5.92,19.5 4.4,17.18L7.88,15.17C8.7,16.28 10,17 11.5,17C12.14,17 12.75,16.87 13.3,16.62L15.31,20.1C14.16,20.68 12.87,21 11.5,21Z" />',
			'chart-line': '<path d="M16,11.78L20.24,4.45L21.97,5.45L16.74,14.5L10.23,10.75L5.46,19H22V21H2V3H4V17.54L9.5,8L16,11.78Z" />',
			'checkbox-blank-outline': '<path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z" />',
			'checkbox-marked-outline': '<path d="M19,19H5V5H15V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V11H19M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z" />',
			'settings': '<path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />'
		},
		getIcon = function(ops) {
			var icon = '<svg viewBox="0 0 24 24" height="' + (ops.s || 24) + '" width="' + (ops.s || 24) + '" fill="' + (ops.fill || '#000') + '" xmlns="http://www.w3.org/2000/svg">' + icons[ops.i || 'chart-bar'] + '</svg>';
			if (ops.uri) {
				return 'url(\'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(icon) + '\')';
			} else {
				return icon;
			}
		},
		// all classes will start with this prefix, we threw it into a variable to make changing it easier
		cssPrefix = '_mima_',

		shadowDom = document.createElement('div'),

		sortValues = function(a, b) {
			return a.v !== b.b ? b.v - a.v : 0;
		},

		// adds if not already set a stylesheet to the document
		setStyleSheet = function() {
			if (!document.getElementById(cssPrefix + 'sheet')) {
				var style = document.createElement('style'),
					bouncy = 'cubic-bezier(0.25, 0.25, 0.65, 2.57)';
				style.id = cssPrefix + 'sheet';
				style.appendChild(document.createTextNode('\
				.' + cssPrefix + 'abs{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none}\
				.' + cssPrefix + 'sq:before{content:"";display:block;padding-top: 100%;}\
				.' + cssPrefix + 'dot{position:absolute;margin:-1.5% 0 0 -1.5%;border-radius:50%;width:3%}\
				.' + cssPrefix + 'pe{pointer-events: all}\
				.' + cssPrefix + 'pe{pointer-events: all}\
				.' + cssPrefix + 'ellipsis{text-overflow: ellipsis; max-width: 100%; white-space: nowrap; overflow: hidden;}\
				.' + cssPrefix + 'ibb{display:inline-block; box-sizing:border-box; vertical-align:middle}\
				.' + cssPrefix + 'slice,.' + cssPrefix + 'bar,.' + cssPrefix + 'dot{transition: transform 0.15s ' + bouncy + ', filter 0.15s ' + bouncy + '; transform: translate3d(0,0,0); transform-origin: 50% 50%; }\
				.' + cssPrefix + 'bar{transform-origin: 50% 100%;}\
				.' + cssPrefix + 'hoverContainer{z-index:99;pointer-events:none;position:absolute;left:0;top:0; font-size: 12px; border-radius:3px; color:#fff; padding:8px; background-color:#616161;transition: left 0.15s ease-out, top 0.15s ease-out, opacity 0.15s ease-out;}\
				.' + cssPrefix + 'hoverContainer:before{content: ""; display:block; width:0; height:0; position: absolute; left:50%; bottom:-11px; margin-left:-6px; border: 6px solid transparent; border-top:6px solid #616161;}\
				.' + cssPrefix + 'scaleLine{position: absolute; top: 0; left: 0; right: 0; height: 1px; background-color: #ccc; }\
				.' + cssPrefix + 'scaleText{display: inline-block; position: absolute; top: 0; left: 0; font-size: 12px; color: #999; line-height: 10%; text-align:right; }\
				.' + cssPrefix + 'legend{font-size: 12px; color: #666; padding: 2px; transition: opacity 0.15s ease-in-out}\
				.' + cssPrefix + 'legend span{display: inline-block; vertical-align:middle; pointer-events:none; }\
				.' + cssPrefix + 'legendColor{ border-radius: 50%; width: 8px; height: 8px; margin-right: 4px; transform: width 0.15s ' + bouncy + ', height 0.15s ' + bouncy + '; }\
				.' + cssPrefix + 'settingsButton{ position:absolute; left:0; top:0; width:32px; height:32px; text-align:center; border-radius:50%; opacity: 0; transition: opacity 0.15s ease-in-out, box-shadow 0.15s ease-in-out, width 0.15s ease-in-out, height 0.15s ease-in-out, border-radius 0.15s ease-in-out; cursor: pointer; }\
				mimachart:hover .' + cssPrefix + 'settingsButton{ opacity: 1;  box-shadow: ' + materialShadow1 + ' }\
				.' + cssPrefix + 'settingsButton:before{ content:""; display:inline-block; vertical-align:middle; width:20px; height:20px; background-size:cover; background-image:' + getIcon({
					i: 'settings',
					fill: '#000',
					uri: true
				}) + ' }\
				.' + cssPrefix + 'settingsButton:after{ content:""; display:inline-block; vertical-align:middle; height:100%; }\
				mimachart.' + cssPrefix + 'settingsButton:hover{ box-shadow:' + materialShadow2 + ' }\
				.' + cssPrefix + 'settings{ display:none; opacity:0; transition: opacity 0.15s ease-in }\
				mimachart[data-settings-open="1"] .' + cssPrefix + 'settings{ display:block; background-color:#fff; pointer-events:fill; overflow-x: hidden; overflow-y: auto; opacity:1}\
				mimachart[data-settings-open="1"] .' + cssPrefix + 'settingsButton{ box-shadow:none }\
				mimachart[data-settings-open="1"] .' + cssPrefix + 'settingsButton:before{ content:""; display:inline-block; vertical-align:middle; width:20px; height:20px; background-size:cover; background-image:' + getIcon({
					i: 'close',
					fill: '#000',
					uri: true
				}) + ' }\
				.' + cssPrefix + 'grow{ position: absolute; left: 16px; top: 16px; background-color:#fff; border-radius:50%; box-shadow: ' + materialShadow1 + '; transform: translate3d(-50%, -50%, 0) scale(0); transition: transform 0.5s ' + materialTransition1 + '; transform-origin: 50% 50%;}\
				.' + cssPrefix + 'filter{ display:block; font-size:12px; white-space:nowrap; }\
				.' + cssPrefix + 'checkbox{ position:relative }\
				mimachart input[type="checkbox"]{ margin:0 4px 0 0; outline: 0 }\
				mimachart input[type="checkbox"]:before{ content: ""; display:inline-block; width:14px; height:14px; background-size:contain; background:' + getIcon({
					i: 'checkbox-blank-outline',
					s: 14,
					fill: '#000',
					uri: true
				}) + ' no-repeat center white }\
				mimachart input[type="checkbox"]:checked:before{ background:' + getIcon({
					i: 'checkbox-marked-outline',
					s: 14,
					fill: '#000',
					uri: true
				}) + ' no-repeat center white }\
				.' + cssPrefix + 'selectChart span{ margin-left:4px; font-size:14px; text-transform: capitalize; pointer-events:none }\
				.' + cssPrefix + 'selectChart i{ pointer-events:none }\
				.' + cssPrefix + 'selectChart button{ margin-top:4px; cursor: pointer; display:block; border:0; background:none; opacity:0.5 }\
				.' + cssPrefix + 'selectChart button[data-selected="1"]{ opacity: 1 }\
				'));
				document.head.appendChild(style);
			}
		},

		xyRadius = function(cx, cy, radius, degrees) {
			//lets have zero be at the top and go clockwise
			//degrees += Math.PI * 2
			return {
				x: cx + radius * Math.sin(degrees * Math.PI / 180),
				y: cy + radius * Math.cos(degrees * Math.PI / 180)
			};
		},

		// these are just the hue values of the css colors for hsla() after these it's dynamically set
		baseColors = [207, 4, 54, 88, 16, 291, 17, 262, 122, 45, 231, 66, 36, 199, 187, 340, 14, 200],

		// the default configuration passed into mimaChart() for the config parameter
		defaults = {
			type: 'donut',
			scale: {},
			ratio: 0.5
		},

		// this is the function exposed
		mimaChart = function(config, data) {

			if (!window.__mimaEvents) {
				window.__mimaData = {
					atomic: 0,
					listeners: {}
				}
				window.__mimaEvents = function(e) {
					if (typeof e.target.__mimaIndex !== 'undefined') {
						window.__mimaData.listeners[e.target.__mimaIndex](e);
					}
				}
				window.addEventListener('mouseover', window.__mimaEvents);
				window.addEventListener('mousemove', window.__mimaEvents);
				window.addEventListener('mouseout', window.__mimaEvents);
				window.addEventListener('click', window.__mimaEvents);
			}

			// alows us to accept just data and use default config
			data = typeof data !== 'object' ? config : data;
			data = typeof data !== 'object' ? [] : data;
			config = typeof config !== 'object' ? {} : config;
			if (config.data) {
				data = config.data
			}

			var k,
				m = {
					config: config,
					data: data,
					dataref: {},
					points: [],
					series: 0,
					getColorValue: function(color) {
						return 'hsla(' + color.h + ',' + color.s + ',' + color.l + ',' + color.a + ')';
					},
					getColor: function(obj, i, len, parent) {
						if (!obj.c) {
							var color = {
								h: 0,
								s: '100%',
								l: '60%',
								a: 1
							};
							if (parent) {
								var div = (50 / len);
								color.h = parent.h;
								color.l = 24 + Math.round((div * 0.5) + (div * i)) + '%';
							} else {
								if (len < baseColors.length) {
									color.h = baseColors[i];
								} else {
									var div = (360 / len);
									color.h = Math.round((div * 0.5) + (div * i));
								}
							}
							color.value = m.getColorValue(color);
						} else {
							var color = {
								value: obj.c
							};
						}
						return color;
					},
					killHover: function(e) {
						m.currentHover = window.__mimaData.currentHover;
						if (m.currentHover) {
							m.currentHover.style.opacity = 0;
							m.currentHover.delayHide = setTimeout(function() {
								m.currentHover.display = '';
							}, 200);

							var point = m.currentHover.point;

							if (point) {

								point.showing = false;

								if (point.slice) {
									point.slice.style.transform = 'translate3d(0, 0, 0) scale(1)';
									if (point.percent_decimal < 1) {
										point.slice.setAttribute('stroke', '#fff');
									}
									point.slice.setAttribute('filter', '');
									point.legend.style.opacity = '';
									point.legend.style.fontWeight = '';
									[].slice.call(m.chart.getElementsByClassName(cssPrefix + 'legend')).forEach(function(el) {
										el.style.opacity = 1;
									});
									point.legendColor.style.width = '';
									point.legendColor.style.height = '';
									point.legendColor.style.pointerEvents = 'fill'
									point.legendColor.style.transform = 'translate3d(0, 0 , 0)';
								}
								if (point.bar) {
									point.bar.style.transform = 'scale(1)';
									point.bar.boxShadow = '';
								}
								if (point.dot) {
									point.dot.style.transform = 'scale(1)';
								}
								if (point.line) {
									point.line.style.transform = 'scale(1)';
									point.line.setAttribute('filter', '');
								}
							}

						}
					},

					hover: function(e) {
						clearTimeout(window.__mimaData.hoverTimer);
						window.__mimaData.hoverTimer = setTimeout(function() {

							var point = m.dataref[e.target.__mimaPoint],
								show = e.type === 'mouseover' || e.type === 'mousemove' || e.type === 'click';

							if (point && show) {
								if (e.type === 'click' && point.onclick) {
									point.onclick(e);
									return;
								}
								if (!point.showing) {

									m.killHover(e);

									point.showing = true;

									var x = (e.pageX),
										y = (e.pageY);

									if (!m.currentHover) {
										m.currentHover = document.createElement('div');
										m.currentHover.className = cssPrefix + 'hoverContainer';
										document.body.appendChild(m.currentHover);
									} else {
										m.currentHover.style.display = '';
										m.currentHover.style.opacity = 1;
										clearTimeout(m.currentHover.delayHide);
									}

									m.currentHover.point = point;
									window.__mimaData.currentHover = m.currentHover;

									if (point.slice) {
										point.slice.parentNode.appendChild(point.slice);
										point.slice.setAttribute('stroke', point.color.value);
										setTimeout(function() {
											point.slice.style.transform = 'translate3d(0, 0, 0) scale(1.05)';
										}, 10);

										point.slice.setAttribute('filter', 'url(#' + cssPrefix + 'material-shadow-1)');
										if (m.legend) {
											m.legend.scrollTop = point.legend.offsetTop;
										}
										[].slice.call(m.chart.getElementsByClassName(cssPrefix + 'legend')).forEach(function(el) {
											if (el != point.legend) {
												el.style.opacity = 0.5;
											}
										});
										point.legend.style.opacity = 1;
										point.legendColor.style.width = '12px';
										point.legendColor.style.height = '12px';
										point.legendColor.style.transform = 'translate3d(-2px, 0 , 0)';
									}
									if (point.bar) {
										point.bar.style.transform = 'translate3d(0, 0, 0) scale(1.05)';
										point.bar.style.boxShadow = materialShadow1;
									}
									if (point.dot) {
										point.dot.style.transform = 'scale(1.2)';
									}

									if (!point.hoverContent) {
										show = false;
									} else {
										m.currentHover.innerHTML = point.hoverContent || '';
									}

									if (point.hoverAnchor) {
										m.currentHover.style.opacity = 0;
										point.hoverAnchor.box = point.hoverAnchor.node.getBoundingClientRect();
										var st = (document.body.scrollTop || document.documentElement.scrollTop),
											sl = (document.body.scrollLeft || document.documentElement.scrollLeft),
											ox = 0,
											x = (point.hoverAnchor.box.left + sl + (point.hoverAnchor.box.width * 0.5)),
											y = (point.hoverAnchor.box.top + st);

										y -= 10;

										if (x < 0) {
											x = 0;
										}
										m.currentHover.style.left = x + 'px';
										m.currentHover.style.top = y + 'px';

										setTimeout(function() {
											ox = (m.currentHover.offsetWidth * 0.5);
											if (x - ox < 10) {
												ox = (ox - (ox - x)) - 10;
											}
											m.currentHover.style.transform = 'translate3d(-' + ox + 'px, -' + m.currentHover.offsetHeight + 'px, 0)';
											m.currentHover.style.opacity = 1;
										}, 10);
									}

								}
							} else {
								m.killHover(e);
							}

						}, 4);
					}
				},

				setPointEvents = function(m, node, point) {
					node.__mimaPoint = point.id;
					node.__mimaIndex = m.__mimaIndex;
				},

				// simplify the initialization of the info setting for the top level and each data segment
				initInfo = function(point, level) {
					point.info = {
						level: level,
						lowest: config.scale.lowest === 'auto' ? undefined : config.scale.lowest || 0,
						highest: config.scale.highest,
						sum: 0,
						average: 0,
						cx: 25,
						cy: 25,
						o_rad: 22,
						i_rad: 17
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
					if (point.disabled) {
						if (typeof point._v === 'undefined') {
							point._v = point.v;
						}
						point.v = 0;
					} else if (point.disabled === false) {
						point.v = point._v;
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

					if (!point.l && config.defaultLabel) {
						point.l = config.defaultLabel;
					}

					if (config.onclick) {
						point.onclick = function onclickPoint(e) {
							if (typeof config.onclick === 'function') {
								config.onclick(e, point, m);
							} else if (typeof config.onclick === 'string') {
								if (typeof window[config.onclick] === 'function') {
									window[config.onclick](e, point, m);
								} else {
									console.error('could not find function ' + config.onclick + ' in global/window');
								}
							} else {
								console.error('invalid click type', config.onclick);
							}
						}
					};
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
					info.color = m.getColor(info, info.seriesIndex, ar.length, false);

					m.series++;
				},

				// bar chart bars
				generateBars = function(point, p, ar) {
					point.color = m.getColor(point, p, ar.length, this.color ? this.color : false);

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

						if (m.firstRender) {
							m.points.push(point);
						}

						if (point.disabled) {
							return false;
						}

						// this generates bars within the parent item only for the lowest level of data available
						point.bar = document.createElement('div');
						point.hoverAnchor = {
							node: point.bar
						};
						point.bar.className = cssPrefix + 'bar ' + cssPrefix + 'pe';
						point.bar.style.cssText = objectCSS({
							position: 'absolute',
							'background-color': point.color.value,
							bottom: 0,
							width: '100%',
							'min-height': '1px',
							height: point.percent_scale + '%'
						});
						setPointEvents(m, point.bar, point);
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

						if (m.firstRender) {
							m.points.push(point);
						}

						if (point.disabled) {
							return false;
						}

						// color is same for series and comes from the parent
						point.color = this.info.color;

						point.dot = document.createElement('span');
						point.dot.className = cssPrefix + 'dot ' + cssPrefix + 'sq ' + cssPrefix + 'pe';

						point.hoverAnchor = {
							node: point.dot
						};
						var x = (this.info.gap * (p + 1)) + (((100 - this.info.gap_less) / ar.length) * p),
							y = 100 - point.percent_scale;

						point.dot.style.cssText = objectCSS({
							left: x + '%',
							top: y + '%',
							'background-color': point.color.value
						});
						setPointEvents(m, point.dot, point);
						m.node.appendChild(point.dot);

						if (p > 0) {
							point.line = document.createElementNS(svgNS, 'path');
							point.line.setAttribute('class', cssPrefix + 'pe');
							setPointEvents(m, point.line, point);
							point.line.setAttribute('d', 'M' + this.info.lastPoint.x + ',' + (this.info.lastPoint.y * m.config.ratio) + ' ' + x + ',' + (y * m.config.ratio));
							point.line.setAttribute('stroke', point.color.value);
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

					if (m.firstRender) {
						m.points.push(point);
					}

					if (point.disabled) {
						return false;
					}

					point.color = m.getColor(point, p, ar.length, this.color ? this.color : false);

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
					point.hoverAnchor = {
						node: point.slice
					};
					point.d = '';
					if (point.percent_decimal >= 1) {

						// two line hack for cicles
						point.p3a = xyRadius(this.info.cx, this.info.cy, this.info.o_rad, point.deg_to * 0.5);
						point.p1a = xyRadius(this.info.cx, this.info.cy, this.info.i_rad, point.deg_to * 0.5);

						point.d = 'M' + point.p1.x + ',' + point.p1.y +
							' L' + point.p2.x + ',' + point.p2.y +
							' A' + this.info.o_rad + ',' + this.info.o_rad + ' ' + point.o_sweep + ' ' + point.p3a.x + ',' + point.p3a.y +
							' A' + this.info.o_rad + ',' + this.info.o_rad + ' ' + point.o_sweep + ' ' + point.p3.x + ',' + point.p3.y +
							' L' + point.p4.x + ',' + point.p4.y +
							' A' + this.info.i_rad + ',' + this.info.i_rad + ' ' + point.i_sweep + ' ' + point.p1a.x + ',' + point.p1a.y +
							' A' + this.info.i_rad + ',' + this.info.i_rad + ' ' + point.i_sweep + ' ' + point.p1.x + ',' + point.p1.y;
					} else {
						if (config.type1 !== 'd') {
							point.d = 'M' + this.info.cx + ',' + this.info.cy +
								' L' + point.p2.x + ',' + point.p2.y +
								' A' + this.info.o_rad + ',' + this.info.o_rad + ' ' + point.o_sweep + ' ' + point.p3.x + ',' + point.p3.y + 'Z';
						} else {
							point.d = 'M' + point.p1.x + ',' + point.p1.y +
								' L' + point.p2.x + ',' + point.p2.y +
								' A' + this.info.o_rad + ',' + this.info.o_rad + ' ' + point.o_sweep + ' ' + point.p3.x + ',' + point.p3.y +
								' L' + point.p4.x + ',' + point.p4.y +
								' A' + this.info.i_rad + ',' + this.info.i_rad + ' ' + point.i_sweep + ' ' + point.p1.x + ',' + point.p1.y;
						}
					}
					point.slice.setAttribute('d', point.d);
					point.slice.setAttribute('class', cssPrefix + 'slice ' + cssPrefix + 'pe');
					point.slice.setAttribute('fill', point.color.value);
					if (point.percent_decimal < 1) {
						point.slice.setAttribute('stroke', '#fff');
					}
					point.slice.setAttribute('stroke-width', 0.2);
					setPointEvents(m, point.slice, point);
					point.hoverContent = (point.l || '') + ' ' + Math.round(point.v) + ' (' + Math.round(point.percent_series) + '%)';
					m.svg.appendChild(point.slice);

					point.legend = document.createElement('div');
					point.legendColor = document.createElement('span');
					point.legendColor.className = cssPrefix + 'legendColor';
					point.legendColor.style.border = '2px solid ' + point.color.value;
					if (config.type1 === 'p') {
						point.legendColor.style.backgroundColor = point.color.value;
					}

					point.legend.appendChild(point.legendColor);
					point.legendText = document.createElement('span');
					point.legendText.className = cssPrefix + 'ellipsis';
					point.legendText.textContent = (point.l || '');
					point.legend.appendChild(point.legendText);
					point.legendValue = document.createElement('span');
					point.legendValue.textContent = Math.round(point.v) + ' (' + Math.round(point.percent_series) + '%)';
					point.legendValue.style.float = 'right';
					point.legend.appendChild(point.legendValue);
					point.legend.className = cssPrefix + 'legend ' + cssPrefix + 'pe';
					setPointEvents(m, point.legend, point);
					m.legend.appendChild(point.legend);

					point.legendMinus = 36 + point.legendValue.offsetWidth;
					point.legendText.style.maxWidth = 'calc(100% - ' + point.legendMinus + 'px)';

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
						var num, percent,
							range = (m.info.highest - m.info.lowest),
							step = (range / m.config.scale.steps),
							displayNum, line, text,
							w = 0,
							lines = [],
							texts = [];

						for (var i = 0; i < m.config.scale.steps + 1; i++) {
							num = step * i;
							percent = num / range;
							displayNum = Math.round( (num + m.info.lowest) * 100) / 100;
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
							if (text.offsetWidth > w) {
								w = text.offsetWidth * 1;
							}

						}
						for (var i = 0; i < m.config.scale.steps + 1; i++) {
							lines[i].style.left = (w + 4) + 'px';
							texts[i].style.width = w + 'px';
						}

					}
				},

				// setup the legend depending on the chart type
				initLegend = function() {
					if (config.type1 === 'p' || config.type1 === 'd') {
						m.legendHolder = document.createElement('div');
						m.legendHolder.style.cssText = objectCSS({
							position: 'absolute',
							top: 0,
							bottom: 0,
							left: '50%',
							width: '50%',
							overflow: 'hidden'
						});
						m.legend = document.createElement('div');
						m.legend.style.cssText = objectCSS({
							position: 'absolute',
							'overflow-x': 'hidden',
							height: '100%',
							left: 0,
							right: 0,
							'overflow-y': 'scroll'
						});
						m.legendHolder.appendChild(m.legend);
						m.node.appendChild(m.legendHolder);

						var checkWidth = function() {
							var r = '-' + (m.legend.offsetWidth - m.legend.clientWidth) + 'px';
							if (m.legend.style.right !== r) {
								m.legend.style.right = r;
							}
						};
						checkWidth();
						setTimeout(checkWidth, 10);

					}
				},

				displaySettings = function(e) {
					m.killHover(e);

					var uncheckall = 'checked',
						markup = '';

					m.points.forEach(function(point, p) {
						var chkd = 'checked';
						if (point.disabled) {
							uncheckall = '';
							chkd = '';
						}
						markup += '<label class="' + cssPrefix + 'filter" data-point="' + p + '">\
							<input type="checkbox" data-point="' + p + '" ' + chkd + ' />\
							<span class="' + cssPrefix + 'ibb ' + cssPrefix + 'ellipsis">' + safeText(point.l) + '</span>\
						</label>';
					});
					markup = '<label class="' + cssPrefix + 'filter">\
							<input type="checkbox" data-point="all" ' + uncheckall + ' />\
							<span class="' + cssPrefix + 'ibb ' + cssPrefix + 'ellipsis">all</span>\
						</label>' + markup;

					var chartOps = ['bar', 'pie', 'donut', 'line'];
					var chartMarkup = '';
					chartOps.forEach(function(type) {
						if (config.types ? config.types.indexOf(type) > -1 : true) {
							chartMarkup += '<button data-type="' + type + '" ' + (config.type === type ? 'data-selected="1"' : '') + '><i class="' + cssPrefix + 'ibb">' + getIcon({
								i: 'chart-' + type
							}) + '</i><span class="' + cssPrefix + 'ibb">' + type + '</span></button>';
						}
					});
					m.settings.innerHTML = '\
					<div style="white-space:nowrap">\
						<div class="' + cssPrefix + 'ibb ' + cssPrefix + 'selectChart" style="width:40%;padding:10px;vertical-align:top;margin-top:24px;">\
							' + chartMarkup + '\
						</div>\
						<div class="' + cssPrefix + 'ibb" style="width:60%;padding:10px;vertical-align:top;white-space:normal">' + markup + '</div>\
					</div>';

					m.settings.addEventListener('click', function(e) {
						if (e.target.nodeName === 'BUTTON') {
							[].slice.call(m.settings.getElementsByTagName('button')).forEach(function(button) {
								button.removeAttribute('data-selected')
							})
							e.target.setAttribute('data-selected', '1');
							config.type = e.target.getAttribute('data-type');
							m.renderChart();
						}
					});
					m.settings.addEventListener('change', function(e) {
						var gp = e.target.getAttribute('data-point');
						if (gp === 'all') {
							[].slice.call(m.settings.querySelectorAll('input')).forEach(function(cb, i) {
								cb.checked = e.target.checked;
								if (i > 0) {
									m.points[i - 1].disabled = !cb.checked;
								}
							})
						} else {
							m.points[gp].disabled = !e.target.checked
						}
						m.renderChart();
					});

				};

			for (k in defaults) {
				if (typeof config[k] === 'undefined') {
					m.config[k] = defaults[k];
				}
			}

			// ok so we're going to put this div on the window so we can still get calculations of sizes of things
			// we'll hide it so that it isn't available until the user appends it somewhere. This should not require paints.

			shadowDom.style.cssText = objectCSS({
				position: 'absolute',
				opacity: 0,
				left: -10000 + 'px'
			});
			document.body.appendChild(shadowDom);

			m.__mimaIndex = window.__mimaData.atomic * 1;
			window.__mimaData.atomic++;


			m.renderChart = function() {

				config.type1 = (config.type || '')[0] || '';
				if (config.type1 === 'b' || config.type1 === 'l') {
					config.ratio = 0.5;
				}

				initInfo(m, 0);

				if (!m.chart && !config.element) {
					m.chart = document.createElement('mimachart');
					shadowDom.appendChild(m.chart);
					config.element = m.chart;
				} else {
					if (m.settings) {
						m.settings.lastScrollH = m.settings.scrollTop;
						shadowDom.appendChild(m.settings);
						shadowDom.appendChild(m.settingsButton);
					}
					m.chart = config.element;
				}

				m.chart.innerHTML = '<div style="padding-top:' + (config.ratio * 100) + '%;pointer-events:none"></div>';
				m.chart.style.cssText = objectCSS({
					position: 'relative',
					display: 'inline-block',
					'box-sizing': 'border-box',
					width: '100%',
					'max-width': '100%',
					height: config.height + 'px'
				});

				m.svg = document.createElementNS(svgNS, 'svg');
				m.svg.setAttribute('viewBox', '0 0 100 ' + (100 * m.config.ratio));
				m.svg.setAttribute('width', '100%');
				m.svg.setAttribute('height', '100%');
				m.svg.setAttribute('class', cssPrefix + 'abs');
				m.chart.appendChild(m.svg);
				m.filter = document.createElementNS(svgNS, 'filter');
				m.filter.id = cssPrefix + 'material-shadow-1';
				m.filter.innerHTML = '<feGaussianBlur in="SourceAlpha" stdDeviation="0.5"/><feOffset dx="0" dy="0" result="offsetblur"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>';
				m.svg.appendChild(m.filter);

				m.node = document.createElement('div');
				m.node.className = cssPrefix + 'abs';
				m.chart.appendChild(m.node);

				if (!m.settings) {
					m.settings = document.createElement('div');
					m.settings.className = cssPrefix + 'abs ' + cssPrefix + 'settings';

					m.settingsButton = document.createElement('span');
					m.settingsButton.className = cssPrefix + 'settingsButton';
					m.settingsButton.addEventListener('click', function(e) {
						var growholder = document.createElement('div');
						growholder.className = cssPrefix + 'abs';
						growholder.style.overflow = 'hidden';
						var grow = document.createElement('div');
						grow.className = cssPrefix + 'grow';
						grow.style.width = (m.chart.clientWidth * 3) + 'px';
						grow.style.height = (m.chart.clientWidth * 3) + 'px';
						growholder.appendChild(grow);

						if (!m.chart.getAttribute('data-settings-open')) {
							raf(function() {
								m.settingsButton.style.boxShadow = 'none';
								grow.style.transform = 'translate3d(-50%, -50%, 0) scale(1)'
								raf(function() {
									displaySettings(e);
									m.chart.setAttribute('data-settings-open', '1');
									m.chart.removeChild(growholder);
									m.settingsButton.style.boxShadow = '';
								}, 310)
							})
						} else {
							grow.style.transform = 'translate3d(-50%, -50%, 0) scale(1)'
							m.chart.removeAttribute('data-settings-open');
							raf(function() {
								grow.style.transform = 'translate3d(-50%, -50%, 0) scale(0)'
								raf(function() {
									m.chart.removeChild(growholder);
								}, 310)
							}, 10)
						}
						m.chart.appendChild(growholder);
					})
					m.chart.appendChild(m.settingsButton);
				}
				m.chart.appendChild(m.settings);
				if (m.settings.lastScrollH) {
					m.settings.scrollTop = m.settings.lastScrollH
				};
				m.chart.appendChild(m.settingsButton);

				initLegend();

				if (m.data) {
					if (config.sort !== false) {
						typeof config.sort !== 'function' ? m.data.sort(sortValues) : m.data.sort(config.sort);
					}
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

				if (config.scale && (config.type1 === 'l' || config.type1 === 'b')) {
					generateScale();
				}

				m.firstRender = false;

			}

			m.firstRender = true;
			m.renderChart();

			m.chart.__mimaIndex = m.__mimaIndex;
			window.__mimaData.listeners[m.__mimaIndex] = m.hover;


			setStyleSheet();
			return m;
		};

	window.mimaCharts = mimaChart;
	// attaches mimachart to any <mimachart> html element using the innerText as the json config and any data-attribute values as additional config settings
	window.initMimaCharts = function(callback) {
		[].slice.call(document.getElementsByTagName('mimachart')).forEach(function(el) {
			if (!el.getAttribute('data-mima-init')) {

				var it = (el.querySelector('json') || {}).innerText || '',
					dat = {};
				if (it) {
					try {
						dat = JSON.parse(it) || {}
					} catch (e) {
						dat = {
							config: {}
						};
					}
				}
				if (!dat.config) {
					dat.config = {};
				}
				el.innerText = '';

				[].slice.call(el.attributes).forEach(function(attribute) {
					if (attribute.name.substr(0, 5) === 'data-') {
						try {
							dat.config[attribute.name.substr(5)] = JSON.parse(attribute.value);
						} catch (e) {
							dat.config[attribute.name.substr(5)] = attribute.value;
						}
					}
				});

				el.setAttribute('data-mima-init', '1');
				dat.config.element = el;
				el.mimachart = mimaChart(dat.config, dat.data)
			}
			if (callback) {
				callback(el.mimachart);
			}
		})
	}
	initMimaCharts()
})();