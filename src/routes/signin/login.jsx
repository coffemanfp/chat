export default function Login() {
    return (
        <>
            <form className="sign-in-form__form">
                <label htmlFor="email" className="sign-in-form__label">
                    Email
                    <input id="email" type="text" className="sign-in-form__input" />
                </label>
                <label htmlFor="password" className="sign-in-form__label">
                    Password
                    <input type="password" id="password" className="sign-in-form__input" />
                </label>
                <button type="submit" className="sign-in-form__submit">Login</button>
            </form>
        </>
    )
}