import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Form from './Form';

export default class UserSignUp extends Component {
  state = {
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: '',
    confirmPassword: '',
    errors: []
  }

  render() {
    const {
      firstName,
      lastName,
      emailAddress,
      password,
      confirmPassword,
      errors
    } = this.state;

    return (
      <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign Up</h1>
          <Form 
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Sign Up"
            elements={() => (
              <React.Fragment>
                <input 
                  id="firstName" 
                  name="firstName" 
                  type="string"
                  value={firstName} 
                  onChange={this.change} 
                  placeholder="First Name" />
                <input 
                  id="lastName" 
                  name="lastName" 
                  type="string"
                  value={lastName} 
                  onChange={this.change} 
                  placeholder="Last Name" />
                <input 
                  id="emailAddress" 
                  name="emailAddress" 
                  type="text"
                  value={emailAddress} 
                  onChange={this.change} 
                  placeholder="Email Address" />
                <input 
                  id="password" 
                  name="password"
                  type="password"
                  value={password} 
                  onChange={this.change} 
                  placeholder="Password" />
                <input 
                  id="confirmPassword" 
                  name="confirmPassword"
                  type='password'
                  value={confirmPassword}
                  onChange={this.change} 
                  placeholder="Confirm Password" />
              </React.Fragment>
            )} />
          <p>
            Already have a user account? <Link to="/signin">Click here</Link> to sign in!
          </p>
        </div>
      </div>
    );
  }

  //TODO: Get all fields with name attribute.... look at UserSignIn and follow that!!! 
  change = (e) => {

    const name = e.target.name;
    const value = e.target.value;
    const newState = {};
    newState[name] = value;

    this.setState(newState);
  }

  submit = (e) => {
    // e.preventDefault();
    const { context } = this.props;
    const {
      firstName,
      lastName,
      emailAddress,
      password,
      confirmPassword
    } = this.state;

    // Create user
    const user = {
      firstName,
      lastName,
      emailAddress,
      password
    };

    if(password === confirmPassword){
      context.data.createUser(user)
        .then(errors => {
          if (errors.length) {
            this.setState({ errors });
          } else {
            context.actions.signIn(emailAddress, password)
              .then(user => {
                if(user === null)
                  this.setState({
                    errors: ["Sign-in failed. Please try again."],
                  })
                this.props.history.push('/');    
              });
          }
        })
        .catch((error) => {
          console.log(error);
          this.props.history.push('/error');
        });
    }
  }

  cancel = () => {
   this.props.history.push('/');
  }
}
