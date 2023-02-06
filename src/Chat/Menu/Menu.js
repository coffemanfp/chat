import './Menu.scss';
import profilePhoto from '../../_images/17345794-ecaa-4d2d-a604-b91163dcf693.jpeg';

export default function Menu({ toggleMenu }) {
    return (
        <div className="menu">
            <header className="menu__header">
                <div className="user-info">
                    <div className="user-info__photo-simulator"></div>
                    <img src={profilePhoto} alt="" className="user-info__photo" />
                    <div className="user-info__content">
                        <p className="user-info__name">Glendys Añez</p>
                        <p className="user-info__description">Software Engineer</p>
                        <button className="user-info__edit-button"><i className="user-info__edit-icon bx bx-edit-alt"></i></button>
                    </div>
                </div>
            </header>
            <ul className="menu__list">
                <li className="menu__item">
                    <i className="menu__item-icon bx bx-bookmark"></i>
                    <p className="menu__item-name">Saved Messages</p>
                </li>
                <li className="menu__item">
                    <i className="menu__item-icon bx bx-user"></i>
                    <p className="menu__item-name">Contacts</p>
                </li>
                <li className="menu__item">
                    <i className="menu__item-icon bx bx-archive-in"></i>
                    <p className="menu__item-name">Archivated Chats</p>
                </li>
                <li className="menu__item">
                    <i className="menu__item-icon bx bx-plus"></i>
                    <p className="menu__item-name">Create new...</p>
                </li>
                <li className="menu__item">
                    <i className="menu__item-icon bx bx-moon"></i>
                    <p className="menu__item-name">Dark Theme</p>
                </li>
                <li className="menu__item">
                    <i className="menu__item-icon bx bx-cog"></i>
                    <p className="menu__item-name">Settings</p>
                </li>
            </ul>
        </div>
    )
}