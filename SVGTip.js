var SVGTip = function (options) {
  var getDefault = function (x, d) {
    return x === undefined ? d : x;
  };

  var isArray = function (value) {
    return value &&
      typeof value === 'object' &&
      typeof value.length === 'number' &&
      typeof value.splice === 'function' &&
      !(value.propertyIsEnumerable('length'));
  };

  var polygon = function (coord, box, tip) {
    var x = coord.x;
    var y = coord.y;
    var width = box.width + (padding * 2);
    var height = box.height + (padding * 2);
    return [
      [x, y],
      [x + tip, y - tip],
      [x + (width / 2), y - tip],
      [x + (width / 2), y - tip - height],
      [x - (width / 2), y - tip - height],
      [x - (width / 2), y - tip],
      [x - tip, y - tip]
    ].map(function (x) {
      return x.join(',');
    }).join(' ');
  };

  var translate = function (coord) {
    return 'translate(' + coord[0] + ',' + coord[1] + ')';
  };

  var content = getDefault(options.content, '');
  var style = getDefault(options.style, '');
  var parent = getDefault(options.parent, d3.select('svg'));
  var padding = getDefault(options.padding, 5);
  var tipSize = 5;
  var lineHeight = 1.2;

  var tooltip = parent.append('g')
    .attr('class', 'svg-tooltip');

  tooltip.box = tooltip.append('polygon')
    .attr('class', 'box');
  tooltip.text = tooltip.append('text')
    .attr('class', 'text');

  var show = function () {
    tooltip.style('display', 'inline');
  };

  var hide = function () {
    tooltip.style('display', 'none');
  };

  return function (selection) {
    selection.on('mouseover', show)
      .on('mouseout', hide)
      .on('mousemove', function (d, i) {
        var point = d3.mouse(parent.node());

        tooltip.text.selectAll('tspan').remove();

        var lines = ((typeof content === 'function') ? content(d, i) : content);

        if (!isArray(lines)) {
          lines = [lines];
        }
          lines.forEach(function (line) {
            tooltip.text
              .append('tspan')
              .text(line)
              .attr({
                x: 0,
                dy: lineHeight + 'em'
              });
          });

        var s = ((typeof style === 'function') ? style(d, i) : style);
        tooltip.text.style(s);
        tooltip.attr('transform', translate(point));
        var bbox = tooltip.text.node().getBBox();
        tooltip.box.attr('points', polygon({
          x: 0,
          y: 0
        }, bbox, tipSize));
        tooltip.text.attr({
          y: -((lines.length + 1) * lineHeight) + 'em',
          x: 0
        });
      });
  };
};
