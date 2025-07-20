import React from 'react';

function SideBar() {
    const handleHomeClick = () => {
        window.location.reload(); // Простой способ вернуться к начальному состоянию
    };

    return (
        <div>
            <h1 style={{ marginBottom: '30px', color: 'white' }}>
                Plan Processing
            </h1>

            <a
                onClick={handleHomeClick}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#ecf0f1',
                    textDecoration: 'none',
                    padding: '8px 0',
                    cursor: 'pointer',
                    transition: 'color 0.3s ease',
                    borderBottom: '1px solid transparent'
                }}
                onMouseOver={(e) => {
                    e.target.style.color = '#3498db';
                    e.target.style.textDecoration = 'underline';
                }}
                onMouseOut={(e) => {
                    e.target.style.color = '#ecf0f1';
                    e.target.style.textDecoration = 'none';
                }}
            >
                🏠 Home
            </a>

            <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px' }}>
                <p style={{ fontSize: '11px', color: '#7f8c8d', textAlign: 'center' }}>
                    © 2025 Plan Processing Tool
                </p>
            </div>
        </div>
    );
}

export default SideBar;
