import '@testing-library/jest-dom';

jest.mock('@/lib/firebase', () => ({
  auth: {},
  firestore: {},
  app: {},
}));

jest.mock('@firebase/auth', () => ({
  signOut: jest.fn(),
  getAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));