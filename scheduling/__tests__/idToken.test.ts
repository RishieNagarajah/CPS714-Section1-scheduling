import '@testing-library/jest-dom';
import { getUidFromRequest } from '@/lib/server/idToken';
import { getAuth } from 'firebase-admin/auth';
import { getAdmin } from '@/lib/firebase/admin';

// Mock dependencies
jest.mock('@/lib/firebase/admin');
jest.mock('firebase-admin/auth');

describe('getUidFromRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns empty string when Authorization header is missing', async () => {
    (getAdmin as jest.Mock).mockReturnValue({
      auth: jest.fn(() => ({
        verifyIdToken: jest.fn(),
      })),
    });

    const request = new Request('http://localhost:3000/api/test', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await getUidFromRequest(request);
    
    expect(result).toBe('');
  });

  it('returns empty string when Authorization header does not contain token', async () => {
    (getAdmin as jest.Mock).mockReturnValue({
      auth: jest.fn(() => ({
        verifyIdToken: jest.fn(),
      })),
    });

    const request = new Request('http://localhost:3000/api/test', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': '', // Empty authorization
      },
    });

    const result = await getUidFromRequest(request);
    
    expect(result).toBe('');
  });

  it('returns empty string when Authorization header does not start with Bearer', async () => {
    (getAdmin as jest.Mock).mockReturnValue({
      auth: jest.fn(() => ({
        verifyIdToken: jest.fn(),
      })),
    });

    const request = new Request('http://localhost:3000/api/test', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic dXNlcjpwYXNz', // Basic auth instead of Bearer
      },
    });

    const result = await getUidFromRequest(request);
    
    expect(result).toBe('');
  });

  it('extracts token and verifies it successfully', async () => {
    const mockVerifyIdToken = jest.fn().mockResolvedValue({
      uid: 'test-user-id',
    });

    (getAuth as jest.Mock).mockReturnValue({
      verifyIdToken: mockVerifyIdToken,
    });

    const request = new Request('http://localhost:3000/api/test', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer valid-jwt-token',
      },
    });

    const result = await getUidFromRequest(request);
    
    expect(result).toBe('test-user-id');
    expect(getAuth).toHaveBeenCalled();
    expect(mockVerifyIdToken).toHaveBeenCalledWith('valid-jwt-token');
  });

  it('returns empty string when token verification fails', async () => {
    const mockVerifyIdToken = jest.fn().mockRejectedValue(new Error('Invalid token'));

    (getAuth as jest.Mock).mockReturnValue({
      verifyIdToken: mockVerifyIdToken,
    });

    const request = new Request('http://localhost:3000/api/test', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer invalid-jwt-token',
      },
    });

    const result = await getUidFromRequest(request);
    
    expect(result).toBe('');
    expect(getAuth).toHaveBeenCalled();
    expect(mockVerifyIdToken).toHaveBeenCalledWith('invalid-jwt-token');
  });

  it('returns empty string when decoded token has no uid', async () => {
    const mockVerifyIdToken = jest.fn().mockResolvedValue({
      // No uid property
      email: 'test@example.com',
    });

    (getAuth as jest.Mock).mockReturnValue({
      verifyIdToken: mockVerifyIdToken,
    });

    const request = new Request('http://localhost:3000/api/test', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer valid-token',
      },
    });

    const result = await getUidFromRequest(request);
    
    expect(result).toBe('');
    expect(getAuth).toHaveBeenCalled();
    expect(mockVerifyIdToken).toHaveBeenCalledWith('valid-token');
  });

  it('handles invalid Authorization header formats', async () => {
    const mockVerifyIdToken = jest.fn().mockResolvedValue({ uid: 'test-uid' });

    (getAuth as jest.Mock).mockReturnValue({
      verifyIdToken: mockVerifyIdToken,
    });

    const request = new Request('http://localhost:3000/api/test', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer   token-with-spaces', // Token with spaces
      },
    });

    const result = await getUidFromRequest(request);
    
    expect(result).toBe('');
    expect(mockVerifyIdToken).not.toHaveBeenCalled();
  });

  it('handles null Authorization header', async () => {
    (getAdmin as jest.Mock).mockReturnValue({
      auth: jest.fn(() => ({
        verifyIdToken: jest.fn(),
      })),
    });

    const request = new Request('http://localhost:3000/api/test', {
      method: 'GET',
      headers: {},
    });

    const result = await getUidFromRequest(request);
    
    expect(result).toBe('');
  });
});