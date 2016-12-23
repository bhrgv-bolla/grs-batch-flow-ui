import React from "react";
import {Field, reduxForm} from "redux-form";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton"


const validate = values => {
  const errors = {};
  const requiredFields = ['id', 'group'];
  requiredFields.forEach(field => {
    if(!values[field]){
      errors[field] = 'Required';
    }
  });
  return errors;
};

const renderTextField = ({ input, label, meta: { touched, error }, ...custom }) => (
  <TextField hintText={label}
    floatingLabelText={label}
    errorText={touched && error}
    {...input}
    {...custom}
  />
);

class AddJobForm extends React.Component {

  render(){
    const { handleSubmit } = this.props;
    //console.log(this.props);
    return(
      <form onSubmit={handleSubmit}>
        <div>
          <Field name="id" component={renderTextField} label="Job Name"/>
        </div>
        <div>
          <Field name="group" component={renderTextField} label="Last Name"/>
        </div>
        <div>
          <RaisedButton type="submit" primary={true} label="submit"/>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'AddJobForm',
  validate
}) (AddJobForm);
