import './Message.scss';

export default function Message({ isOwn }) {
    return (
        <div className={`message${isOwn ? ' message--own': ' message--sent'}`}>
            <p className="message__text">Hey! How're you doing?</p>
            <p className="message__time">12:30 AM</p>
        </div>
    )
}