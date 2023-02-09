import './MessageInput.scss';

export default function MessageInput() {
    return (
        <form className="message-input-form">
            <input type="text" className="message-input-form__input" placeholder='Message' />
        </form>
    )
}