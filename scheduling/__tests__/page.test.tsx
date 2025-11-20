import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import Page from '../app/page'
 
describe('Page', () => {
  it('renders a navbar', () => {
    render(<Page />);
 
    expect(screen.getByRole('navigation')).toBeInTheDocument(); 
  });
});