import * as React from "react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from '../auth'

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';

//@ts-ignore
import logoUrl from '/assets/logo.png';

export const SplashScreen = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.loggedIn) {
            navigate("/home");
        }
    }, [auth.loggedIn]);

    return (
        <Container maxWidth="md">
            <Grid
                container
                spacing={2}
            >
                <Grid item xs={12}>
                    <Box sx={{ "textAlign": "center" }}>
                        <img src={logoUrl}></img>
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <Box sx={{ "textAlign": "center" }}>
                        <Typography align="center" variant="h4">Welcome to Playlister, your one stop solution for Playlist management and viewing!</Typography>
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <Typography align="center" variant="h5">Enter as a guest to view and listen to popular Playlists made by users around the world or sign up and login to make your own Playlists from YouTube videos.</Typography>
                </Grid>

                <Grid item xs={12}>
                    <Typography align="center" variant="h5">Enter as a guest to view and listen to popular Playlists made by users around the world or sign up and login to make your own Playlists from YouTube videos.</Typography>
                </Grid>

                <Grid item xs={12}>
                    <Box sx={{ "textAlign": "center" }}>
                        <Button sx={{ m: 1 }} onClick={() => navigate("/register")} variant="contained">Create Account</Button>
                        <Button sx={{ m: 1 }} onClick={() => navigate("/login")} variant="contained">Login</Button>
                        <Button sx={{ m: 1 }} onClick={() => navigate("/home")} variant="contained">Continue as Guest</Button>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Typography align="right" variant="body1">Made by Greg Zborovsky</Typography>
                </Grid>
            </Grid>
        </Container>
    );
};