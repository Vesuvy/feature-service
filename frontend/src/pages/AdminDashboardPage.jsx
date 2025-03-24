import "./adminDashboardPage.css"

const AdminDashboardPage = () => (
    <div className="container">
        <h2>Панель управления</h2>
        <button className="btn" onClick={handleAnalytics}>
            Аналитика
        </button>

        <div className="content__grid">
            <FeatureList features={features} />
            <CategoryList categories={categories} />
            <TagList tags={tags} />
        </div>

        <button className="btn" onClick={handleAdd}>
            +
        </button>
    </div>
);

export default AdminDashboardPage;