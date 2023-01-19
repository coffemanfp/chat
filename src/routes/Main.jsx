import React from "react";
import {useLocalStorage} from "../hooks/useLocalStorage";
import {StyleProvider} from "../contexts/StyleContext";

const Main = () => {
    const darkPref = window.matchMedia("(prefers-color-scheme: dark)");
    const [isDark, setIsDark] = useLocalStorage("isDark", darkPref.matches)
    const changeTheme = () => {
        setIsDark(!isDark);
    };
    return (
        <div className={isDark ? "dark-mode" : null}>
            <StyleProvider value={{isDark: isDark, changeTheme: changeTheme}}>
                <div>Hello World!</div>
            </StyleProvider>
        </div>
    )
}

export default Main;
