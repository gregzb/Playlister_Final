import * as React from 'react'

import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from '../auth'
import { GlobalStoreContext, HomeView } from '../store'

import { StatusBar } from "./StatusBar"
import { HomeHeader } from "./HomeHeader"

import CssBaseline from '@mui/material/CssBaseline';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
// import TabList from '@mui/lab/TabList';
// import TabContext from '@mui/lab/TabContext';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
// import Link from '@mui/material/Link';

import HomeIcon from "@mui/icons-material/Home";
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SortIcon from '@mui/icons-material/Sort';

import PhoneIcon from '@mui/icons-material/Phone';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonPinIcon from '@mui/icons-material/PersonPin';

import IconButton from '@mui/material/IconButton';
import { CardActionArea } from '@mui/material';

export const HomeWrapper = () => {
    const auth = useContext(AuthContext);
    const store = useContext(GlobalStoreContext);
    const [searchKey, setSearchKey] = useState(0);
    const navigate = useNavigate();

    // const handleChange = (e) => {
    //     console.log(e);
    // }

    console.log(store);

    useEffect(() => {
        if (auth.loggedIn === false && store.currentHomeView == HomeView.OWN) {
            store.setHomeView(HomeView.ALL);
        }
    }, [auth.loggedIn]);

    useEffect(() => {
        if (store.currentHomeView === HomeView.NONE) {
            if (auth.loggedIn === true) {
                store.setHomeView(HomeView.OWN);
            } else if (auth.loggedIn === false) {
                store.setHomeView(HomeView.ALL);
            }
        }
        setSearchKey(searchKey + 1);
    }, [store.currentHomeView, auth.loggedIn]);

    const playlists = store.loadedPlaylists;
    const playlistEls = playlists.map((playlist) => ({
        key: playlist._id,
        el: (<Card sx={{ m: 1 }}>
            <CardActionArea>
                <CardContent>

                </CardContent>
            </CardActionArea>
            <CardActions>

            </CardActions>
        </Card>)
    }
    ));

    // const songEls = [
    //     <Card sx={{m: 1}}><CardContent>a</CardContent><CardActions>b</CardActions></Card>,
    //     <Card>b</Card>,
    //     <Card>c</Card>,
    //     <Card>d</Card>,
    //     <Card>e</Card>,
    //     <Card>f</Card>,
    //     <Card>g</Card>,
    // ];

    return (<Card style={{ flexGrow: 1, margin: 15, display: "flex", flexDirection: "column" }}>
        <HomeHeader key={searchKey} />
        {/* <div style={{margin: 5, padding: 5}}>a</div> */}
        <Paper style={{ marginTop: 10, marginBottom: 10, flexGrow: 1 }} elevation={8}>
            <Grid container spacing={2}>
                <Grid item xs={7}>
                    <Grid container spacing={1}>
                        {
                            playlistEls.map((playlistEl) => <Grid key={playlistEl.key} item xs={12}>{playlistEl.el}</Grid>)
                        }
                    </Grid>
                </Grid>
                <Grid item xs={5}>
                    b
                </Grid>
            </Grid>
        </Paper>
        <StatusBar style={{ margin: 5, padding: 5 }}></StatusBar>
    </Card>);
}