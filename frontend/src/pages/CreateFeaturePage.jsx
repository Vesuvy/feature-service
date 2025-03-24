import "./createFeaturePage.css"

const CreateFeaturePage = () => {
    return (
        <form className="form-container">
            <h3>Добавить фичу</h3>

            <div className="form-group">
                <label>Название</label>
                <input type="text" className="form-input" />
            </div>

            <div className="form-group">
                <label>Описание</label>
                <textarea className="form-input" />
            </div>

            <div className="form-group">
                <label>Категория</label>
                <select className="form-select">
                    <option>Выберите категорию</option>
                </select>
            </div>

            <button type="submit" className="btn_add">
                Добавить
            </button>
        </form>
    )
}

export default CreateFeaturePage;