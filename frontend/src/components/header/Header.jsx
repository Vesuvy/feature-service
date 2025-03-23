import "./style.css"

const Header = () => {
    return (
        <header className="header">
            <div className="header__wrapper">
                <h1 className="header__title">
                    <strong>
                        Привет! Это feature toggle сервис.
                    </strong>
                    <br/> github: VESUVY
                </h1>
                <div className="header_text">
                    <p>Этот сервис предназначен для....</p>
                </div>

                <a href="#!" className="btn">
                    Начать
                </a>
            </div>

        </header>
    )
}

export default Header;