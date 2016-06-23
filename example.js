var example = function () {

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
        return ['x: ' + d[0], 'y: ' + d[1], 'Index: ' + i];
      },
      padding: 0
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
