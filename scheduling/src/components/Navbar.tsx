'use client';

import { Navbar, Container, Nav } from 'react-bootstrap';
import Logout from '@/components/Logout';
import { useAuth } from '@/contexts/AuthContext';

export default function NavigationBar() {
  const { user } = useAuth();
  console.log('Current user:', user);

  return (
    <Navbar bg="dark" variant="dark" fixed="top" expand="lg">
      <Container fluid>
        <Navbar.Brand href='/'>FitHub Scheduling</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/profile">{user?.displayName || "Unnamed"}</Nav.Link>
            <Nav.Link href="/membership">Premium Member</Nav.Link>
            <Logout />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}