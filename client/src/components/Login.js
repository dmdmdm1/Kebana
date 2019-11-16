import React from 'react';
import axios from 'axios'

class Login extends React.Component {

  state = {
    email: '',
    password: '',
  }

  submitHandler = (event) => {
    event.preventDefault()
    axios.post('/api/auth/login', this.state).then((response) => {
      this.props.updateUser(response.data)
    }).catch(() => { })
  }

  changeHandler = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {
    return (
      <div>
        LOGIN:
        <form onSubmit={this.submitHandler}>
          <input name="email" onChange={this.changeHandler} value={this.state.email} type="text" placeholder="email"></input>
          <br></br>
          <input name="password" onChange={this.changeHandler} value={this.state.password} type="text" placeholder="password"></input>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }

}

export default Login;
