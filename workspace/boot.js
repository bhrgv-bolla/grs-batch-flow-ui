var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");
console.log("SVG, WIDTH, HEIGHT", svg, width, height);

//adds arrow definition at the end.
svg.append("defs").append("marker")
    .attr("id", "arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 10)
    .attr("refY", 0)
    .attr("markerWidth", 8)
    .attr("markerHeight", 8)
    .attr("orient", "auto")
  .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");

//Just a color scheme.
var color = d3.scaleOrdinal(d3.schemeCategory20);

//Simulation start
var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody().strength(-700))
    .force("center", d3.forceCenter(width / 3, height / 3))
    .force("collide", d3.forceCollide(function(d){return d.r+200}).iterations(20));


d3.json("miserables.json", function(error, graph) {
  if (error) throw error;
  console.log("graph", graph);

  var link = svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
      .attr("stroke-width", function(d) { return Math.sqrt(2); })
      .attr("marker-end", "url(#arrow)");

  var node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("rect")
    .data(graph.nodes)
    .enter().append("rect")
      .attr("width", 50)
      .attr("height", 25)
      .attr("fill", function(d) { return color(d.group); })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));
  console.log("nodes", node);
  node.append("title")
      .text(function(d) { return d.id; });
  console.log("node-title", node);
  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);
  console.log("simulation-ticks", simulation);
  simulation.force("link")
      .links(graph.links);
  console.log("simulation-links", simulation);
  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x>d.target.x?d.source.x+25:d.source.x+25; })
        .attr("y1", function(d) { return d.source.y>d.target.y?d.source.y:d.source.y+25; })
        .attr("x2", function(d) { return d.source.x>d.target.x?d.target.x+25:d.target.x+25; })
        .attr("y2", function(d) { return d.source.y>d.target.y?d.target.y+25:d.target.y; });

    node
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; });
  }
});

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
