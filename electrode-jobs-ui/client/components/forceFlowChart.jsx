import React, {PropTypes} from 'react';
import * as d3 from 'd3';
import axios from "axios";
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import styles from '../styles/base.css';

var rectWidth = 150;
var rectHeight = 50;
const width = 1000;
const height = 1000;

const style = {
  width: "98%",
  margin: "1%",
  padding: "2%",
  textAlign: 'center',
  display: 'inline-block'
};

var _this; //Easy way to use functions! ;)


export default class ForceFlowChart extends React.Component {

  constructor(props) {
    console.log(styles);
    super(props);
    _this = this;
    this.state = {
      open: false,
      currentJobInfo: "None Selected",
      graph: {
        nodes: [],
        links: []
      }
    };
  }

  //for the modal
  handleOpen(jobInfo) {
    _this.setState({open: true, currentJobInfo: jobInfo});
  };

  handleClose() {
    _this.setState({open: false, currentJobInfo: "None Selected"});
  };

  showJobInfo(d) {
    _this.handleOpen(JSON.stringify(d));
    // window.alert(JSON.stringify(d));
  };


  //Visualization stuff starts here
  startVisualization(data) {
    var svg = d3.select(this.refs.hook).append('svg:svg').attr('viewBox', '0 0 2000 2000').attr('preserveAspectRatio', 'xMinYMin').attr('xmlns', 'http://www.w3.org/2000/svg').attr('version', '1.1');

    //Add a marker Just to make the graph directed.
    svg.append("defs").append("marker").attr("id", "arrow").attr("viewBox", "0 -5 10 10").attr("refX", 10).attr("refY", 0).attr("markerWidth", 5).attr("markerHeight", 5).attr("fill", "#e8120c").attr("stroke", "#e8120c").attr("orient", "auto").append("svg:path").attr("d", "M0,-5L10,0L0,5");

    var simulation = d3.forceSimulation().force("link", d3.forceLink().id(function(d) {
      return d.id;
    })).force("charge", d3.forceManyBody()).force("center", d3.forceCenter(width, height)).force("collide", d3.forceCollide(function(d) {
      return 0.6 * rectWidth;
    }).iterations(16)).force("y", d3.forceY(10)).force("x", d3.forceX(10));
    //.strength(-800).theta(0).distanceMax(1000)


    var link = svg.append("g").attr("class", "links").selectAll("line").data(data.links).enter().append("line").attr("stroke-width", function(d) {
      return 2;
    }).attr("stroke", function(d) {
      return "#000000";
    }).attr("marker-end", "url(#arrow)");

    var node = svg.append("g").attr("class", "nodes").selectAll("rect").data(data.nodes).enter().append("rect").attr("width", rectWidth).attr("height", rectHeight).attr("fill", function(d) {
      return d.color
        ? d.color
        : "#fff";
    }).attr("stroke-width", function(d) {
      return 1;
    }).attr("stroke", function(d) {
      return "#9f1313";
    }).call(d3.drag().on("start", function(d) {
      dragStart(d, simulation)
    }).on("drag", function(d) {
      dragged(d, simulation)
    }).on("end", function(d) {
      dragEnd(d, simulation, this)
    })).on("click", function(d) {
      toggleNodeLock(d, this);
    }).on("dblclick", function(d) {
      _this.showJobInfo(d.otherInfo);
    });

    //node.append("title").text(function(d){return d.id;});

    simulation.nodes(data.nodes).on("tick", ticked);

    simulation.force("link").links(data.links);

    console.log(data.nodes);
    //Adding text.attr("dx", function(d) {console.log(d);return d.x;})
    //.attr("dy", ".35em")
    var labels = svg.append("g").attr("class", "labels").selectAll("text").data(data.nodes).enter().append("text").text(function(d) {
      console.log(d);
      return "( " + d.id + " )";
    }).attr("font-family", "sans-serif").attr("font-size", "20px").attr("fill", "rgb(0, 0, 0)").attr("x", function(d) {
      return d.x;
    }).attr("y", function(d) {
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
  }

  //Once component mounted and the reference exists.
  componentDidMount() {

    var data = this.state.graph;
    var component = this;
    // var component = this;
    var getGraphData = () => axios.get(this.props.source);
    getGraphData().then(function(response) {
      var graph = response.data;
      // console.log(component);
      // component.setState({graph});
      component.startVisualization(graph);
      console.log("started Viz");
    }).catch(function(err) {
      console.log(err);
    });
  } //end component did mount.

  render() {
    // The render should have a dom element that will be passed to D3 as a reference
    // Once D3 has the reference it should be able to manipulate the react's virtual DOM.
    console.log("render Batch flow props", this.props);
    const actions = [
      <RaisedButton
        label="Edit"
        primary={true}
        onTouchTap={_this.handleClose}
        className={styles.buttonStyle}
      />,
      <RaisedButton
        label="Close"
        primary={true}
        keyboardFocused={true}
        onTouchTap={_this.handleClose}
        className={styles.buttonStyle}
      />,
    ];

    return (
      <Paper style={style} zDepth={2} rounded={true}>
        <h3>Batch Flow Viz.</h3>
        <div ref='hook'/>
        <Dialog
            title="ADDITIONAL JOB INFO"
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={_this.handleClose}
            autoScrollBodyContent={true}
            titleClassName={styles.titleText}
          >
          {this.state.currentJobInfo}
        </Dialog>
      </Paper>
    );
  }
}

//Helper functions
var updateNode = (selection) => {
  selection.attr("x", function(d) {
    return Math.max(0, Math.min(2 * width - rectWidth, d.x));
    // return d.x;
  });
  selection.attr("y", function(d) {
    return Math.max(0, Math.min(2 * height - rectHeight, d.y));
    // return d.y;
  });
};

var updateLabels = (selection) => {
  selection.attr("x", function(d) {
    return Math.max(0, Math.min(2 * width - rectWidth, d.x)) + rectWidth / 8;
    // return d.x + rectWidth / 8;
  });
  selection.attr("y", function(d) {
    return Math.max(0, Math.min(2 * height - rectHeight, d.y)) + 3 * rectHeight / 4;
    // return d.y + 3 * rectHeight / 4;
  });
}

var updateLink = (selection) => {
  selection.attr("x1", function(d) {
    return updateLinks(d).sx;
  });
  selection.attr("y1", function(d) {
    return updateLinks(d).sy;
  });
  selection.attr("x2", function(d) {
    return updateLinks(d).tx;
  });
  selection.attr("y2", function(d) {
    return updateLinks(d).ty;
  });
};

//Didn't quite figure out the perfect formula.
var updateLinks = (d) => {
  var sx,
    sy,
    tx,
    ty;
  var x1 = d.source.x,
    y1 = d.source.y,
    x2 = d.target.x,
    y2 = d.target.y;
  if (d.source.x >= d.target.x) {
    if (d.source.y >= d.target.y) { //Source is greater in x and y Target is in top left
      sx = x1 + rectWidth / 2;
      sy = y1;
      tx = x2 + 0.75 * rectWidth;
      ty = y2 + rectHeight;
    } else { // target in bottom left
      sx = x1 + rectWidth / 2;
      sy = y1 + rectHeight;
      tx = x2 + 0.75 * rectWidth;
      ty = y2;
    }
  } else {
    if (d.source.y >= d.target.y) { //target in top right
      sx = x1 + rectWidth / 2;
      sy = y1;
      tx = x2 + rectWidth / 4;
      ty = y2 + rectHeight;
    } else { // target in bottom right
      sx = x1 + rectWidth / 2;
      sy = y1 + rectHeight;
      tx = x2 + rectWidth / 4;
      ty = y2;
    }
  }
  if (y2 < (Math.sqrt(2) * y1) && y2 > (y1 / (Math.sqrt(2)))) {
    if (x1 > x2) {
      sx = x1;
      sy = y1 + rectHeight / 2;
      tx = x2 + rectWidth;
      ty = y2 + rectHeight / 2;
    } else {
      sx = x1 + rectWidth;
      sy = y1 + rectHeight / 2;
      tx = x2;
      ty = y2 + rectHeight / 2;
    }
  }
  if (x2 < (Math.sqrt(2) * x1) && x2 > (x1 / (Math.sqrt(2)))) {
    if (y1 > y2) {
      sx = x1 + rectWidth / 2;
      sy = y1;
      tx = x2 + rectWidth / 2;
      ty = y2 + rectHeight;
    } else {
      sx = x1 + rectWidth / 2;
      sy = y1 + rectHeight;
      tx = x2 + rectWidth / 2;;
      ty = y2;
    }
  }
  return {sx, sy, tx, ty};
};

var dragStart = (d, simulation) => {
  if (!d3.event.active)
    simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
  console.log(d.fx, d.fy);
};

var dragged = (d, simulation) => {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
  console.log(d.fx, d.fy);
};

var dragEnd = (d, simulation, _this) => {
  console.log(_this, simulation);
  if (!d3.event.active)
    simulation.alphaTarget(0);
  d3.select(_this).attr("fill", "#ff0000");
  // console.log(d, d3.event, _this);
  // d.fx = null;
  // d.fy = null;
  console.log(d.fx, d.fy);
};

var toggleNodeLock = (d, _this) => {
  console.log("enter toggle node lock", d, _this);
  if (!d.fx && !d.fy) {
    lockNode(d, _this);
  } else {
    relaxNode(d, _this);
  }
};

var lockNode = (d, _this) => {
  console.log("enter lock node");
  d3.select(_this).attr("fill", "#ff0000");
  d.fx = d.x;
  d.fy = d.y;
};

var relaxNode = (d, _this) => {
  console.log(d, _this);
  d3.select(_this).attr("fill", "#ffffff");
  d.fx = null;
  d.fy = null;
};
