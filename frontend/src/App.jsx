import { useState } from 'react'
import './App.css'
import './styles/main.css'
import Navbar from "./components/navbar/Navbar.jsx";
import Footer from "./components/footer/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import RegistrationPage from "./pages/RegistrationPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import CreateFeaturePage from "./pages/CreateFeaturePage.jsx";
import CreateCategoryPage from "./pages/CreateCategoryPage.jsx";
import CreateTagPage from "./pages/CreateTagPage.jsx";
import DocumentationPage from "./pages/DocumentationPage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import CategoriesPage from "./pages/CategoriesPage.jsx";
import EditCategoryPage from "./pages/EditCategoryPage.jsx";

function App() {

  return (
    <div className="App">
        <Router>
            <Navbar/>
            <Routes>

                <Route path="/" element={<HomePage/>}/>
                <Route path="/registration" element={<RegistrationPage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/createFeature" element={<CreateFeaturePage/>}/>
                <Route path="/createCategory" element={<CreateCategoryPage/>}/>
                <Route path="/createTag" element={<CreateTagPage/>}/>
                <Route path="/documentation" element={<DocumentationPage/>}/>
                <Route path="/adminDashboard" element={<AdminDashboardPage/>}/>

                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="categories" element={<CategoriesPage />} />
                    <Route path="categories/createCategory" element={<CreateCategoryPage />} />
                    <Route path="categories/edit/:id" element={<EditCategoryPage />} />


                    {/* Другие админ маршруты */}
                </Route>
            </Routes>
            <Footer/>
        </Router>

    </div>
  )
}

export default App
