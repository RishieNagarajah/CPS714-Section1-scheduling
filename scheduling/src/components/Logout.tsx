'use client';

import { auth } from "@/lib/firebase";
import { signOut } from "@firebase/auth";
import { LogoutRounded } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Logout() {  
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
      router.push('/login');
    } catch (error) {
      alert('Error signing out. Please check console.');
      console.error('Sign out error:', error);
    }
  };

  return (
    <Button className="py-0" color="error" variant="contained" startIcon={<LogoutRounded />} onClick={handleSignOut}>
      Logout
    </Button>
  );

}