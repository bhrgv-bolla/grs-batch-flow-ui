import React from "react";
import {Field, reduxForm} from "redux-form";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import Paper from 'material-ui/Paper';

const validate = values => {
  const errors = {};
  const requiredFields = ['source', 'target'];
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

class AddLinkForm extends React.Component {

  render() {
    const {handleSubmit} = this.props;
    //console.log(this.props);
    return (
      <Paper style={style} zDepth={2} rounded={true}>
        <h3>Add Link Form</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <Field name="source" component={renderTextField} label="Source JobID"/>
          </div>
          <div>
            <Field name="target" component={renderTextField} label="Target JobID"/>
          </div>
          <div>
            <RaisedButton type="submit" primary={true} label="submit"/>
          </div>
        </form>
      </Paper>
    );
  }
}

export default reduxForm({form: 'AddLinkForm', validate})(AddLinkForm);
