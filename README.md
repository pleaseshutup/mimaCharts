mimaCharts ia a minimal vanilla javascript library to provide extendable material design charts. mimaCharts is simply short for "minimal & material charts".

###### The guiding principles:
 - **Minimal:** vanilla javascript code to keep a tiny footprint so front-end sites can be as fast as possible.
 - **Material:** follow material design guidelines.
 - **Responsive:** Assume every chart may be used in a table cell or television.
 - **Single Config:** A single & simple configuration for every possible chart so any chart can be changed into another chart (where appropriate).

### Usage

``` javascript
var config = {
    type: 'donut'
};
var data = [];

### Usage Web Component Style
``` html
<mimachart><span style="display:inline-block;padding-top:50%"></span><span style="display:none">{ "type": "donut", data: [{"l":"slice","v":10}] }</span></mimachart>
<script src="mimaCharts.min.js"></script>
```

#### Config
``` javascript

type: 'line' // options are line, bar, pie, donut, dial. Default is donut
scale: {
    lowest: 0, // set the lowest value on the scale, leave undefined for automatic
    highest: 100, // set the highest value on the scale, leave undefined for automatic
    steps: 10, // number of steps in the scale
    roundTo: 100, // round the scale to
    defaultLabel: '', // if no label or a blank label is provided use this default label instead
    sort: true, // sort by highest value set to "false" to use your own provided sorted order,
    types: ['bar', 'pie', 'donut', 'line'], // allowed chart types for the viewer to switch between. default is all
},
dataLevel: 2 // for line and bar charts, what level of data do you want to stop rendering at?

```
