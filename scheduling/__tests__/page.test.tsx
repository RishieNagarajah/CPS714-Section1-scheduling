import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import Page from '../app/page'
 
describe('Page Component', () => {
  it('renders a navbar', () => {
    render(<Page />);
 
    expect(screen.getByRole('navigation')).toBeInTheDocument(); 
  });
  
  it('renders the available classes section', () => {
    render(<Page />);

    expect(screen.getByText('List of Available Classes')).toBeInTheDocument();
  });

  it('renders the my classes section', () => {
    render(<Page />);
    
    expect(screen.getByText('My Classes')).toBeInTheDocument();
  });
});