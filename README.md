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

mimaChart(config, data);
```

#### Config
``` javascript

type: 'line' // options are line, bar, pie, donut, dial. Default is donut

dataLevel: 2 // for line and bar charts, what level of data do you want to stop rendering at?

```
