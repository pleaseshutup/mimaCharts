mimaCharts ia a minimal vanilla javascript library to provide extendable material design charts. mimaCharts is simply short for "minimal & material charts".

# [Try the demo](https://pleaseshutup.github.io/mimacharts/)

###### The guiding principles:
 - **Minimal:** vanilla javascript code to keep a tiny footprint so front-end sites can be as fast as possible.
 - **Material:** follow material design guidelines.
 - **Responsive:** Every chart can be used on a small phone, a small container on a large page or filling a television screen.
 - **Single Config:** A single & simple configuration for every possible chart so any chart can be changed into another chart (where appropriate).
 - **Interactive:** Charts can be a simple data visualization or integrated within an application to enable the user to change the chart config visually. Clicking into more detail or isolating a chart to expand and fill the screen with all available data/detail within reach.

### Usage Javascript
``` javascript
mimaChart({
    type: "donut",
    data: [{
        l: "slice", // "l" label
        v: 10, // "v" value
        c: undefined, //an html color value to force 
    }]
});

```

### Usage Web Component Style
**Only include the mimaCharts.min.js script once per page, include as many <mimachart> tags as you need.**
``` html
<mimachart><span style="display:inline-block;padding-top:50%"></span><span style="display:none">{ "type": "donut", data: [{"l":"slice","v":10}] }</span></mimachart>
<script src="mimaCharts.min.js"></script>
```

#### Config
``` javascript

type: 'line', // options are line, bar, pie, donut, dial. Default is donut
ratio: '', // force an aspect ratio for the chart. defaults to 2:1
maxHeight: 'none', // set a maximum height for the chart. defaults to none, obeys aspect ratio
format: '', // display values as regular numbers (blank), % or $
scale: {
    lowest: 0, // set the lowest value on the scale, default is zero, set to "auto" to be automatic
    highest: 100, // set the highest value on the scale, leave undefined for automatic
    steps: 10, // number of steps in the scale
    roundTo: 100, // round the scale to
    defaultLabel: '', // if no label or a blank label is provided use this default label instead
    sort: true, // sort by highest value set to "false" to use your own provided sorted order,
    types: ['bar', 'pie', 'donut', 'line'], // allowed chart types for the viewer to switch between. default is all
    parentLabels: true, // when hovering a point automatically add the parent names to the label
    parentLabelsSeparator: ', ', // sets the string that is used between labels for creating parent labels
},
sort: function(a, b){}, // custom sort function to use or a string to use a function in window
onclick: function(event, dataPoint, chart) {}, // define the custom click handler for when a data point is clicked,
onchange: function(changeType, config, chart) {}, // execute this function whenever a chart's config is changed
dataLevel: 2, // for line and bar charts, what level of data do you want to stop rendering at?
scaleLines: [ //an array of lines to overlay over a bar or line chart that plot with the vertical scale
    {
        l: 'line title',
        h: '1px', //line height
        v: 100, //value to plot at
    }
]

```
