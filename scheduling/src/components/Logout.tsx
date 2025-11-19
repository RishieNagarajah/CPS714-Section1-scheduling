'use client';

import { auth } from "@/lib/firebase";
import { signOut } from "@firebase/auth";
import { LogoutOutlined, LogoutRounded } from "@mui/icons-material";
import { Button } from "@mui/material";

export default function Logout() {  
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <Button className="py-0" color="error" variant="contained" startIcon={<LogoutRounded />} onClick={handleSignOut}>
      Logout
    </Button>
  );

}