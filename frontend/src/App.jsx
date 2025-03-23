import { useState } from 'react'
import './App.css'
import './styles/main.css'
import Navbar from "./components/navbar/Navbar.jsx";
import Footer from "./components/footer/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";

function App() {

  return (
    <div className="App">
        <Navbar/>

        <HomePage/>

        <Footer/>

    </div>
  )
}

export default App
