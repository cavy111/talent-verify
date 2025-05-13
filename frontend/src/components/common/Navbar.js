import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { logout } from '../api/auth';


const Navbar = () => {
    const navigate = useNavigate();
    const { currentUser, setCurrentUser } = useContext(AuthContext);

    const handleLogout = async () => {
        try {
            await logout();
            setCurrentUser(null);
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return(
        <BootstrapNavbar bg="dark" variant='dark' expand="lg">
            <Container>
                <BootstrapNavbar.Brand as={Link} to="/">Talent Verify</BootstrapNavbar.Brand>
                <BootstrapNavbar.Toggle aria-controls="navbar-nav" />
                <BootstrapNavbar.Collapse id="navbar-nav">
                    <Nav className='me-auto'>
                        <Nav.Link as={Link} to='/'>Dashboard</Nav.Link>
                        <Nav.Link as={Link} to='/companies'>Companies</Nav.Link>
                        <Nav.Link as={Link} to='/employees'>Employees</Nav.Link>
                        {/* Show bulk upload only for admin and company users */}
                        {currentUser && ['admin','company'].includes(currentUser.user_type) && 
                        (
                            <Nav.Link as={Link} to='/bulk-upload'>Bulk Upload</Nav.Link>
                        )
                        }
                    </Nav>

                    {currentUser && (
                        <Nav>
                            <Nav.Item className='d-flex align-items-center text-light me-3'>
                                {currentUser.username}
                            </Nav.Item>
                            <Button variant="outline-light" onClick={handleLogout}>
                                Logout
                            </Button>
                        </Nav>
                    )}

                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>

    )

}

export default Navbar;