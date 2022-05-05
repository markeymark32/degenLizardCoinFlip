import React, { useState } from 'react';
import { useNear } from "../near";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";

const LizardNav = (props) => {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const near = useNear();
    const pages = [<a href="/">Coin Flip</a>, <a href="/leaderboard">Leaderboard</a>];

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
            <AppBar
      position="static"
      style={{ backgroundColor: "#0000004c", boxShadow: "none", paddingBottom: "10px" }}
    >
      <Container>
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", md: "flex" }, paddingLeft: "5px"}}
          >
            <img className="logo_degen" alt="Degen_Logo" src={props.logo} />
          </Typography>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
          >
            <img className="logo_degen" alt="Degen_Logo" src={props.logo} />
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" },  justifyContent: "right" }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{
                  
                  color: "white",
                  display: "block",
                  fontFamily: "Pixeloid Sans-Bold",
                  textTransform: "none"
                }}
              >
                {page}
              </Button>
            ))}
          
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
                                )}
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left"
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left"
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
                backgroundColor: "#32262d"
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
              <Box sx={{ flexGrow: 0 }}>
                <MenuItem key="wallet" onClick={handleCloseNavMenu}>
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
                                )}
                </MenuItem>
              </Box>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
        )
    }
export default LizardNav;