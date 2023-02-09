import React, { useState } from "react";
import "./App.scss";
import { StyleProvider } from "../_contexts/style.contexts";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function App() {
  const [isDark, setIsDark] = useState(window.localStorage.getItem("isDark"))
  const alert = useSelector(x => x.alert);

  function changeTheme() {
    setIsDark(!isDark)
  }

  return (
    <StyleProvider value={{ isDark: isDark, changeTheme: changeTheme }}>
      <div className={`app${isDark ? " app--dark-mode" : ""}`}>
        <div className="app__content">
          {alert.message &&
            <div className={`alert alert--${alert.type}`}>{alert.message}</div>
          }
          <Outlet />
        </div>
      </div>
    </StyleProvider>
  )
}
