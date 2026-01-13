import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import ResourcesPage from './pages/ResourcesPage';
import AdvicePage from './pages/AdvicePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/advice" element={<AdvicePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
