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

var addJob = (e) => axios.post('/upsert-job', e).then(function(response) {
    console.log(response);
  }).catch(function(error) {
    console.log(error);
  });

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

const style = {
  height: 350,
  width: "90%",
  margin: "2%",
  textAlign: 'center',
  display: 'inline-block'
};

class Home extends React.Component {

  componentDidMount() {
    var component = this;
    console.log("state is", this.state);
  }

  render() {
    const data = require('json!./data.json');
    const props = this.props;
    const {checked, value} = props;
    return (
      <MuiThemeProvider>
        <div>
          <div>
            <AddJobForm onSubmit={addJob}></AddJobForm>
            <AddLinkForm onSubmit={addLink}></AddLinkForm>
            <FeedbackForm onSubmit={postFeedback}></FeedbackForm>
          </div>
          <div>
            <ForceFlowChart source={"/getGraphData"}></ForceFlowChart>
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
