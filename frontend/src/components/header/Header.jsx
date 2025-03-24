import "./style.css"
import { Link } from "react-router-dom";

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

                <Link to="/auth" className="btn">Регистрация / Вход</Link>
            </div>



        </header>
    )
}

export default Header;