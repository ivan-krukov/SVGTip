# SVGTip

A minimalistic SVG tooltip for d3

# Usage

[JSFiddle example](https://jsfiddle.net/d3184ea3/1)

```javascript
var svg = d3.select('body').append('svg')
  .attr({
    width: 600,
    height: 600
  })
  .append('g');

var vis = svg.append('g');

var tooltip = SVGTip({
  content: function(d, i) {
    return d3.mouse(vis.node());
  },
  style: {
    'font-size': 10
  },
  parent: svg
});

var curve = vis.append('g')
  .attr('transform', 'translate(200,50) rotate(60) scale(2)')
  .append('path')
  .attr('d', 'M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80')
  .attr('stroke', 'red')
  .attr('fill', 'none')
  .attr('stroke-width', 5)
  .call(tooltip);
```

See `example.js` for more examples.

# Parameters

| Argument   | Type               | Usage                           |
| ---------- | ------------------ | ------------------------------- |
| `content`  | Object or function | Tooltip text content            |
| `style`    | Object or function | Tooltip style properties        |
| `parent`   | DOM element        | Container of the tooltip        |
| `padding`  | Number             | Padding of the tooltip in `px`  |

# Multiple line tooltips

If `content` is an array, each element will be rendered as a line:

```javascript

```
