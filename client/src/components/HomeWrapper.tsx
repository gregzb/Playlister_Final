import * as React from 'react'

import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from '../auth'
import { GlobalStoreContext, HomeView, ModalType, PublishedSortDirection, UnpublishedSortDirection } from '../store'

import { StatusBar } from "./StatusBar"
import { HomeHeader } from "./HomeHeader"
import { DeletePlaylistModal } from "./DeletePlaylistModal"
import { DeleteSongModal } from "./DeleteSongModal"
import { EditSongModal } from "./EditSongModal"

import type { Playlist } from "../store"

import CssBaseline from '@mui/material/CssBaseline';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Link from '@mui/material/Link';
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

import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

import HomeIcon from "@mui/icons-material/Home";
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SortIcon from '@mui/icons-material/Sort';

import PhoneIcon from '@mui/icons-material/Phone';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import CloseIcon from '@mui/icons-material/Close';

import IconButton from '@mui/material/IconButton';
import { CardActionArea, Icon } from '@mui/material';

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
        if (auth.loggedIn === false && store.currentHomeView === HomeView.OWN) {
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

    const handleClickUsername = (username: string) => {
        return (e: React.SyntheticEvent) => {
            e.preventDefault();
            console.log("username clicked:", username);
        }
    }

    const handleExpand = (playlist: Playlist) => {
        return (e: React.SyntheticEvent) => {
            e.preventDefault();
            if (store.expandedPlaylist?._id === playlist._id) {
                store.setExpandedPlaylist(null);
            } else {
                store.setExpandedPlaylist(playlist);
            }
        }
    };

    const isSelected = (playlist: Playlist) => {
        return store.expandedPlaylist?._id === playlist._id;
    };

    const currentlyPlayingSongIndex = 2;

    const playlistInner = (playlist: Playlist) => {
        if (playlist.isPublished) {
            return (<>
                <Grid container>
                    <div style={{ maxHeight: "20em", overflowY: "scroll", width: "100%" }}>
                        {playlist.songs.map((song, idx) => {
                            return (
                                <Grid key={"" + idx + "|" + song.title + "|" + song.artist + "|" + song.youTubeId} item xs={12}>
                                    {/* <Card sx={{ m: 1 }}> */}
                                    <Typography style={{ fontWeight: "bold", color: currentlyPlayingSongIndex === idx ? "#96471a" : "#968e1a" }} display="inline" variant="body1">{idx + 1}. {song.title} by {song.artist}</Typography>
                                    {/* </Card> */}
                                </Grid>
                            )
                        })}
                    </div>

                    <Grid item xs={12}>
                        <ButtonGroup sx={{ float: "right" }} variant="contained">
                            <Button sx={{ pt: 0.6, pb: 0.6, pl: 1.5, pr: 1.5 }}>Delete</Button>
                            <Button onClick={() => store.createPlaylist(`Copy of ${playlist.name}`, [...playlist.songs])} sx={{ pt: 0.6, pb: 0.6, pl: 1.5, pr: 1.5 }}>Duplicate</Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>
            </>)
        } else {

            const editSongClicked = (index: number) => {
                return (e: React.SyntheticEvent) => {
                    e.stopPropagation();
                    store.setMarkedSongIndex(index);
                    store.setModal(ModalType.EDIT_SONG);
                    console.log("edit!");
                }
            };

            const deleteSongClicked = (index: number) => {
                return (e: React.SyntheticEvent) => {
                    e.stopPropagation();
                    store.setMarkedSongIndex(index);
                    store.setModal(ModalType.DELETE_SONG);
                }
            };

            const handleDragStart = (index: number) => {
                return (event: React.DragEvent) => {
                    event.dataTransfer.setData("song", ""+index);
                }
            }

            const handleDragOver = (event: React.SyntheticEvent) => {
                event.preventDefault();
            }

            const handleDragEnter = (event: React.SyntheticEvent) => {
                event.preventDefault();
            }

            const handleDragLeave = (event: React.SyntheticEvent) => {
                event.preventDefault();
            }

            const handleDrop = (index: number) => {
                return (event: React.DragEvent) => {
                    event.preventDefault();
                    let targetIndex = index;
                    let sourceIndex = Number(event.dataTransfer.getData("song"));

                    // UPDATE THE LIST
                    store.addMoveSongTransaction(sourceIndex, targetIndex);
                }
            }

            return (
                <>
                    <Grid container>
                        <div style={{ maxHeight: "20em", overflowY: "scroll", width: "100%" }}>
                            {playlist.songs.map((song, idx) => {
                                return (
                                    <Grid key={"" + idx + "|" + song.title + "|" + song.artist + "|" + song.youTubeId}
                                        item
                                        xs={12}
                                        onDragStart={handleDragStart(idx)}
                                        onDragOver={handleDragOver}
                                        onDragEnter={handleDragEnter}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop(idx)}
                                        draggable="true"
                                    >
                                        <Card onDoubleClick={editSongClicked(idx)} sx={{ m: 1 }}>
                                            {/* <CardActionArea> */}
                                            <Typography display="inline" variant="h5">{idx + 1}. {song.title} by {song.artist}</Typography>
                                            <IconButton onClick={deleteSongClicked(idx)} style={{ float: "right" }}>
                                                <CloseIcon></CloseIcon>
                                            </IconButton>
                                            {/* </CardActionArea> */}
                                        </Card>
                                    </Grid>
                                )
                            })}
                            <Grid item xs={12}>
                                <Card sx={{ m: 1 }}>
                                    <CardActionArea onClick={() => {
                                        store.addCreateSongTransaction(playlist.songs.length, "Untitled", "Unknown", "dQw4w9WgXcQ")
                                    }}>
                                        <Typography align="center" variant="h3">+</Typography>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        </div>

                        <Grid item xs={12}>
                            <ButtonGroup variant="contained">
                                <Button onClick={store.undo} disabled={!store.canUndo()} sx={{ pt: 0.6, pb: 0.6, pl: 1.5, pr: 1.5 }}>Undo</Button>
                                <Button onClick={store.redo} disabled={!store.canRedo()} sx={{ pt: 0.6, pb: 0.6, pl: 1.5, pr: 1.5 }}>Redo</Button>
                            </ButtonGroup>

                            <ButtonGroup sx={{ float: "right" }} variant="contained">
                                <Button onClick={() => store.publishExpandedPlaylist()} sx={{ pt: 0.6, pb: 0.6, pl: 1.5, pr: 1.5 }}>Publish</Button>
                                <Button onClick={() => store.setModal(ModalType.DELETE_LIST)} sx={{ pt: 0.6, pb: 0.6, pl: 1.5, pr: 1.5 }}>Delete</Button>
                                <Button onClick={() => store.createPlaylist(`Copy of ${playlist.name}`, [...playlist.songs])} sx={{ pt: 0.6, pb: 0.6, pl: 1.5, pr: 1.5 }}>Duplicate</Button>
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                </>);
        }
    }

    const playlistsUnsorted = store.loadedPlaylists.filter((playlist) => {
        if (store.currentHomeView === HomeView.USER) {
            return true;
        } else {
            return playlist.name.includes(store.searchText ?? "");
        }
    });
    const playlistsSorted = [...playlistsUnsorted];
    playlistsSorted.sort((a, b) => {
        if (store.currentHomeView === HomeView.OWN) {
            if (store.unpublishedSortDirection === UnpublishedSortDirection.NAME) {
                return a.name.localeCompare(b.name);
            } else if (store.unpublishedSortDirection === UnpublishedSortDirection.CREATION_DATE) {
                const da = new Date(a.createdAt);
                const db = new Date(b.createdAt);

                if (da < db) return -1;
                if (da > db) return 1;
                return 0;
            } else {
                const da = new Date(a.lastEditedDate);
                const db = new Date(b.lastEditedDate);

                if (da > db) return -1;
                if (da < db) return 1;
                return 0;
            }
        } else {
            if (store.publishedSortDirection === PublishedSortDirection.NAME) {
                return a.name.localeCompare(b.name);
            } else if (store.publishedSortDirection === PublishedSortDirection.PUBLISH_DATE) {
                const da = new Date(a.publishDate);
                const db = new Date(b.publishDate);

                if (da > db) return -1;
                if (da < db) return 1;
                return 0;
            } else if (store.publishedSortDirection === PublishedSortDirection.LISTENS) {
                if (a.listens > b.listens) return -1;
                if (a.listens < b.listens) return 1;
                return 0;
            } else if (store.publishedSortDirection === PublishedSortDirection.LIKES) {
                if (a.likes > b.likes) return -1;
                if (a.likes < b.likes) return 1;
                return 0;
            } else if (store.publishedSortDirection === PublishedSortDirection.DISLIKES) {
                if (a.dislikes > b.dislikes) return -1;
                if (a.dislikes < b.dislikes) return 1;
                return 0;
            } 
        }
    });
    console.log(playlistsSorted);
    const playlistEls = playlistsSorted.map((playlist: Playlist) => {
        return {
            key: playlist._id,
            el: (<Card sx={{ m: 1 }}>
                <CardActionArea>
                    <CardContent>
                        <Grid container>
                            <Grid item xs={8}>
                                <Typography variant="h5">{playlist.name}</Typography>
                                <Typography variant="body1">By: <Link onClick={handleClickUsername(playlist.username)}>{playlist.username}</Link></Typography>
                            </Grid>
                            <Grid item xs={4}></Grid>
                        </Grid>
                    </CardContent>
                </CardActionArea>
                <CardContent sx={{ pt: 0, pb: 0 }}>
                    {isSelected(playlist) ?
                        playlistInner(playlist)
                        : <></>}
                </CardContent>
                <CardActions sx={{ p: 0, float: "right" }}>
                    <IconButton onClick={handleExpand(playlist)}>
                        {isSelected(playlist) ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon />}
                    </IconButton>
                </CardActions>
            </Card>)
        }
    });

    const currSong = store.expandedPlaylist?.songs[store.markedSongIndex];

    return (<Card style={{ flexGrow: 1, margin: 15, display: "flex", flexDirection: "column" }}>
        <HomeHeader key={searchKey} />
        <Paper style={{ marginTop: 10, marginBottom: 10, height: "0px", flexGrow: 1, flexBasis: 0, maxHeight: "100%" }} elevation={8}>
            <Grid container spacing={2} style={{ height: "100%", maxHeight: "100%" }}>
                <Grid item xs={7} style={{ height: "100%" }}>
                    <Grid container style={{ maxHeight: "100%", overflowY: "scroll" }}>
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
        <DeletePlaylistModal />
        <DeleteSongModal />
        <EditSongModal key={(currSong?.title ?? "") + "|" + (currSong?.artist ?? "") + "|" + (currSong?.youTubeId ?? "")} />
    </Card>);
}