import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DocumentationPage from './pages/DocumentationPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      {/* Skip link for keyboard users */}
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/documentation" element={<DocumentationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
