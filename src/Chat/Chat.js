import "./Chat.scss";
import Search from './Search/Search';
import ChatMinimized from "./ChatMinimized/ChatMinimized";
import Conversation from "./Conversation/Conversation";
import MessageInput from "./MessageInput/MessageInput";

export default function Chat() {
    return (
        <div className="chat">
            <div className="aside-simulator"></div>
            <aside className="aside">
                <header className="aside__header">
                    <button className="aside__menu-button">
                        <i className="bx bx-menu-alt-left"></i>
                    </button>
                    <Search />
                </header>
                <div className="aside__chats-minimized">
                    <ChatMinimized />
                    <ChatMinimized />
                    <ChatMinimized />
                    <ChatMinimized />
                    <ChatMinimized />
                    <ChatMinimized />
                </div>
            </aside>
            <main className="main">
                <Conversation />
                <MessageInput />
            </main>
        </div>
    )
}