import React from 'react';
import './MonstersPage.css';

const MonstersPage = ({ onBack }) => {
  return (
    <div className="monsters-page">
      <header className="monsters-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Menu
        </button>
        <h1>👹 Monster Generator</h1>
        <p>Generate randomized monsters and encounters</p>
      </header>

      <div className="monsters-content">
        <div className="coming-soon">
          <h2>🚧 Coming Soon</h2>
          <p>Monster generation features will be added here.</p>
        </div>
      </div>
    </div>
  );
};

export default MonstersPage;
