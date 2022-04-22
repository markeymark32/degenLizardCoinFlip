import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { login, logout } from '../utils';

const LizardNav = (props) => {
        return (
            <div id="nav">
                <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" >
                <Container>
                    <Navbar.Brand href="#">
                        <img className="logo_degen" alt="Degen_Logo" src={props.logo} />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <div className="ml-auto">
                        <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                            <Nav className="me-auto" style={{ maxHeight: '100px' }}>
                                <Nav.Link href="/" style={{color: "#23ce6b"}}>Coinflip</Nav.Link>
                                <Nav.Link href="/Leaderboard" style={{ color: "#ffffff"}}>Leaderboard</Nav.Link>
                            </Nav>
                            <div className="cta-1">
                            {window.walletConnection.isSignedIn() && (
                                <Button style={{ background: "#23ce6b"}} variant="secondary" size="sm" onClick={logout}><b>{window.accountId}</b></Button>  
                            )}
                            {!window.walletConnection.isSignedIn() && (
                                <Button style={{ background: "#23ce6b"}} variant="secondary" size="sm" onClick={login}><b>Connect Wallet</b></Button>
                            )}</div>
                        </Navbar.Collapse>
                    </div>
                </Container>
                </Navbar>
            </div>
        )
    }
export default LizardNav;