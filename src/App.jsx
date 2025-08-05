import {BrowserRouter, Routes, Route} from "react-router-dom";
import './App.css';
import SideBar from "./components/SideBar.jsx";
import Page from "./components/Page.jsx";


function App() {
    return (
        <BrowserRouter>
            <div className="app-container">
                <aside className="sidebar">
                    <SideBar/>
                </aside>

                <div className="content-container">
                    <Routes>
                        <Route path ="/PlanProcessing" element={<Page pageNumber = {1} />} />

                        <Route path = "/PlanProcessing/callout" element={<Page pageNumber={2}/>} />
                    </Routes>

                </div>
            </div>
        </BrowserRouter>

    );
}

export default App;