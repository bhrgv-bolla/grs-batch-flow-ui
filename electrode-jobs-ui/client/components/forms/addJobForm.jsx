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

class AddJobForm extends React.Component {

  handleFormSubmit(data) {
    console.log(data, "asdsad");
    this.props.onSubmit(data);
  }
  render(){
    const { handleSubmit } = this.props;
    console.log(this.props);
    return(
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        <div>
          <Field name="id" component={id =>
           <TextField hintText = "JW@@US"
             floatingLabelText="jobID"
             errorText = {id.touched && id.error}
           />
           }/>
        </div>
        <div>
          <Field name="group" component={group =>
           <TextField hintText = "demand-segmentation"
             floatingLabelText="group"
             errorText = {group.touched && group.error}
           />
           }/>
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
