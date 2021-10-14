import React from "react";
// import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, withRouter, Switch, Redirect } from 'react-router-dom';
// import { configureStore } from "Redux/store";
import TopNav from 'Containers/TopNav'
import Sidebar from 'Containers/Sidebar';
import ReactDOM from 'react-dom';
import error from 'Routes/pages/error'
import login from 'Routes/pages/login'
import 'Assets/css/vendor/bootstrap.min.css'
import 'react-perfect-scrollbar/dist/css/styles.css';
import Banks from 'Routes/pages/banks'
import Analytics from 'Routes/pages/analytics'
// import Users from 'Routes/pages/Users';

class Dashboards extends React.Component {
  constructor(props) {
    super(props);
    this.openSidebar = this.openSidebar.bind(this);
    this.state = {
      sidebar: localStorage.getItem("sidebar")
    }
  }

  componentDidMount() {
    if (localStorage.getItem("login") == "true") {
      this.props.history.push("/app/dashboards/users")
    }else {
      this.props.history.push("/login")
    }
  }

  openSidebar() {
    if (this.state.sidebar == "main-show-temporary") {
      this.setState({sidebar: ""})
      localStorage.setItem("sidebar", "")
    }else {
      this.setState({sidebar: "main-show-temporary"})
      localStorage.setItem("sidebar", "main-show-temporary")
    }
  }
  render() {
    return (
            // <h1>Hello world</h1>
    <div id="app-container" className={`menu-default ${this.state.sidebar}`}>
				<TopNav openSidebar={this.openSidebar} history={this.props.history} />
				<Sidebar/>
				<main>
					<div className="container-fluid">
            {this.props.content}
					</div>
				</main>
			</div>
  );
  }
}

const WithRouterDashboard = withRouter(Dashboards);

class RedirectToLoginCom extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.history.push("/login");
  }
  render() {
    return <div></div>
  }
}

const RedirectToLogin = withRouter(RedirectToLoginCom);
const MainApp = () => (
    <Router>
      <Switch>
        <Route path={`/login`} component={login} />
        <Route exact path={`/`} component={RedirectToLogin} />
        <Route path={`/app/dashboards/banks`}>
          <WithRouterDashboard content={<Banks />} />
        </Route>
        <Route path={`/app/dashboards/analytics`}>
          <WithRouterDashboard content={<Analytics />} />
        </Route>
        {/* <Route path={`/app/dashboards/users`}>
          <WithRouterDashboard content={<Users />} />
        </Route> */}
        <Route component={error} />
      </Switch>
    </Router>
);

export default  ReactDOM.render(
  <MainApp />,
  document.getElementById("root")
);
