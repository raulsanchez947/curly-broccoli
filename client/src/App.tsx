import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import ResourcesPage from './pages/ResourcesPage';
import AdvicePage from './pages/AdvicePage';
import ChatPage from './pages/ChatPage';
import SignInPage from './pages/SignInPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-black">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/advice" element={<AdvicePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/signin" element={<SignInPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
