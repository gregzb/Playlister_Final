import * as React from 'react'

import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from '../auth'
import { GlobalStoreContext, HomeView, UnpublishedSortDirection, PublishedSortDirection } from '../store'

import {StatusBar} from "./StatusBar"

import CssBaseline from '@mui/material/CssBaseline';
import Card from '@mui/material/Card';
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
import { Unpublished } from '@mui/icons-material';

export const HomeHeader = () => {
    const auth = useContext(AuthContext);
    const store = useContext(GlobalStoreContext);

    const [sortAnchorEl, setSortAnchorEl] = React.useState<null | HTMLElement>(null);

    const [tmpSearchText, setTmpSearchText] = useState("");

    const handleSortMenu = (event: React.MouseEvent<HTMLElement>) => {
        setSortAnchorEl(event.currentTarget);
    };

    const handleCloseSortMenuUnpublished = (dir: UnpublishedSortDirection) => {
        return () => {
            store.setUnpublishedSortDirection(dir);
            setSortAnchorEl(null);
        }
    };

    const handleCloseSortMenuPublished = (dir: PublishedSortDirection) => {
        return () => {
            store.setPublishedSortDirection(dir);
            setSortAnchorEl(null);
        }
    };

    const viewingPublished = store.currentHomeView != HomeView.OWN;
    const menuSortItems = viewingPublished ? [
        <MenuItem key="name" onClick={handleCloseSortMenuUnpublished(UnpublishedSortDirection.NAME)}>Name (A-Z)</MenuItem>,
        <MenuItem key="creationDate" onClick={handleCloseSortMenuUnpublished(UnpublishedSortDirection.CREATION_DATE)}>Creation Date (Old-New)</MenuItem>,
        <MenuItem key="lastEditDate" onClick={handleCloseSortMenuUnpublished(UnpublishedSortDirection.LAST_EDIT_DATE)}>Last Edit Date (New-Old)</MenuItem>,
    ] : [
        <MenuItem key="name" onClick={handleCloseSortMenuPublished(PublishedSortDirection.NAME)}>Name (A-Z)</MenuItem>,
        <MenuItem key="publishDate" onClick={handleCloseSortMenuPublished(PublishedSortDirection.PUBLISH_DATE)}>Publish Date (New-Old)</MenuItem>,
        <MenuItem key="listens" onClick={handleCloseSortMenuPublished(PublishedSortDirection.LISTENS)}>Listens (High-Low)</MenuItem>,
        <MenuItem key="likes" onClick={handleCloseSortMenuPublished(PublishedSortDirection.LIKES)}>Likes (High-Low)</MenuItem>,
        <MenuItem key="dislikes" onClick={handleCloseSortMenuPublished(PublishedSortDirection.DISLIKES)}>Dislikes (High-Low)</MenuItem>,
    ];

    const handleSearchKeyDown = (e: any) => {
        if (e.key === "Enter") {
            store.setSearchText(tmpSearchText);
        }
    };

    // console.log(store.currentHomeView);

    return (
        <Grid container spacing={3}>
            <Grid style={{height: 100}} item xs={3}>
                <ButtonGroup variant="text">
                    <Button variant={store.currentHomeView == HomeView.OWN ? "contained" : "text"} disabled={!auth.loggedIn} onClick={()=>store.setHomeView(HomeView.OWN)}>
                        <HomeIcon fontSize="large"></HomeIcon>
                    </Button>
                    <Button variant={store.currentHomeView == HomeView.ALL ? "contained" : "text"} onClick={()=>store.setHomeView(HomeView.ALL)} color="primary">
                        <PeopleOutlineIcon fontSize="large"></PeopleOutlineIcon>
                    </Button>
                    <Button variant={store.currentHomeView == HomeView.USER ? "contained" : "text"} onClick={()=>store.setHomeView(HomeView.USER)} color="primary">
                        <PersonOutlineIcon fontSize="large"></PersonOutlineIcon>
                    </Button>
                </ButtonGroup>
            </Grid>
            <Grid item xs={6}>
                <TextField value={tmpSearchText} onChange={(e) => setTmpSearchText(e.target.value)} onKeyDown={handleSearchKeyDown} fullWidth id="search-text-field" label="Search" variant="filled" />
            </Grid>
            <Grid item xs={3}>
                <Button onClick={handleSortMenu} style={{float: "right", margin: 5}} endIcon={<SortIcon />} size="large">
                    Sort
                </Button>
                <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={sortAnchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(sortAnchorEl)}
                    onClose={() => {setSortAnchorEl(null)}}
                >
                    {menuSortItems}
                </Menu>
            </Grid>
        </Grid>
        );
}