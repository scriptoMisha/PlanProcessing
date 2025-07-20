import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import SideBar from './components/SideBar.jsx'
import App from './App.jsx'
import Preview from "./components/Preview.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App/>
    </StrictMode>,
)
