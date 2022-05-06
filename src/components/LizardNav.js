import React, { useState } from "react";
import { useNear } from "../near";
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
import { styled, alpha } from '@mui/material/styles';
import Link from "@mui/material/Link";
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const LizardNav = (props) => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const near = useNear();
  const pages = [
    <Link href="/" style={{ color: "#23ce6b",fontSize: "16px",
    fontFamily: "Proxima Nova-Extrabold, Helvetica",
    fontWeight: 700, }}>
      Coin Flip
    </Link>,
    <Link href="/leaderboard" style={{ color: "white",fontSize: "16px",
    fontFamily: "Proxima Nova-Extrabold, Helvetica",
    fontWeight: 700, }}>
      Leaderboard
    </Link>
  ];

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const StyledMenu = styled((props) => (
    <Menu 
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left"
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left"
      }} {...props}
      />
  ))(({ theme }) => ({
    '& .MuiPaper-root': {
      backgroundColor: "black"
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        backgroundColor: "black"
      },
    '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  }
));

  return (
    <AppBar
      position="static"
      style={{
        backgroundColor: "#0000004c",
        boxShadow: "none",
        paddingBottom: "10px"
      }}
    >
      <Container>
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", md: "flex" }, paddingLeft: "5px" }}
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
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "right"
            }}
          >
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
          <Box sx={{ flexGrow: 3, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="sm"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={() => props.handleToggleSidebar(true)}
              color="inherit"
            >
              <AccessTimeIcon sx={{color: "#23ce6b"}}/>
            </IconButton>
            <IconButton
              size="sm"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <StyledMenu
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
            </StyledMenu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default LizardNav;
