import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '@/components/Login';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { FirebaseError } from 'firebase/app';

// Mock Firebase functions
jest.mock('firebase/auth');
jest.mock('firebase/app');
jest.mock('next/navigation');
jest.mock('@/lib/firebase');

const mockRouter = {
  push: jest.fn(),
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (updateProfile as jest.Mock).mockResolvedValue({});
  });

  it('renders login form with sign in tab selected by default', () => {
    render(<Login />);

    expect(screen.getAllByRole('tab', { name: /sign in/i })
      .some(elem => elem.getAttribute("tabindex") === "0"))
      .toBe(true);
  });

  it('switches to sign up tab when clicked', () => {
    render(<Login />);

    const signUpTab = screen.getAllByRole('tab', { name: /sign up/i })
      .filter(elem => elem.getAttribute("aria-controls") === "login-tabpanel-1")[0];
    fireEvent.click(signUpTab);

    expect(screen.getAllByRole('tab', { name: /sign up/i })
      .some(elem => elem.getAttribute("tabindex") === "0"))
      .toBe(true);
  });

  describe('Form Validation', () => {
    it('requires non empty values for fields in sign in', async () => {
      render(<Login />);

      expect(screen.getByLabelText(/Email Address/)).toBeRequired();
      expect(screen.getByLabelText(/Password/)).toBeRequired();
    });

    it('shows validation errors for invalid email format', async () => {
      render(<Login />);

      const emailInput = screen.getByLabelText(/Email Address/);
      const passwordInput = screen.getByLabelText(/Password/);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Email is invalid')).toBeInTheDocument();
      });
    });

    it('shows validation errors for short password', async () => {
      render(<Login />);

      const emailInput = screen.getByLabelText(/Email Address/);
      const passwordInput = screen.getByLabelText(/Password/);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@test.test' } });
      fireEvent.change(passwordInput, { target: { value: '12345' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
      });
    });

    it('requires non empty values for fields in sign up', async () => {
      render(<Login />);

      const signUpTab = screen.getByRole('tab', { name: /sign up/i });
      fireEvent.click(signUpTab);

      expect(screen.getByLabelText(/Full Name/)).toBeRequired();
      expect(screen.getByLabelText(/Email Address/)).toBeRequired();
      expect(screen.getByLabelText(/^Password/)).toBeRequired();
      expect(screen.getByLabelText(/Confirm Password/)).toBeRequired();
    });

    it('shows validation error for password mismatch in sign up', async () => {
      render(<Login />);

      const signUpTab = screen.getByRole('tab', { name: /sign up/i });
      fireEvent.click(signUpTab);

      const nameInput = screen.getByLabelText(/Full Name/);
      const emailInput = screen.getByLabelText(/Email Address/);
      const passwordInput = screen.getByLabelText(/^Password/);
      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'different-password' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      });
    });
  });

  describe('Authentication Flow', () => {
    it('successfully signs in with valid credentials', async () => {
      render(<Login />);

      const emailInput = screen.getByLabelText(/Email Address/);
      const passwordInput = screen.getByLabelText(/Password/);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
          expect.any(Object),
          'test@example.com',
          'password123'
        );
        expect(mockRouter.push).toHaveBeenCalledWith('/');
      });
    });

    it('successfully signs up with valid credentials', async () => {
      render(<Login />);

      const signUpTab = screen.getByText('Sign Up');
      fireEvent.click(signUpTab);

      const nameInput = screen.getByLabelText(/Full Name/);
      const emailInput = screen.getByLabelText(/Email Address/);
      const passwordInput = screen.getByLabelText(/^Password/);
      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
          expect.any(Object),
          'test@example.com',
          'password123'
        );
        expect(updateProfile).toHaveBeenCalledWith(
          { uid: 'test-uid', getIdToken: expect.any(Function) },
          { displayName: 'John Doe' }
        );
        expect(mockRouter.push).toHaveBeenCalledWith('/');
      });
    });

    it('shows loading state during authentication', async () => {
      // Mock a slow response
      (signInWithEmailAndPassword as jest.Mock).mockImplementation(() =>
        new Promise(resolve => setTimeout(resolve, 100))
      );

      render(<Login />);

      const emailInput = screen.getByLabelText(/Email Address/);
      const passwordInput = screen.getByLabelText(/Password/);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      expect(screen.getByText('Processing...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();

      await waitFor(() => {
        expect(screen.getByText('Sign In')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('handles "invalid email or password" error', async () => {
      const error = new FirebaseError('Invalid credentials', 'auth/invalid-credential');
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(error);

      render(<Login />);

      const emailInput = screen.getByLabelText(/Email Address/);
      const passwordInput = screen.getByLabelText(/Password/);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
      });
    });

    it('handles "email already in use" error', async () => {
      const error = new FirebaseError('Email already in use', 'auth/email-already-in-use');
      (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(error);

      render(<Login />);

      const signUpTab = screen.getByRole('tab', { name: /sign up/i });
      fireEvent.click(signUpTab);

      const nameInput = screen.getByLabelText(/Full Name/);
      const emailInput = screen.getByLabelText(/Email Address/);
      const passwordInput = screen.getByLabelText(/^Password/);
      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('An account with this email already exists')).toBeInTheDocument();
      });
    });

    it('handles unknown errors', async () => {
      const error = new FirebaseError('Unknown error', 'auth/unknown-error');
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(error);

      render(<Login />);

      const emailInput = screen.getByLabelText(/Email Address/);
      const passwordInput = screen.getByLabelText(/Password/);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('An error occurred. Please try again.')).toBeInTheDocument();
      });
    });
  });

  // describe('Password Visibility Toggle', () => {
  //   it('toggles password visibility', () => {
  //     render(<Login />);

  //     const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
  //     const toggleButton = screen.getByLabelText('toggle password visibility');

  //     expect(passwordInput.type).toBe('password');

  //     fireEvent.click(toggleButton);
  //     expect(passwordInput.type).toBe('text');

  //     fireEvent.click(toggleButton);
  //     expect(passwordInput.type).toBe('password');
  //   });

  //   it('toggles confirm password visibility in sign up', () => {
  //     render(<Login />);

  //     const signUpTab = screen.getByText('Sign Up');
  //     fireEvent.click(signUpTab);

  //     const confirmPasswordInput = screen.getByLabelText('Confirm Password') as HTMLInputElement;
  //     const toggleButton = screen.getByLabelText('toggle confirm password visibility');

  //     expect(confirmPasswordInput.type).toBe('password');

  //     fireEvent.click(toggleButton);
  //     expect(confirmPasswordInput.type).toBe('text');

  //     fireEvent.click(toggleButton);
  //     expect(confirmPasswordInput.type).toBe('password');
  //   });
  // });
});