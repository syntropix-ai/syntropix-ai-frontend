import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router";
import 'aos/dist/aos.css'
import AOS from 'aos'

AOS.init({
  duration: 1000,
  easing: 'ease-in-out',
})

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename="/syntropix-ai-frontend">
      <App />
    </BrowserRouter>
  </StrictMode>
);
