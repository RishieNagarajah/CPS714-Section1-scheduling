'use client';

import { useAuth } from "@/contexts/AuthContext";
import { toTitleCase } from "@/helpers";
import { Paper } from "@mui/material";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <main className="container d-flex justify-content-center align-items-center vw-100">
      <Paper elevation={3} variant="outlined" className="d-flex flex-column text-secondary align-items-center p-4 w-50">
        <h2 className="text-dark">Profile</h2>
        <p className="text-dark">{user?.displayName}</p>
        <div className="container justify-content-between w-100">
          <div className="row">
            <strong className="col-6">Email</strong>
            <p className="col">{user?.email}</p>
          </div>
          <div className="row">
            <strong className="col-6">Membership Status</strong>
            <p className="col">{toTitleCase(user?.membershipStatus || 'N/A')}</p>
          </div>
        </div>
      </Paper>
    </main>
  );
}