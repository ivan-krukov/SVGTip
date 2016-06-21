var SVGTip = function (options) {
  var getDefault = function (x, d) {
    return x === undefined ? d : x;
  };

  var content = getDefault(options.content, '');
  var style = getDefault(options.style, '');
  var parent = getDefault(options.parent, d3.select('svg'));
  var padding = getDefault(options.padding, 5);
  var tipSize = getDefault(options.tipSize, 5);

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
        var c = ((typeof content === 'function') ? content(d, i) : content);
        var s = ((typeof style === 'function') ? style(d, i) : style);
        tooltip.text.html(c).style(s);
        tooltip.attr('transform', translate(point));
        var bbox = tooltip.text.node().getBBox();
        tooltip.box.attr('points', polygon({
          x: 0,
          y: 0
        }, bbox, tipSize));
        tooltip.text.attr({
          y: -(bbox.height + (padding * 2)) / 2,
          x: 0
        });
      });
  };
};

var main = function () {

  var randomPair = function (xRange, yRange) {
    return [Math.floor(Math.random() * xRange),
      Math.floor(Math.random() * yRange)
    ];
  };

  var width = 600,
    height = 600,
    padding = 50;

  var data = [];
  for (var i = 0; i < 10; i++) {
    data.push(randomPair(width, height));
  }
  data.push([width, height]);

  var svg = d3.select('body').append('svg')
    .attr({
      width: width + (2 * padding),
      height: height + (2 * padding)
    });

  var vis = svg.append('g')
    .attr({
      transform: 'translate(' + padding + ',' + padding + ')',
    });

  var points = vis.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', function (d) {
      return d[0];
    })
    .attr('cy', function (d) {
      return d[1];
    })
    .attr('r', 10)
    .attr('fill', 'blue')
    .call(SVGTip({
      content: function (d, i) {
        return d[0] + '; ' + d[1] + ' @ ' + i;
      },
      padding: 5
    }));

  var curveTip = SVGTip({
    content: function () {
      return d3.mouse(vis.node());
    },
    style: {
      'font-family': 'monospace',
      'font-size': 20
    },
    parent: svg,
    padding: 10
  });

  var curve = vis.append('g')
    .attr('transform', 'translate(550,50) rotate(60) scale(2)')
    .append('path')
    .attr('d', 'M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80')
    .attr('stroke', 'red')
    .attr('fill', 'none')
    .attr('stroke-width', 5)
    .call(curveTip);
};
