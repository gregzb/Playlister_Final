import * as React from "react";
import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Typography from "@mui/material/Typography";

import { AuthContext } from '../auth'

//@ts-ignore
import logoUrl from '/assets/logo.png';

export const AppBanner = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const imageHeight = {
        height: 56,
        "@media(min-width: 0px)": {
            '@media(orientation: "landscape")': {
                height: 48
            }
        },
        "@media(min-width: 600px)": {
            height: 64
        }
    };

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleRegister = () => {
        handleClose();
        navigate("/register");
    }

    const handleLogin = () => {
        handleClose();
        navigate("/login");
    }

    const handleLogout = async () => {
        handleClose();
        auth.logout();
        setTimeout(() => {
            navigate("/");
        }, 50);
    }

    console.log(auth.loggedIn);

    return (
        <AppBar sx={{ bgcolor: "rgb(224,224,224)" }} position="static">
            <Toolbar>
                <Link to="/">
                    <Box sx={imageHeight}>
                        <img height="100%" src={logoUrl}></img>
                    </Box>
                </Link>
                <span style={{ flexGrow: 1 }}></span>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                // color="inherit"
                >
                    {
                        auth.loggedIn ?
                        (<Typography variant="h5">{auth.getUserInitials()}</Typography>)
                        :(<AccountCircle />)
                    }
                </IconButton>
                <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    {auth.loggedIn ? (
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>) : (
                        [
                            <MenuItem key="create_acc" onClick={handleRegister}>Create New Account</MenuItem>,
                            <MenuItem key="login_acc" onClick={handleLogin}>Login</MenuItem>
                        ]
                    )}
                </Menu>
            </Toolbar>
        </AppBar>
    );
};