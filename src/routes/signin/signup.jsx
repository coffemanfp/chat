import { useForm } from 'react-hook-form';

export default function SignUp() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = d => console.log(JSON.stringify(d))

    const errorsHandler = (n, t) => {
        let errorAlertText = '';
        switch (true) {
            case n === 'firstName' && t === 'required':
                errorAlertText = 'First name required';
                break;
            case n === 'firstName' && t === 'pattern':
                errorAlertText = 'First name invalid';
                break;
            case n === 'lastName' && t === 'required':
                errorAlertText = 'Last name required';
                break;
            case n === 'lastName' && t === 'pattern':
                errorAlertText = 'Last name invalid';
                break;
            case n === 'nickname' && t === 'required':
                errorAlertText = 'Nickname required';
                break;
            case n === 'nickname' && t === 'pattern':
                errorAlertText = 'Nickname invalid';
                break;
            case n === 'email' && t === 'required':
                errorAlertText = 'Email required';
                break;
            case n === 'email' && t === 'pattern':
                errorAlertText = 'Email invalid';
                break;
            case n === 'password' && t === 'required':
                errorAlertText = 'Password required';
                break;
            case n === 'password' && t === 'pattern':
                errorAlertText = 'Password invalid';
                break;
        }

        return errorAlertText ? <p role="alert" className="sign-in-form__input-error">{errorAlertText}</p> : null
    }

    return (
        <form className="sign-in-form__form" onSubmit={handleSubmit(onSubmit)}>
            <div className="sign-in-form__raw-container">
                <label htmlFor="name" className="sign-in-form__label sign-in-form__label--inline">
                    Name
                    <input {...register("firstName", { required: true, pattern: /^([A-Za-zÑñÁáÉéÍíÓóÚú]+['\-]{0,1}[A-Za-zÑñÁáÉéÍíÓóÚú]+)(\s+([A-Za-zÑñÁáÉéÍíÓóÚú]+['\-]{0,1}[A-Za-zÑñÁáÉéÍíÓóÚú]+))*$/i })} aria-invalid={errors.firstName ? "true" : "false"} id="name" type="text" className="sign-in-form__input" />
                    {errorsHandler("firstName", errors.firstName?.type)}
                </label>
                <label htmlFor="last-name" className="sign-in-form__label sign-in-form__label--inline">
                    Last Name
                    <input {...register("lastName", { required: true, pattern: /^([A-Za-zÑñÁáÉéÍíÓóÚú]+['\-]{0,1}[A-Za-zÑñÁáÉéÍíÓóÚú]+)(\s+([A-Za-zÑñÁáÉéÍíÓóÚú]+['\-]{0,1}[A-Za-zÑñÁáÉéÍíÓóÚú]+))*$/i })} id="last-name" type="text" className="sign-in-form__input" />
                    {errorsHandler("lastName", errors.lastName?.type)}
                </label>
            </div>
            <label htmlFor="nickname" className="sign-in-form__label">
                Nickname
                <input {...register("nickname", { required: true, pattern: /^[a-z0-9_-]{3,16}$/i })} id="nickname" type="text" className="sign-in-form__input" />
                {errorsHandler("nickname", errors.nickname?.type)}
            </label>
            <label htmlFor="email" className="sign-in-form__label">
                Email
                <input {...register("email", { required: true, pattern: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/ })} id="email" type="text" className="sign-in-form__input" />
                {errorsHandler("email", errors.email?.type)}
            </label>
            <label htmlFor="password" className="sign-in-form__label">
                Password
                <input {...register("password", /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&#.$($)$-$_])[A-Za-z\d$@$!%*?&#.$($)$-$_]{8,15}$/)} type="password" id="password" className="sign-in-form__input" />
                {errorsHandler("password", errors.password?.type)}
            </label>
            <button type="submit" className="sign-in-form__submit">Sign up</button>
        </form>
    )
}