import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { useNear } from "../near";
import { FaBars } from "react-icons/fa";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1
    }
  }));

const LizardNav = (props) => {
    const near = useNear();
    const classes = useStyles();
        return (
            <div id="nav">
                <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" >
                <Container>
                    <div
                    className={`btn-toggle ${classes.menuButton}`}
                    onClick={() => props.handleToggleSidebar(true)}
                    >
                    <FaBars />
                    </div>
                    <Navbar.Brand href="#">
                        <img className="logo_degen" alt="Degen_Logo" src={props.logo} />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <div className="ml-auto">
                        <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                            <Nav  style={{ maxHeight: '100px' }}>
                                <Nav.Link href="/" style={{color: "#23ce6b"}}>Coinflip</Nav.Link>
                                <Nav.Link href="/Leaderboard" style={{ color: "#ffffff"}}>Leaderboard</Nav.Link>
                            </Nav>
                            <div className="cta-1">
                            {near.isLoggedIn ? (
                                    <Button
                                    style={{ background: "#23ce6b", cornerRadius: 0 }}
                                    variant="secondary"
                                    size="sm"
                                    onClick={near.signOut}
                                    >
                                    <b>{near.accountId}</b>
                                    </Button>
                                ) : (
                                    <Button
                                    style={{ background: "#23ce6b", cornerRadius: 0 }}
                                    variant="secondary"
                                    size="sm"
                                    onClick={near.signIn}
                                    >
                                    <b>Connect Wallet</b>
                                    </Button>
                                )}</div>
                        </Navbar.Collapse>
                    </div>
                </Container>
                </Navbar>
            </div>
        )
    }
export default LizardNav;