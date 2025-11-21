'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import { auth, firestore } from '@/lib/firebase';
import { collection, doc, getDoc } from 'firebase/firestore';

type CustomUser = User & {
  membershipStatus?: string;
};

type AuthContextType = {
  user: CustomUser | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Redirect to login if not authenticated
      if (!user && pathname !== '/login') {
        router.push('/login');
      }

      if (user) {
        getDoc(doc(collection(firestore, 'users'), user?.uid)).then((docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const customUser = user as CustomUser;
            customUser.membershipStatus = data.membershipStatus;
            setUser(customUser);
          } else {
            setUser(user);
          }
          setLoading(false);
        });
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);


  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user && pathname !== '/login') {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);