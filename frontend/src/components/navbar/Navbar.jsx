import "./style.css"

function Navbar() {
    return (
        <nav className="nav">
            <div className="container">
                <div className="nav-row">
                    <a href="" className="logo"><strong>FT</strong> Сервис</a>

                    <ul className="nav-list">
                        <li className="nav-list__item"><a href="#!" className="nav-list__link">Главная</a></li>
                        <li className="nav-list__item"><a href="#!" className="nav-list__link">Документация</a></li>
                        <li className="nav-list__item"><a href="#!" className="nav-list__link">Регистрация</a></li>
                        <li className="nav-list__item"><a href="#!" className="nav-list__link">Вход</a></li>
                    </ul>

                </div>
            </div>
        </nav>
    )
}

export default Navbar;