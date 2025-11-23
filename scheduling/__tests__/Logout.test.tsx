import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Logout from '@/components/Logout';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('firebase/auth');
jest.mock('next/navigation');
jest.mock('@/lib/firebase');

const mockRouter = {
  push: jest.fn(),
};

describe('Logout Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (signOut as jest.Mock).mockResolvedValue({});
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('renders logout button with icon', () => {
    render(<Logout />);
    
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();
    expect(logoutButton.querySelector('svg')).toBeInTheDocument(); // Check for icon presence
  });

  it('calls signOut when button is clicked', async () => {
    render(<Logout />);
    
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);
    
    await waitFor(() => {
      expect(signOut).toHaveBeenCalledTimes(1);
    });
  });

  it('navigates to login page after successful logout', async () => {
    render(<Logout />);
    
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);
    
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });
  });

  it('handles signOut errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation();
    
    const error = new Error('Sign out failed');
    (signOut as jest.Mock).mockRejectedValue(error);
    
    render(<Logout />);
    
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);
    
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Sign out error:', error);
      expect(window.alert).toHaveBeenCalledWith('Error signing out. Please check console.');
    });
    
    consoleErrorSpy.mockRestore();
    alertSpy.mockRestore();
  });

  it('does not navigate on signOut error', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    (signOut as jest.Mock).mockRejectedValue(new Error('Sign out failed'));
    
    render(<Logout />);
    
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);
    
    await waitFor(() => {
      expect(signOut).toHaveBeenCalled();
    });
    
    expect(mockRouter.push).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});