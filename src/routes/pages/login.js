import React, { Component, Fragment } from "react";
import { Row, Card, CardTitle, Form, Label, Input, Button } from "reactstrap";
import { NavLink } from "react-router-dom";

import { Colxx } from "Components/CustomBootstrap";

import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class LoginLayout extends Component {
  constructor(props) {
    super(props);
    this.onChangeInput = this.onChangeInput.bind(this);
    this.onTokenVerify = this.onTokenVerify.bind(this);

    this.state = {
      isQrCode: false,
      token: "",
      secret: [],
      email: "admin@visa.com",
      user: [],
      password: "123456"
    };
  }
  onUserLogin(e) {
    e.preventDefault();
    if (this.state.email !== "" && this.state.password !== "") {
      // console.log('request submit')
      //     localStorage.setItem("login", true);
      //     this.props.history.push("/app/dashboards/banks")
      const data = {"email": this.state.email, "password": this.state.password};
      axios({
        method: "POST",
        url: "/api/auth/login",
        data: data
      }).then(res => {
        console.log(res);
        if (res.data.error) {
          toast.error(res.data.message, {
            position: "top-left"
          })
        }else if (res.data.info) {
          toast.warn(res.data.message, {
            position: "top-left"
          })
        }else if (res.data.success) {
          this.setState({
            secret: res.data.secret,
            isQrCode: true,
            user: res.data.message[0]
          })
          // localStorage.setItem("login", true);
          // localStorage.setItem("username", res.data.message[0].username)
          // localStorage.setItem("email", res.data.message[0].email)
          // this.props.history.push("/app/dashboards/banks")
        }else {
          toast.warn(res.data.message, {
            position: "top-left"
          })
        }
      }).catch((err) => {
        console.log(err);
        toast.warn("Invalid Email or Password!", {
          position: "top-left"
        })
      })
      console.log('login request')
      // this.props.loginUser(this.state, this.props.history);
    }
  }

  onTokenVerify(e) {
    e.preventDefault();
    console.log("verifing...")
    console.log({
      token: this.state.token,
      secret: this.state.secret.ascii,
      encoding: "ascii"
    })
    if (this.state.token != "") {
      axios({
        method: 'POST',
        url: "/api/twoFA/verify",
        data: {
          token: this.state.token,
          secret: this.state.secret.ascii,
          encoding: "ascii"
        }
      }).then((res) => {
        console.log(res);
        if (res.data.info) {
          toast.warn(res.data.message, {
            position: 'top-left'
          })
        }else if (res.data.success) {
          localStorage.setItem("login", true);
          localStorage.setItem("username", res.data.message[0].username)
          localStorage.setItem("email", res.data.message[0].email)
          this.props.history.push("/app/dashboards/banks")
        }else {
          toast.warn("Invalid Token", {
            position: "top-left"
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  }

  onChangeInput(e) {
    this.setState({[e.target.name]: e.target.value})
  }

  componentDidMount() {
    document.body.classList.add("background");
    if (localStorage.getItem("login") == "true") {
      this.props.history.push("/app/dashboards/banks")
    }
  }
  componentWillUnmount() {
    document.body.classList.remove("background");
  }
  render() {
    return (
      <Fragment>
        <ToastContainer />
        {(
          this.state.isQrCode == true ? 

          <div className="d-flex align-items-center justify-content-center flex-column" style={{height: '100vh'}}>
            <h1 className="w-50 mx-auto text-center">Please Scan QR Code in Google Authenticator App and Enter Token.</h1>
            <img src={this.state.secret.data} />
            <form onSubmit={this.onTokenVerify}>
              <Label className="form-group mt-4 has-float-label mb-4">
                <label>Token</label>
                <Input type="number" name="token" onChange={this.onChangeInput} defaultValue={this.state.token} required/>
              </Label>
              <div className="d-flex mt-3 justify-content-center align-items-center">
                <Button
                  color="primary"
                  className="btn-shadow"
                  size="lg"
                  type="submit"
                >
                  Verify
                </Button>
              </div>
            </form>
          </div>

          :
          <main>
        <div className="fixed-background" />
          <div className="container">
            <Row className="h-100">
              <Colxx xxs="12" md="8" className="mx-auto my-auto">
                <Card className="auth-card">
                  <div className="form-side mx-auto">
                    <NavLink to={`/`} className="white d-flex align-items-center justify-content-center">
                      <img width="100" className="mb-4" src="/assets/img/logo-black.png" />
                    </NavLink>
                    <CardTitle className="mb-2 mx-auto">
                      <label>Login</label>
                    </CardTitle>
                    <form onSubmit={(e) => this.onUserLogin(e)}>
                      <Label className="form-group has-float-label mb-4">
                        <label>E-mail</label>
                        <Input type="email" name="email" onChange={this.onChangeInput} defaultValue={this.state.email} required/>
                      </Label>
                      <Label className="form-group has-float-label mb-4">
                        <label>Password</label>
                        <Input type="password" name="password" onChange={this.onChangeInput} defaultValue={this.state.password} required />
                      </Label>
                      <div className="d-flex justify-content-center align-items-center">
                        <Button
                          color="primary"
                          className="btn-shadow"
                          size="lg"
                          type="submit"
                        >
                          LOGIN
                        </Button>
                      </div>
                    </form>
                  </div>
                </Card>
              </Colxx>
            </Row>
          </div>
        </main>

        )}
      </Fragment>
    );
  }
}

export default LoginLayout;