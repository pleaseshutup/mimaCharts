var charts = [{
	title: 'Line. Scale 10 to 50',
	config: {
		type: 'line',
		scale: {
			lowest: 0,
			highest: 50
		}
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
		}, {
			v: 0
		}, {
			v: 0
		}]
	}, {
		v: 1,
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
		type: 'bar'
	},
	data: [{
		v: 0,
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
		type: 'donut'
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
	},{
		v: 100
	}]
}, {
	title: 'Pie Test 4',
	config: {
		type: 'pie'
	},
	data: [{
		v: 10
	},{
		v: 100
	},{
		v: 100
	},{
		v: 100
	},{
		v: 100
	}]
}, {
	title: 'Pie Test 5',
	config: {
		type: 'pie'
	},
	data: [{
		v: 100
	},{
		v: 10
	},{
		v: 10
	},{
		v: 10
	},{
		v: 10
	},{
		v: 10
	},{
		v: 10
	},{
		v: 10
	}]
}, {
	title: 'Pie Test 6',
	config: {
		type: 'pie'
	},
	data: [{
		v: 0.001
	},{
		v: 99.999
	},{
		v: 99.999
	},{
		v: 99.999
	},{
		v: 99.999
	},{
		v: 99.999
	},{
		v: 99.999
	},{
		v: 99.999
	},{
		v: 99.999
	}]
}];

var types = ['line','bar','donut','pie','dial'],
	words = ['Alfred', 'Barney', 'Chris', 'Daniel', 'Ethan', 'Franklin', 'Gregory', 'Heather'],
	customColors = ['red','blue','green','#00cc00', 'orange', 'navy', 'pink'];

// two random charts
var genRandomDataSegment = function(){
	var data = [],
		numZeros = Math.random() * 10;

	for(var i=0; i< Math.round(Math.random() * 10); i++){
		var numWords = 1 + Math.floor(Math.random() * 8),
		word = '';
		for(var z=0; z< numWords; z++){
			if(word){ word += ' '; }
			word += words[Math.round(Math.random()*(words.length-1))];
		}
		data.push({v: Math.round(Math.random() * 10) * numZeros, l: word, c: customColors[Math.round(Math.random()*(customColors.length-1))] });
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
		chartDOM = mimaCharts(chart.config, chart.data).chart;

	sec.style.cssText = 'display:inline-block;box-sizing:border-box;width:400px;max-width:100%;padding:0 1%';
	sec.innerHTML = '<h2>' + chart.title + '</h2>';
	sec.appendChild(chartDOM);
	document.body.appendChild(sec);
});

var mimaInstance = mimaCharts(),
	colorSec = document.createElement('div');
[1,2,3,5,12,18,20,100,200,600].forEach(function(num){
	var colors = document.createElement('div');
	colors.innerHTML = '<div>'+num+' colors</div>';
	for(var i=0; i<num;i++){
		var color = document.createElement('span'),
			getColor = mimaInstance.getColor({}, i, num);
		color.setAttribute('title', JSON.stringify(getColor));
		color.style.cssText = 'display:inline-block;box-sizing:border-box;width:20px;height:16px;margin:0 6px 6px 0;background-color:'+getColor.value;
		colors.appendChild(color);
	}
	colorSec.appendChild(colors);
});
document.body.appendChild(colorSec);
