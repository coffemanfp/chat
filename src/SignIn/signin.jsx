import { useState } from "react";
import "./signin.scss";
import Login from './Login/login';
import SignUp from './SignUp/signup';
import chatLogo from "../images/chatLogo.png";
import googleLoginLogo from "../images/googleLoginLogo.svg";
import { useGoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";

export default function SignIn({ defaultIsLogin }) {
    const [ isLogin, setIsLogin ] = useState(defaultIsLogin);
    const gLogin = useGoogleLogin({
        onSuccess: codeResponse => console.log(codeResponse),
        onError: errorResponse => console.log('Login failed:', errorResponse),
        flow: 'auth-code',
    })

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
                    <button
                        className="sign-in-form__submit sign-in-form__submit--google"
                        onClick={() => gLogin()}
                    ><img className="sign-in-form__submit-icon" src={googleLoginLogo} alt="google login logo" /> Continue with Google</button>
                    <p className="sign-in-form__suggestion">{isLogin ? "Don't have an account? " : "Already have an account? "}
                        <Link className="sign-in-form__link" onClick={() => setIsLogin(!isLogin)} to={isLogin ? "/signup" : "/login"}>{isLogin ? "Sign up" : "Login"}</Link>
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