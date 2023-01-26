import { useForm } from 'react-hook-form';
import { Form } from 'react-router-dom';
import { userActions } from '../../_actions';
import { connect } from 'react-redux';

export default function Login(props) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = d => {
        const data = JSON.stringify(d);
        props.login(data.email, data.password)
    }
    const errorMessages = {
        "email-required": "Email required",
        "email-pattern": "Email invalid",
        "password-required": "Password required",
    };
    const errorsHandler = (n, t) => {
        const errorAlertText = errorMessages[`${n}-${t}`]
        errorAlertText && <p role="alert" className="sign-in-form__input-error">{errorAlertText}</p>
    }

    return (
        // <>
            <Form className="sign-in-form__form" onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="email" className="sign-in-form__label">
                    Email
                    <input {...register("email", { required: true, pattern: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/ })} id="email" type="text" className="sign-in-form__input" />
                    {errorsHandler("email", errors.email?.type)}
                </label>
                <label htmlFor="password" className="sign-in-form__label">
                    Password
                    <input {...register("password", { required: true })} type="password" id="password" className="sign-in-form__input" />
                    {errorsHandler("password", errors.password?.type)}
                </label>
                <button type="submit" className="sign-in-form__submit">Login</button>
            </Form>
        /* </> */
    )
}

function mapState(state) {
    const { loggingIn } = state.login;
    return { loggingIn };
}

const actionCreators = {
    login: userActions.login,
    logout: userActions.logout
};

const connectedLogin = connect(mapState, actionCreators)(Login);

export { connectedLogin as Login };

// export const loginSubmit = async ({ _, request }) => {
//     const data = await request.formData();
//     return
// }
