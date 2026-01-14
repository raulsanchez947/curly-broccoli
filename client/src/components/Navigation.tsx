import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

function Navigation() {
  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-blue-600">
            Apartment Help
          </Link>
           <div className="flex gap-4">
             <Button variant="ghost" asChild>
               <Link to="/">Home</Link>
             </Button>
             <Button variant="ghost" asChild>
               <Link to="/resources">Resources</Link>
             </Button>
             <Button variant="ghost" asChild>
               <Link to="/advice">Advice</Link>
             </Button>
             <Button variant="ghost" asChild>
               <Link to="/chat">Chat</Link>
             </Button>
           </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
