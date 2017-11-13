var charts = [{
	title: 'Line: Scale 10 to 50',
	config: {
		type: 'line',
		onclick: function(e, point) {
			console.log('clicked point', point);
		},
		types: ['line'],
		scale: {
			lowest: 10,
			highest: 50
		}
	},
	data: [{
		l: 'Mark 1',
		v: 10
	}, {
		l: 'Mark 2',
		v: 20
	}, {
		l: 'Mark 3',
		v: 15
	}]
}, {
	title: 'Bar Chart Label Depth',
	config: {
		type: 'bar',
		types: ['bar']
	},
	data: [{
		l: 'G 1',
		v: 10,
		data: [{
			l: 'G 1-1',
			v: 10,
			data: [{
				l: 'G 1-1-1',
				v: 10,
				data: [{
					l: 'G 1-1-1-1',
					v: 10
				}, {
					l: 'G 1-1-1-2',
					v: 10
				}, {
					l: 'G 1-1-1-3',
					v: 10
				}]
			}, {
				l: 'G 1-1-2',
				v: 10
			}, {
				l: 'G 1-1-3',
				v: 10
			}]
		}, {
			l: 'G 1-2',
			v: 10
		}, {
			l: 'G 1-3',
			v: 10
		}]
	}]
}, {
	title: 'Multi Line',
	config: {
		type: 'line',
		defaultLabel: 'No Label',
		types: ['bar', 'line'],
		onclick: function(e, point) {
			console.log('clicked point', point);
		}
	},
	data: [{
		v: 0,
		l: 'Segment 1',
		data: [{
			v: 0
		}, {
			v: 0
		}, {
			v: 0
		}, {
			v: 0
		}]
	}, {
		v: 1,
		l: 'Segment 2',
		data: [{
			v: 1
		}, {
			v: 1
		}, {
			v: 1
		}, {
			v: 1
		}]
	}, {
		v: 5,
		l: 'Segment 3',
		data: [{
			v: 5
		}, {
			v: 4
		}, {
			v: 3
		}, {
			v: 4
		}]
	}, {
		v: 2.45343,
		l: 'Segment 4',
		data: [{
			v: 5
		}, {
			v: 2.45343
		}, {
			v: 2.3
		}, {
			v: 2.5
		}]
	}]
}, {
	title: 'Bar',
	config: {
		type: 'bar',
		onclick: function(e, point) {
			console.log('clicked point', point);
		}
	},
	data: [{
		v: 1,
		l: 'First Item'
	}, {
		v: 1,
		l: 'Second Item'
	}, {
		v: 5,
		l: 'Third Item'
	}, {
		v: 2.45343,
		l: 'Fourth Item'
	}]
}, {
	title: 'Multi-Bar',
	config: {
		type: 'bar',
		onclick: function(e, point) {
			console.log('clicked point', point);
		}
	},
	data: [{
		v: 0,
		data: [{
			v: 11.234
		}, {
			v: 10.74343
		}]
	}, {
		v: 1,
		data: [{
			v: 1
		}, {
			v: 0.0005343
		}]
	}, {
		v: 14.234235324,
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
		type: 'pie',
		onclick: function(e, point) {
			console.log('clicked point', point);
		},
	},
	data: [{
		v: 10,
		l: 'Small Label'
	}, {
		v: 20,
		l: 'Very Long Label That Should Not Fit Very Well'
	}, {
		v: 15,
		l: 'Medium Sized Label May Fit'
	}, {
		v: Math.round(Math.random() * 20),
		l: 'Long List of Items 1'
	}, {
		v: Math.round(Math.random() * 20),
		l: 'Long List of Items 2'
	}, {
		v: Math.round(Math.random() * 20),
		l: 'Long List of Items 3'
	}, {
		v: Math.round(Math.random() * 20),
		l: 'Long List of Items 4'
	}, {
		v: Math.round(Math.random() * 20),
		l: 'Long List of Items 5'
	}, {
		v: Math.round(Math.random() * 20),
		l: 'Long List of Items 6'
	}, {
		v: Math.round(Math.random() * 20),
		l: 'Long List of Items 7'
	}, {
		v: Math.round(Math.random() * 20),
		l: 'Long List of Items 8'
	}, {
		v: Math.round(Math.random() * 20),
		l: 'Long List of Items 9'
	}, {
		v: Math.round(Math.random() * 20),
		l: 'Long List of Items 10'
	}, {
		v: Math.round(Math.random() * 20),
		l: 'Long List of Items 11'
	}, {
		v: Math.round(Math.random() * 20),
		l: 'Long List of Items 12'
	}]
}, {
	title: 'Donut',
	config: {
		type: 'donut',
		defaultLabel: 'No Label',
		onclick: function(e, point) {
			console.log('clicked point', point);
		}
	},
	data: [{
		v: 60
	}, {
		v: 20
	}, {
		v: 15
	}, {
		v: 15
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
}, {
	title: 'Pie Test 2',
	config: {
		type: 'pie'
	},
	data: [{
		v: 100
	}]
}, {
	title: 'Pie Test 3',
	config: {
		type: 'pie'
	},
	data: [{
		v: 100
	}, {
		v: 100
	}]
}, {
	title: 'Pie Test 4',
	config: {
		type: 'pie'
	},
	data: [{
		v: 10
	}, {
		v: 100
	}, {
		v: 100
	}, {
		v: 100
	}, {
		v: 100
	}]
}, {
	title: 'Pie Test 5',
	config: {
		type: 'pie'
	},
	data: [{
		v: 100
	}, {
		v: 10
	}, {
		v: 10
	}, {
		v: 10
	}, {
		v: 10
	}, {
		v: 10
	}, {
		v: 10
	}, {
		v: 10
	}]
}, {
	title: 'Pie Test 6',
	config: {
		type: 'pie'
	},
	data: [{
		v: 0.001
	}, {
		v: 99.999
	}, {
		v: 99.999
	}, {
		v: 99.999
	}, {
		v: 99.999
	}, {
		v: 99.999
	}, {
		v: 99.999
	}, {
		v: 99.999
	}, {
		v: 99.999
	}]
}];

var types = ['line', 'bar', 'donut', 'pie', 'dial'],
	words = ['Alfred', 'Barney', 'Chris', 'Daniel', 'Ethan', 'Franklin', 'Gregory', 'Heather'],
	customColors = ['red', 'blue', 'green', '#00cc00', 'orange', 'navy', 'pink'];

// two random charts
var config = sessionConfig(),
	genRandomDataSegment = function() {
		var data = [],
			numZeros = Math.random() * 10;

		for (var i = 0; i < Math.round(Math.random() * 10); i++) {
			var numWords = 1 + Math.floor(Math.random() * 8),
				word = '';
			for (var z = 0; z < numWords; z++) {
				if (word) {
					word += ' ';
				}
				word += words[Math.round(Math.random() * (words.length - 1))];
			}
			data.push({
				v: Math.round(Math.random() * 10) * numZeros,
				l: word,
				c: customColors[Math.round(Math.random() * (customColors.length - 1))]
			});
		}
		return data;
	},
	addDataSegment = function(item, level, maxLevels) {
		var data = genRandomDataSegment();
		item.data.forEach(function(point) {
			point.data = genRandomDataSegment();
			if (level < maxLevels) {
				addDataSegment(point, level + 1, maxLevels);
			}
		});
	};
for (var i = 0; i < 5; i++) {
	var dataItem = {
			title: 'Random ' + i,
			config: {
				type: types[Math.round(Math.random() * (types.length - 1))]
			},
			data: genRandomDataSegment()
		},
		levels = Math.round(Math.random() * 3);
	if (levels) {
		addDataSegment(dataItem, 1, levels);
	}
	charts.push(dataItem);
}

function genCharts() {
	[].slice.call(document.querySelectorAll('section')).forEach(function(sec, i) {
		if (i > 0) {
			sec.parentNode.removeChild(sec);
		}
	});
	charts.forEach(function(chart, i) {
		var isolated = i === config.isolateChart;
		if (isolated || typeof config.isolateChart === 'undefined') {
			if(isolated) {
				chart.config.maxHeight = 300;
			}
			var sec = document.createElement('section'),
				chartDOM = mimaCharts(chart.config, chart.data).chart;

			sec.style.display = config[chart.config.type] || typeof config[chart.config.type] === 'undefined' ? '' : 'none';


			var width = config['random sizes'] ? (200 + (400 * Math.random())) + 'px' : '400px';
			if(isolated){ width = '100%'; }
			sec.style.cssText = 'display:' + (config[chart.config.type] === false ? 'none' : 'inline-block') + ';box-sizing:border-box;vertical-align:top;width:' + width + ';max-width:100%;padding:0 1%';
			sec.innerHTML = '<h2 style="cursor:pointer">' + chart.title + '</h2>';

			sec.firstChild.addEventListener('click', function(e) {
				config.isolateChart = i;
				genCharts();
				sessionConfig(config);
			})

			sec.setAttribute('data-chart', chart.config.type);
			sec.appendChild(chartDOM);
			document.body.appendChild(sec);
		}
	});
	if (config.isolateChart === 'undefined') {
		document.body.appendChild(colorSec);
	}
}


var mimaInstance = mimaCharts(),
	colorSec = document.createElement('div');
[1, 2, 3, 5, 12, 18, 20, 100, 200, 600].forEach(function(num) {
	var colors = document.createElement('div');
	colors.innerHTML = '<div>' + num + ' colors</div>';
	for (var i = 0; i < num; i++) {
		var color = document.createElement('span'),
			getColor = mimaInstance.getColor({}, i, num);
		color.setAttribute('title', JSON.stringify(getColor));
		color.style.cssText = 'display:inline-block;box-sizing:border-box;width:20px;height:16px;margin:0 6px 6px 0;background-color:' + getColor.value;
		colors.appendChild(color);
	}
	colorSec.appendChild(colors);
});

genCharts();


['Line', 'Bar', 'Pie', 'Donut', 'Dial', 'Random Sizes'].forEach(function(chart) {
	var confChart = chart.toLowerCase();
	var label = document.createElement('label');
	label.style.display = 'inline-block';
	label.style.padding = '4px 4px 4px 0';
	var cb = document.createElement('input');
	cb.type = 'checkbox';
	cb.checked = config[confChart] === false ? false : true;
	cb.addEventListener('change', function(e) {
		config[confChart] = e.target.checked;
		var targs = [].slice.call(document.querySelectorAll('section[data-chart="' + confChart + '"]'));
		if (targs.length) {
			targs.forEach(function(sec) {
				sec.style.display = e.target.checked ? 'inline-block' : 'none';
			});
		} else {
			genCharts();
		}
		sessionConfig(config);
	});
	label.appendChild(cb);
	var sp = document.createElement('span');
	sp.textContent = chart;
	label.appendChild(sp);
	document.querySelector('section').appendChild(label);
});

var reAddCharts = document.createElement('a');
reAddCharts.textContent = 'Re-Gen Charts';
reAddCharts.href = '#';
reAddCharts.addEventListener('click', function(e) {
	delete config.isolateChart
	sessionConfig(config);
	e.preventDefault();
	genCharts();
});
document.querySelector('section').appendChild(reAddCharts);

function sessionConfig(set) {
	var conf = sessionStorage.getItem('mima-config');
	if (conf) {
		try {
			conf = JSON.parse(conf);
		} catch (e) {
			conf = {};
		}
	} else {
		conf = {};
	}
	if (set) {
		sessionStorage.setItem('mima-config', JSON.stringify(set));
	}
	return conf;
}