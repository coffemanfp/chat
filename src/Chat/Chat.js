import "./Chat.scss";
import Search from './Search/Search';
import ChatMinimized from "./ChatMinimized/ChatMinimized";
import Conversation from "./Conversation/Conversation";
import MessageInput from "./MessageInput/MessageInput";
import Menu from "./Menu/Menu";
import { useState } from "react";

export default function Chat() {
    const [isMenuActive, setIsMenuActive] = useState(false);
    const toggleMenu = () => {
        setIsMenuActive(!isMenuActive);
    }

    return (
        <div className="chat">
            <div className="aside-simulator"></div>
            <aside className="aside">
                <button className="aside__menu-button" onClick={toggleMenu}>
                    <i className="bx bx-menu-alt-left"></i>
                </button>
                {isMenuActive ?
                    <Menu />
                    : <>
                        <header className="aside__header">
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
                    </>
                }
            </aside>
            <main className="main">
                <Conversation />
                <MessageInput />
            </main>
        </div>
    )
}