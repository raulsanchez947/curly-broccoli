import { render, screen } from '@testing-library/react';
import HomePage from './pages/HomePage';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

test('renders homepage heading', () => {
  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );
  expect(screen.getByText(/Apartment Help & Resources|Apartment Help/i)).toBeTruthy();
});
