import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import "preline/preline";
import { IStaticMethods } from "preline/preline";
import { useLocation } from 'react-router-dom';
import Footer from './components/UI/Footer';
import Header from './components/UI/Header';
import Auth from './pages/Main/auth';
import Main from './pages/Main/main';
import Team from './pages/Main/team';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InputTextArea from './components/Agent/InputTextArea';
import Flow from './components/Agent/Flow';

function App() {
  const [count, setCount] = useState(0)

  const location = useLocation();

  useEffect(() => {
    window.HSStaticMethods?.autoInit();
  }, [location.pathname]);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/products" element={<Main />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/teams" element={<Team />} />
        <Route path="/services" element={<Main />} />
        <Route path="/blog" element={<Flow />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App
