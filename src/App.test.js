import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders Mirror Me heading', () => {
  render(<App />);
  const linkElement = screen.getByText(/Mirror Me/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders authentication form by default', () => {
  render(<App />);
  const authElement = screen.getByText(/Welcome Back/i);
  expect(authElement).toBeInTheDocument();
});