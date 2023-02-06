import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { alertActions, authActions } from '../../_store';

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const dispatch = useDispatch();
    const authError = useSelector(x => x.auth.error);
    const onSubmit = ({ email, password }) => {
        return dispatch(authActions.login({ email, password }));
    }
    const errorMessages = {
        "email-required": "Email required",
        "email-pattern": "Email invalid",
        "password-required": "Password required",
    };
    const errorsHandler = (n, t) => {
        const errorAlertText = errorMessages[`${n}-${t}`]
        return errorAlertText && <p role="alert" className="sign-in-form__input-error">{errorAlertText}</p>
    }

    if (authError) dispatch(alertActions.newMessage(authError.message, 'error', Date.now()));

    return (
        <form className="sign-in-form__form" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="email" className="sign-in-form__label">
                Email
                <input {...register("email", { required: true, pattern: /^([a-z0-9_.-]+)@([\da-z.-]+).([a-z.]{2,6})$/ })} id="email" type="text" className="sign-in-form__input"/>
                {errorsHandler("email", errors.email?.type)}
            </label>
            <label htmlFor="password" className="sign-in-form__label">
                Password
                <input {...register("password", { required: true })} type="password" id="password" className="sign-in-form__input" />
                {errorsHandler("password", errors.password?.type)}
            </label>
            <button type="submit" className="sign-in-form__submit">Login</button>
        </form>
    )
}