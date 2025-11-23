import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import NavigationBar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { toTitleCase } from '@/helpers';

// Mock dependencies
jest.mock('@/contexts/AuthContext');
jest.mock('@/helpers');

const mockUser = {
  uid: 'test-user-id',
  email: 'test@example.com',
  displayName: 'John Doe',
  membershipStatus: 'premium',
};

describe('Navbar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: null });
    (toTitleCase as jest.Mock).mockImplementation((str: string) =>
      str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
    );
  });

  it('renders navigation bar with brand', () => {
    render(<NavigationBar />);

    expect(screen.getByText('FitHub Scheduling')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('displays user display name when user is authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

    render(<NavigationBar />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('displays "Unnamed" when user has no display name', () => {
    const userWithoutDisplayName = { ...mockUser, displayName: null };
    (useAuth as jest.Mock).mockReturnValue({ user: userWithoutDisplayName });

    render(<NavigationBar />);

    expect(screen.getByText('Unnamed')).toBeInTheDocument();
  });

  it('displays membership status when user is authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

    render(<NavigationBar />);

    expect(screen.getByText('Premium')).toBeInTheDocument();
    expect(toTitleCase).toHaveBeenCalledWith('premium');
  });

  it('displays membership status in title case', () => {
    const userWithMixedCase = { ...mockUser, membershipStatus: 'STANDARD' };
    (useAuth as jest.Mock).mockReturnValue({ user: userWithMixedCase });

    render(<NavigationBar />);

    expect(toTitleCase).toHaveBeenCalledWith('STANDARD');
    expect(screen.getByText('Standard')).toBeInTheDocument();
  });

  it('renders Logout component', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

    render(<NavigationBar />);

    // Check if Logout button is rendered
    expect(screen.getByText('Logout')).toHaveRole('button');
  });

  it('displays correct navigation links', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

    render(<NavigationBar />);

    expect(screen.getByText('John Doe')).toHaveAttribute('href', '/profile');
    expect(screen.getByText('Premium')).toHaveAttribute('href', '/membership');
  });

  it('works with different membership statuses', () => {
    const testCases = ['basic', 'standard', 'premium', 'enterprise'];

    testCases.forEach(status => {
      const userWithStatus = { ...mockUser, membershipStatus: status };
      (useAuth as jest.Mock).mockReturnValue({ user: userWithStatus });

      const { unmount } = render(<NavigationBar />);
      expect(screen.getByText(status.charAt(0).toUpperCase() + status.slice(1))).toBeInTheDocument();
      unmount();
    });
  });
});