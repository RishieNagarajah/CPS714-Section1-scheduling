import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { auth, firestore } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import { collection, getDoc } from 'firebase/firestore';

// Mock dependencies
jest.mock('@/lib/firebase');
jest.mock('firebase/auth');
jest.mock('next/navigation');

const mockUser = {
  uid: 'test-user-id',
  email: 'test@example.com',
  displayName: 'Test User',
} as User & { membershipStatus?: string };

const mockRouter = {
  push: jest.fn(),
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (usePathname as jest.Mock).mockReturnValue('/');
    (onAuthStateChanged as jest.Mock).mockImplementation((_, callback) => {
      // Immediately call callback with null user for initial render
      setTimeout(() => callback(null), 0);
      return jest.fn();
    });
    (getDoc as jest.Mock).mockResolvedValue({
      exists: jest.fn(() => false),
    });
  });

  it('redirects to "/login" when no user is authenticated', async () => {
    const TestComponent = () => {
      const auth = useAuth();
      return (
        <div>
          <span data-testid="user">{auth.user?.email || 'null'}</span>
          <span data-testid="loading">{auth.loading.toString()}</span>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });
  });

  it('shows loading when loading is true', () => {
    (auth.onAuthStateChanged as jest.Mock).mockImplementation(() => {
      // Never call the callback to keep loading state
      return jest.fn();
    });

    render(
      <AuthProvider>
        <div>Content</div>
      </AuthProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders children when user is authenticated', async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((_, callback) => {
      setTimeout(() => callback(mockUser as User), 0);
      return jest.fn();
    });
    (getDoc as jest.Mock).mockResolvedValue({
      exists: jest.fn(() => true),
      data: jest.fn(() => ({ membershipStatus: 'premium' })),
    });

    render(
      <AuthProvider>
        <div>Authenticated Content</div>
      </AuthProvider>
    );

    await screen.findByText('Authenticated Content');
  });

  it('loads user data from Firestore when user is authenticated', async () => {
    const userDocData = { membershipStatus: 'premium' };
    (onAuthStateChanged as jest.Mock).mockImplementation((_, callback) => {
      setTimeout(() => callback(mockUser as User), 0);
      return jest.fn();
    });
    (getDoc as jest.Mock).mockResolvedValue({
      exists: jest.fn(() => true),
      data: jest.fn(() => userDocData),
    });

    const TestComponent = () => {
      const auth = useAuth();
      return (
        <div>
          <span data-testid="membership">{auth.user?.membershipStatus || 'none'}</span>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await screen.findByText('premium');
    expect(collection).toHaveBeenCalledWith(firestore, 'users');
  });

  it('handles Firestore errors gracefully', async () => {
    console.error = jest.fn(); // Suppress console.error

    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      setTimeout(() => callback(mockUser as User), 0);
      return jest.fn();
    });
    (getDoc as jest.Mock).mockRejectedValue(new Error('Firestore error'));

    const TestComponent = () => {
      const auth = useAuth();
      return (
        <div>
          <span data-testid="user-id">{auth.user?.uid || 'none'}</span>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching user data:', expect.any(Error));
    });
  });

  it('stops loading after user data is loaded', async () => {
    const TestComponent = () => {
      const auth = useAuth();
      return (
        <div>
          <span data-testid="loading">{auth.loading.toString()}</span>
        </div>
      );
    };

    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      setTimeout(() => callback(mockUser as User), 10);
      return jest.fn();
    });
    (getDoc as jest.Mock).mockResolvedValue({
      exists: jest.fn(() => true),
      data: jest.fn(() => ({ membershipStatus: 'premium' })),
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Initially loading should be true during auth check
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // After user data is loaded, loading should be false
    await waitFor(() => screen.findByText('false'));
  });

  it('cleans up auth state listener on unmount', () => {
    const unsubscribe = jest.fn();
    (onAuthStateChanged as jest.Mock).mockReturnValue(unsubscribe);

    const { unmount } = render(
      <AuthProvider>
        <div>Test</div>
      </AuthProvider>
    );

    unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });
});