import React, {PropTypes} from "react";
import {connect} from "react-redux";
import Notifications from "react-notify-toast";
import {toggleCheck, incNumber, decNumber} from "../actions";
import ForceFlowChart from "./batchFlow";
import AddJobForm from "./forms/addJobForm";
import axios from "axios";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

var addJob = (e) => {
  axios.post('/upsert-job',e)
  .then(function (response) {
    console.log(response);
  })
  .catch(function(error) {
    console.log(error);
  });
};


class Home extends React.Component {

  handleSubmit(data) {
    console.log(data);
    addJob(data);
  };

  render() {
    const data = require('json!./data.json');
    const props = this.props;
    const {checked, value} = props;
    return (
      <MuiThemeProvider>
        <div>
          <div>
            <AddJobForm onSubmit={this.handleSubmit.bind(this)}></AddJobForm>
          </div>
          <div>
            <ForceFlowChart data={data}></ForceFlowChart>
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
  return {
    checked: state.checkBox.checked, value: state.number.value
  };
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
