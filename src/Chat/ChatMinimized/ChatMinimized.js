import './ChatMinimized.scss';

export default function ChatMinimized() {
    return (
        <div className="chat-minimized">
            <div className="chat-minimized__picture-simulator"></div>
            <div className="chat-minimized__picture chat-minimized__unknown-picture">
                <i className="chat-minimized__unknown-picture-icon bx bx-user"></i>
            </div>
            <div className="chat-minimized__description">
                <p className="chat-minimized__name">Glendys Añez</p>
                <p className="chat-minimized__message">Hey! How're you doing?</p>
            </div>
            <p className="chat-minimized__time">Apr 20, 2021</p>
        </div>
    );
}