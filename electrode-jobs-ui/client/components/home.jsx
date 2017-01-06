import React, {PropTypes} from "react";
import {connect} from "react-redux";
import Notifications from "react-notify-toast";
import {toggleCheck, incNumber, decNumber} from "../actions";
import ForceFlowChart from "./forceFlowChart";
import AddJobForm from "./forms/addJobForm";
import AddLinkForm from "./forms/addLinkForm";
import FeedbackForm from "./forms/feedbackForm";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from "axios";
import Paper from 'material-ui/Paper';
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';

var addJob = (e) => {
  console.log(e);
  if(e.tags){
    e.tags = e.tags.split(",");
  }
  return axios.post('/upsert-job', e).then(function(response) {
  console.log(response);
}).catch(function(error) {
  console.log(error);
})};

var addLink = (e) => axios.post('/upsert-link', e).then(function(response) {
  console.log(response);
}).catch(function(error) {
  console.log(error);
});

var postFeedback = (e) => axios.post('/postFeedback', e).then(function(response) {
  console.log(response);
}).catch(function(error) {
  console.log(error);
});


  //height: 350,

const style = {
  width: "90%",
  margin: "2%",
  textAlign: 'center',
  display: 'inline-block'
};

const style2 = {
  height: "auto !important",
  // "overflow-y": "overlay"
};



class Home extends React.Component {


  componentDidMount() {
    console.log("state is", this.state);
  }

  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0
    };
  }

  handleChange(value) {
    console.log(this);
    this.setState({slideIndex: value});
  };

  render() {
    const data = require('json!./data.json');
    const props = this.props;
    const {checked, value} = props;

    return (
      <MuiThemeProvider>
        <div>
          <div>
            <Tabs onChange={this.handleChange.bind(this)} value={this.state.slideIndex}>
              <Tab label="Add Job" value={0}/>
              <Tab label="Add Link" value={1}/>
              <Tab label="Feedback" value={2}/>
            </Tabs>
            <SwipeableViews index={this.state.slideIndex} onChangeIndex={this.handleChange.bind(this)} animateHeight={true} style={style2}>
              <div style={style2}>
                <AddJobForm onSubmit={addJob}></AddJobForm>
              </div>
              <div style={style2}>
                <AddLinkForm onSubmit={addLink}></AddLinkForm>
              </div>
              <div style={style2}>
                <FeedbackForm onSubmit={postFeedback}></FeedbackForm>
              </div>
            </SwipeableViews>
          </div>
          <div>
            <ForceFlowChart source={"/getGraphData"} title={"Batch Flow Visualization"}></ForceFlowChart>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

Home.propTypes = {
  checked: PropTypes.bool,
  value: PropTypes.number.isRequired
};

const mapStateToProps = (state) => {
  return {checked: state.checkBox.checked, value: state.number.value};
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChangeCheck: () => {
      dispatch(toggleCheck());
    },
    onIncrease: () => {
      dispatch(incNumber());
    },
    onDecrease: () => {
      dispatch(decNumber());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
