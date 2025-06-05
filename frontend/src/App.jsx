import { useState } from 'react'
import './App.css'
import './styles/main.css'

import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

import Navbar from "./components/navbar/Navbar.jsx";
import Footer from "./components/footer/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import RegistrationPage from "./pages/RegistrationPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import SwaggerPage from "./pages/SwaggerPage.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";

function App() {

  return (
    <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Router>
            <Navbar/>
            <main style={{ flex: 1 }}>
            <Routes>
                <Route path='/api/v1/*'>
                  <Route path="" element={<HomePage/>}/>
                  <Route path="registration" element={<RegistrationPage/>}/>
                  <Route path="login" element={<LoginPage/>}/>

                  <Route path="docs" element={<SwaggerPage />} />

                  <Route path="admin/*" element={<AdminLayout />}>
                      
                      <Route path="dashboard" element={<AdminDashboardPage/>}/>

                      <Route path="analytics" element={<AnalyticsPage />} />
                      
                  </Route>                
                </Route>
                
            </Routes>
            </main>
            <Footer/>
        </Router>

    </div>
  )
}

export default App
