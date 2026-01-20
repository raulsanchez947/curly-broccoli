import * as React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Apartment Help & Resources</h1>
      <p className="mb-6">Find resources and advice for apartment hunting.</p>
      <div className="flex gap-4 justify-center">
        <Link className="px-4 py-2 bg-blue-600 text-white rounded" to="/resources">Resources</Link>
        <Link className="px-4 py-2 bg-gray-200 rounded" to="/advice">Advice</Link>
        <Link className="px-4 py-2 bg-gray-200 rounded" to="/chat">Chat</Link>
      </div>
    </div>
  );
}

export default HomePage;
