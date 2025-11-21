import { initializeApp, cert, getApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import serviceAccount from '@/lib/firebase/fithub-classes-firebase-adminsdk-fbsvc-da99288063.json';

if (getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount as object),
  });
}

const app = getApp()

export function getAdmin() {
  return app;
}

export const adminAuth = getAuth(app);