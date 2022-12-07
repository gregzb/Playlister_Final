import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { GlobalStoreContext, HomeView } from '../store'
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export const StatusBar = (props: {style: any}) => {
    const store = useContext(GlobalStoreContext);
    const addNewListHandler = () => {
        store.createPlaylist("", []);
    };
    if (store.currentHomeView === HomeView.OWN) {
        return (
        <Button onClick={addNewListHandler}>
            <Typography style={{...props.style}} align="center" variant="h3">+ Your Lists</Typography>
        </Button>
        );
    } else if (store.currentHomeView === HomeView.ALL) {
        const searchTerm = store.searchText ?? "";
        return (<Typography style={{...props.style}} align="center" variant="h2">{searchTerm} Playlists</Typography>);
    } else {
        const searchTerm = store.searchText ?? "";
        return (<Typography style={{...props.style}} align="center" variant="h2">{searchTerm} Lists</Typography>);
    }
};