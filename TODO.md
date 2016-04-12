Charts:

Bar charts:
	Single
	Series - Stacked and/or multiple bars per segment
	Horizontal or Vertical
	range/segment (bars do not start at bottom)

Line Charts:
	Single line
	Multi-line
	line--straight/spline--curved/step--diagonal lines
	area/fill (fills in the bottom half with the line as the divider)
	scatter/bubble > lines do not connect and dots can be relatively sized

	range/area every point has a high/low value and you fill the segment

	spark line

Pie/Donut
	Singular / series support on hover or click?

Dial
	A legend/speedometer with 1 or multiple lines designating actual/projected performance
	flat / arch / more arch


Data:
```javascript
{
	type: "line" // line, bar, pie, dial
	settings: {

	},
	data: [
		{
			label: 'Jan 1, 2014', // or l
			value: 10, // or v
			upper_value: 12, // or uv
			lower_value: 8, // lv
			fill_color: 'red', // fc
			line_color: 'blue' // lc
		}
	]
}
```
