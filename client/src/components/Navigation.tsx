import * as React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav className="bg-blue-600 text-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-lg font-semibold">
          Apartment Help
        </Link>
        <div className="space-x-4">
          <Link to="/">Home</Link>
          <Link to="/resources">Resources</Link>
          <Link to="/advice">Advice</Link>
          <Link to="/chat">Chat</Link>
          <Link to="/signin">Sign In</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
