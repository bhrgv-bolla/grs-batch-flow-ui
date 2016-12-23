import React, {PropTypes} from "react";
import {connect} from "react-redux";
import Notifications from "react-notify-toast";
import {toggleCheck, incNumber, decNumber} from "../actions";
import ForceFlowChart from "./batchFlow";
import AddJobForm from "./forms/addJobForm";
import axios from "axios";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

var addJob = (e) => {
  axios.post('/upsert-job', e).then(function(response) {
    console.log(response);
  }).catch(function(error) {
    console.log(error);
  });
};

var getGraphData = () => axios.get('/getGraphData');

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      graph: {}
    };
  }

  componentWillMount() {
    console.log(this.state);

  }

  render() {
    const showResults = values => new Promise(resolve => {
      var x = addJob(values);
      console.log(x, values);
      resolve();
    });
    const data = require('json!./data.json');
    const props = this.props;
    const {checked, value} = props;
    getGraphData().then(function(response) {
      var graph = response.data;
      this.setState(graph);
      console.log("resolved");
    }).catch(function(err) {
      console.log(err);
    });
    return (
      <MuiThemeProvider>
        <div>
          <div>
            <AddJobForm onSubmit={showResults}></AddJobForm>
          </div>
          <div>
            <ForceFlowChart data={this.state.graph}></ForceFlowChart>
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
