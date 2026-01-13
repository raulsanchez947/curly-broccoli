import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">Apartment Help & Resources</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Find the resources and advice you need to successfully navigate apartment hunting and rental decisions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card className="p-8 hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-bold mb-3">Resources</h2>
          <p className="text-gray-600 mb-6">
            Explore a comprehensive collection of tools, guides, and references to help with your apartment search.
          </p>
          <Button asChild className="w-full">
            <Link to="/resources">Browse Resources</Link>
          </Button>
        </Card>

        <Card className="p-8 hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-bold mb-3">Advice</h2>
          <p className="text-gray-600 mb-6">
            Get expert tips and advice from experienced people who have gone through the apartment hunting process.
          </p>
          <Button asChild className="w-full">
            <Link to="/advice">Read Advice</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}

export default HomePage;
