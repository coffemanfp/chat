import './Search.scss';

export default function Search() {
    return (
        <form className="search">
            <input type="text" className="search__input" placeholder="Search..." />
            <button type="submit" className="search__submit">
                <i className="search__icon bx bx-search" name="search"></i>
            </button>
        </form>
    )
}