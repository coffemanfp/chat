import { useState } from "react";
import "./signin.scss";
import Login from './login';
import SignUp from './signup';
import chatLogo from "../../images/chatLogo.png";

export default function SignIn() {
    const [ isLogin, setIsLogin ] = useState(true);

    return (
        <div className="sign-in">
            <div className="sign-in__form-section">
                <p className="sign-in__app-name">Chat</p>
                <div className="sign-in-form">
                    <p className="sign-in-form__title">{isLogin ? "Welcome back!" : "Nice to meet you!"}</p>
                    <p className="sign-in-form__description">{isLogin ? "Please enter your credentials" : "But... who are you?" }</p>
                    {isLogin
                    ? <Login />
                    : <SignUp />
                    }
                    <p className="sign-in-form__suggestion">{isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button className="sign-in-form__link" onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Sign up" : "Login"}</button>
                    </p>
                </div>
                <p className="sign-in__signature">@ coffemanfp</p>
            </div>
            <div className="sign-in__image-section">
                <img src={chatLogo} alt="Chat Logo" className="sign-in__image" />
            </div>
        </div>
    )
}