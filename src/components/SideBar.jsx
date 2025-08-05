import React from 'react';
import {Link} from "react-router-dom"

function SideBar() {
    const handleHomeClick = () => {
        window.location.reload();
    };

    return (
        <div>
            <h1 style={{ marginBottom: '30px', color: 'white' }}>
                Plan Processing
            </h1>
            <ul>
                <li>
                    <Link to="/PlanProcessing">Home</Link>
                </li>
                <li>
                    <Link to="/PlanProcessing/callout">Callout</Link>
                </li>
            </ul>

            <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px' }}>
                <p style={{ fontSize: '11px', color: '#7f8c8d', textAlign: 'center' }}>
                    © 2025 Plan Processing Tool
                </p>
            </div>
        </div>
    );
}

export default SideBar;
