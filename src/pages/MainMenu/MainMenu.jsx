import React from 'react';
import './MainMenu.css';

const MainMenu = ({ onNavigate }) => {
  return (
    <div className="main-menu-container">
      <div className="main-menu">
        <h1 className="menu-title">Generators Without Number</h1>
        <div className="menu-options">
          <button 
            className="menu-option"
            onClick={() => onNavigate('ruins')}
          >
            🏰 Ruins
          </button>
          <button 
            className="menu-option"
            onClick={() => onNavigate('monsters')}
          >
            👹 Monsters
          </button>
          <button 
            className="menu-option"
            onClick={() => onNavigate('items')}
          >
            ⚔️ Items
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
