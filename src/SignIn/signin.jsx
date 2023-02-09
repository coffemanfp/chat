import { useEffect, useState } from "react";
import "./signin.scss";
import Login from './Login/login';
import SignUp from './SignUp/signup';
import googleLoginLogo from "../_images/googleLoginLogo.svg";
import { useGoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function SignIn({ defaultIsLogin }) {
    const [isLogin, setIsLogin] = useState(defaultIsLogin);
    const token = useSelector(x => x.auth.token);
    const navigate = useNavigate();
    const gLogin = useGoogleLogin({
        onSuccess: codeResponse => console.log(codeResponse),
        onError: errorResponse => console.log('Login failed:', errorResponse),
        flow: 'auth-code',
    })

    useEffect(() => {
        if (token) {
            navigate('/chat');
        }
    })

    return (
        <div className="sign-in">
            <div className="sign-in__form-simulator"></div>
            <div className="sign-in__form-section">
                <p className="sign-in__app-name">Chat</p>
                <div className="sign-in-form">
                    <p className="sign-in-form__title">{isLogin ? "Welcome back!" : "Nice to meet you!"}</p>
                    <p className="sign-in-form__description">{isLogin ? "Please enter your credentials" : "But... who are you?"}</p>
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
            <div className="sign-in__image-section"></div>
        </div>
    )
}