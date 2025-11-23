import '@testing-library/jest-dom';
const mockAuth = {
  currentUser: null as (object | null),
  signInWithEmailAndPassword: jest.fn((_, email: string, password: string) => {
    if (email === 'test@example.com' && password === 'password123') {
      mockAuth.currentUser = { uid: "test-uid", getIdToken: jest.fn() };
      return Promise.resolve({
        user: { uid: "test-uid", email, password },
      });
    } else {
      return Promise.reject(new Error('Invalid credentials'));
    }
  }),
  createUserWithEmailAndPassword: jest.fn((_, email: string, password: string) => {
    mockAuth.currentUser = { uid: "test-uid", getIdToken: jest.fn() };
    return Promise.resolve({
      user: { uid: "test-uid", email, password },
    });
  }),
  signOut: jest.fn(() => {
    mockAuth.currentUser = null;
    return Promise.resolve();
  }),
  onAuthStateChanged: jest.fn(),
}

// Mock Firebase
jest.mock('@/lib/firebase', () => {
  return {
    auth: mockAuth,
    firestore: {
      collection: jest.fn(),
      doc: jest.fn(),
    },
  }
});

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: mockAuth.signInWithEmailAndPassword,
  createUserWithEmailAndPassword: mockAuth.createUserWithEmailAndPassword,
  signOut: mockAuth.signOut,
  onAuthStateChanged: jest.fn(),
  updateProfile: jest.fn(),
  getIdToken: jest.fn(),
}));

jest.mock('firebase/app', () => ({
  FirebaseError: class extends Error {
    code: string;
    constructor(message: string, code: string) {
      super(message);
      this.code = code;
      this.name = 'FirebaseError';
    }
  },
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

// Mock Firebase Admin Auth
jest.mock('firebase-admin/auth', () => ({
  getAuth: jest.fn(),
  verifyIdToken: jest.fn(),
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
  usePathname: jest.fn(() => '/'),
}));

// Global test utilities
global.fetch = jest.fn(() => {
  return Promise.resolve(
    new Response(JSON.stringify({}))
  );
});

global.alert = jest.fn();

// Silence console errors during tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};
