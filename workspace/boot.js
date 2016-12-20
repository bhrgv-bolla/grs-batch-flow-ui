var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var color = d3.scaleOrdinal(d3.schemeCategory20);
console.log("color", color);
console.log("forceSimulation", d3.forceSimulation());
var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody().strength(-1000))
    .force("center", d3.forceCenter(width / 2, height / 2));
console.log("simulation", simulation);
d3.json("miserables.json", function(error, graph) {
  if (error) throw error;
  console.log("graph", graph);
  var link = svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
      .attr("stroke-width", function(d) { return Math.sqrt(d.value); });
  console.log("links", link);
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
        .attr("x1", function(d) { return d.source.x+25; })
        .attr("y1", function(d) { return d.source.y+12; })
        .attr("x2", function(d) { return d.target.x+25; })
        .attr("y2", function(d) { return d.target.y+12; });

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
