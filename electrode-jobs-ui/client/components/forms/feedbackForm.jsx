import React from "react";
import {Field, reduxForm} from "redux-form";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import Paper from 'material-ui/Paper';

const validate = values => {
  const errors = {};
  const requiredFields = ['windowLocation', 'reportedBy', 'feedbackText'];
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'Required';
    }
  });
  return errors;
};

const renderTextField = ({
  input,
  label,
  meta: {
    touched,
    error
  },
  ...custom
}) => (<TextField hintText={label} floatingLabelText={label} errorText={touched && error} {...input} {...custom}/>);

const style = {
  height: 370,
  width: "48%",
  margin: "1%",
  textAlign: 'center',
  display: 'inline-block',
  "verticalAlign": "top"
}

class FeedbackForm extends React.Component {

  render() {
    const {handleSubmit} = this.props;
    //console.log(this.props);
    return (
      <Paper style={style} zDepth={5} rounded={true}>
        <h3>Post Feedback</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <Field name="windowLocation" component={renderTextField} label="Window Location"/>
          </div>
          <div>
            <Field name="reportedBy" component={renderTextField} label="User Name"/>
          </div>
          <div>
            <Field name="feedbackText" component={renderTextField} label="Feedback"/>
          </div>
          <div>
            <RaisedButton type="submit" primary={true} label="submit"/>
          </div>
        </form>
      </Paper>
    );
  }
}

export default reduxForm({form: 'FeedbackForm', validate})(FeedbackForm);
