import React, {PropTypes} from 'react';
import * as d3 from 'd3';

var rectWidth = 100;
var rectHeight = 50;

export default class ForceFlowChart extends React.Component {

  //Once component mounted and the reference exists.
  componentDidMount () {
    const width = 1000;
    const height = 1000;
    var data = this.props.data;

    var svg = d3.select(this.refs.hook)
    .append('svg:svg')
    .attr('viewBox', '0 0 2000 2000')
    .attr('preserveAspectRatio', 'xMinYMin')
    .attr('xmlns', 'http://www.w3.org/2000/svg')
    .attr('version', '1.1');

    //Add a marker Just to make the graph directed.
    svg.append("defs").append("marker")
        .attr("id", "arrow")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 10)
        .attr("refY", 0)
        .attr("markerWidth", 5)
        .attr("markerHeight", 5)
        .attr("fill", "#e8120c")
        .attr("stroke", "#e8120c")
        .attr("orient", "auto")
      .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");

    var simulation = d3.forceSimulation()
    .force("link", 		d3.forceLink().id(function(d) { return d.id; }))
    	.force("charge", 	d3.forceManyBody().strength(-8000).theta(0).distanceMax(1000))
    	.force("center", 	d3.forceCenter(0.5*width,0.5*height));

    var link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(data.links)
    .enter().append("line")
    .attr("stroke-width", function(d){return 2;})
    .attr("stroke", function(d){return "#000000";})
    .attr("marker-end", "url(#arrow)");



    var node = svg.append("g")
    .attr("class","nodes")
    .selectAll("rect")
    .data(data.nodes)
    .enter().append("rect")
    .attr("width", rectWidth)
    .attr("height", rectHeight)
    .attr("fill", function(d) { return "#fff"; })
	  .attr("stroke-width", function(d) { return 1; })
	  .attr("stroke", function(d) { return "#9f1313"; })
    .call(d3.drag().on("start", function(d){dragStart(d, simulation)})
              .on("drag", function(d){dragged(d, simulation)})
              .on("end", function(d){dragEnd(d, simulation)})
            );

    //node.append("title").text(function(d){return d.id;});



    simulation.nodes(data.nodes).on("tick", ticked);

    simulation.force("link").links(data.links);

    console.log(data.nodes);
    //Adding text.attr("dx", function(d) {console.log(d);return d.x;})
    //.attr("dy", ".35em")
    var labels = svg.append("g")
    .attr("class","labels")
    .selectAll("text")
    .data(data.nodes)
    .enter().append("text").text( function (d) { console.log(d);return "( " + d.id +" )"; })
    .attr("font-family", "sans-serif").attr("font-size", "20px").attr("fill", "blue")
    .attr("x", function(d){
      return d.x;
    })
    .attr("y", function(d){
      return d.y;
    });

    console.log(labels);

    // svg.attr("transform", function(d){
    //   return 'translate(' + [d.x, d.y] + ')';
    // });


    function ticked() {
      updateLink(link);
      updateNode(node);
      updateLabels(labels);
    }
  }//end component did mount.

  render () {
    // The render should have a dom element that will be passed to D3 as a reference
    // Once D3 has the reference it should be able to manipulate the react's virtual DOM.
    return (
      <div>
        <h1>Batch Flow Visualization</h1>
        <div ref='hook' />
      </div>
    );
  }
}


//Helper functions
var updateNode = (selection) => {
  selection.attr("x", function(d) {return d.x;});
  selection.attr("y", function(d) {return d.y;});
};

var updateLabels = (selection) => {
  selection.attr("x", function(d) {return d.x+rectWidth/8;});
  selection.attr("y", function(d) {return d.y+3*rectHeight/4;});
}

var updateLink = (selection) => {
  selection.attr("x1", function(d) { return updateLinks(d).sx; });
	selection.attr("y1", function(d) { return updateLinks(d).sy; });
	selection.attr("x2", function(d) { return updateLinks(d).tx; });
	selection.attr("y2", function(d) { return updateLinks(d).ty; });
};

//Didn't quite figure out the perfect formula.
var updateLinks = (d) => {
  var sx, sy, tx, ty;
  var x1 = d.source.x, y1 = d.source.y, x2 = d.target.x, y2 = d.target.y;
  if(d.source.x >= d.target.x){
    if(d.source.y >= d.target.y){ //Source is greater in x and y Target is in top left
      sx=x1+rectWidth/2;
      sy=y1;
      tx=x2+0.75*rectWidth;
      ty=y2+rectHeight;
    } else { // target in bottom left
      sx=x1+rectWidth/2;
      sy=y1+rectHeight;
      tx=x2+0.75*rectWidth;
      ty=y2;
    }
  } else {
    if(d.source.y >= d.target.y){ //target in top right
      sx=x1+rectWidth/2;
      sy=y1;
      tx=x2+rectWidth/4;
      ty=y2+rectHeight;
    } else { // target in bottom right
      sx=x1+rectWidth/2;
      sy=y1+rectHeight;
      tx=x2+rectWidth/4;
      ty=y2;
    }
  }
  if(y2 < (Math.sqrt(2)*y1) && y2 > (y1/(Math.sqrt(2)))){
    if(x1>x2){
      sx=x1;
      sy=y1+rectHeight/2;
      tx=x2+rectWidth;
      ty=y2+rectHeight/2;
    } else {
      sx=x1+rectWidth;
      sy=y1+rectHeight/2;
      tx=x2;
      ty=y2+rectHeight/2;
    }
  }
  if(x2 < (Math.sqrt(2)*x1) && x2 > (x1/(Math.sqrt(2)))){
    if(y1>y2){
      sx=x1+rectWidth/2;
      sy=y1;
      tx=x2+rectWidth/2;
      ty=y2+rectHeight;
    } else {
      sx=x1+rectWidth/2;
      sy=y1+rectHeight;
      tx=x2+rectWidth/2;;
      ty=y2;
    }
  }
  return {
    sx,
    sy,
    tx,
    ty
  };
};

var dragStart = (d,simulation) => {
	if (!d3.event.active) simulation.alphaTarget(0.3).restart();
	d.fx = d.x;
	d.fy = d.y;
};

var dragged = (d,simulation) => {
		d.fx = d3.event.x;
		d.fy = d3.event.y;
};

var dragEnd = (d,simulation) => {
	if (!d3.event.active) simulation.alphaTarget(0);
	d.fx = null;
	d.fy = null;
};
