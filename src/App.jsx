import React, { useState } from 'react';
import RoomGenerator from './components/RoomGenerator';
import MainMenu from './components/MainMenu';
import MonstersPage from './components/MonstersPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('menu');

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleBackToMenu = () => {
    setCurrentPage('menu');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'ruins':
        return <RoomGenerator onBack={handleBackToMenu} />;
      case 'monsters':
        return <MonstersPage onBack={handleBackToMenu} />;
      case 'menu':
      default:
        return <MainMenu onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="App">
      {renderCurrentPage()}
    </div>
  );
}

export default App;
