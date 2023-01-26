import React from "react";
import "./App.scss";
import { alertActions } from '../_actions';
import { history } from '../_helpers';
import { connect } from 'react-redux';
import { StyleProvider } from "../contexts/StyleContext";
import { Route, BrowserRouter as Router, Routes, Outlet } from "react-router-dom";
import SignIn from "../SignIn/signin";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isDark: window.localStorage.getItem("isDark") }
    history.listen(() => {
      this.props.clearAlerts();
    })
  }

  changeTheme() {
    this.setState((state) => ({
      isDark: state.isDark,
    }));
  }

  render() {
    const { alert } = this.props;
    const { isDark } = this.state;

    return (
      <StyleProvider value={{ isDark: isDark, changeTheme: this.changeTheme }}>
        <div className={isDark ? "app app--dark-mode" : "app"}>
          {alert.message &&
            <div className={`alert ${alert.type}`}>{alert.message}</div>
          }
          <Outlet />
        </div>
      </StyleProvider>
    )
  }
}

const Layout = () => <p>Hola</p>

function mapState(state) {
  const { alertReducer } = state;
  return { alert: alertReducer };
}

const actionCreators = {
  clearAlerts: alertActions.clear
};

const connectedApp = connect(mapState, actionCreators)(App);
export { connectedApp as App };