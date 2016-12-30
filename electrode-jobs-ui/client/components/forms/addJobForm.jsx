import React from "react";
import {Field, reduxForm} from "redux-form";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import Paper from 'material-ui/Paper';

const validate = values => {
  const errors = {};
  const requiredFields = ['id', 'group'];
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


  //height: 325,

const style = {
  width: "98%",
  margin: "1%",
  padding: "4%",
  textAlign: 'center',
  display: 'inline-block',
  "verticalAlign": "top"
}

class AddJobForm extends React.Component {

  render() {
    const {handleSubmit} = this.props;
    //console.log(this.props);
    return (
      <Paper style={style} zDepth={2} rounded={true}>
        <h3>Add Job Form</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <Field name="id" component={renderTextField} label="Job Name"/>
          </div>
          <div>
            <Field name="group" component={renderTextField} label="Job Group"/>
          </div>
          <div>
            <RaisedButton type="submit" primary={true} label="submit"/>
          </div>
        </form>
      </Paper>
    );
  }
}

export default reduxForm({form: 'AddJobForm', validate})(AddJobForm);
