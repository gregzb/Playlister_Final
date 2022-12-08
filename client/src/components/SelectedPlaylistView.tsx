import * as React from "react";
import { useContext, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";

import FastRewindIcon from '@mui/icons-material/FastRewind';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FastForwardIcon from '@mui/icons-material/FastForward';

import { AuthContext } from '../auth'
import { GlobalStoreContext, HomeView, ModalType, PublishedSortDirection, UnpublishedSortDirection } from '../store'

//@ts-ignore
import logoUrl from '/assets/logo.png';

import YouTube, { YouTubeProps } from 'react-youtube';
import { Typography } from "@mui/material";


export const SelectedPlaylistView = () => {
    const store = useContext(GlobalStoreContext);
    const auth = useContext(AuthContext);
    const playerRef = useRef(null);
    const navigate = useNavigate();

    const [lookingAtComments, setLookingAtComments] = useState(false);
    const [shouldBePlaying, setShouldBePlaying] = useState(false);

    const opts: YouTubeProps['opts'] = {
        height: '300pt',
        width: '100%',
        playerVars: {
            autoplay: shouldBePlaying,
        },
    };

    const currSong = store.selectedPlaylist?.songs[store.playingSongIndex];
    const hasSong = !!currSong;

    useEffect(() => {
        if (!store.selectedPlaylist?.isPublished && lookingAtComments) {
            setLookingAtComments(false);
        }
    }, [store.selectedPlaylist?.isPublished]);

    useEffect(() => {
        setShouldBePlaying(false);
        playerRef?.current?.getInternalPlayer()?.pauseVideo();
    }, [store.selectedPlaylist?._id]);

    const handleVideoEnded = () => {
        store.setPlayingSongIndex((store.playingSongIndex+1) % store.selectedPlaylist.songs.length);
    }

    const handleClickPause = () => {
        playerRef?.current?.getInternalPlayer()?.pauseVideo();
        setShouldBePlaying(false);
    }

    const handleClickPlay = () => {
        playerRef?.current?.getInternalPlayer()?.playVideo();
        if (!shouldBePlaying) {
            store.selectedPlaylist.listens++;
            store.updatePlaylistInteractions(store.selectedPlaylist);
        }
        setShouldBePlaying(true);
    }

    return (
        <div style={{ width: "100%", height: "100%" }}>
            <ButtonGroup variant="text">
                <Button variant={!lookingAtComments ? "contained" : "text"} onClick={() => setLookingAtComments(false)}>
                    Player
                </Button>
                <Button disabled={!store.selectedPlaylist?.isPublished} variant={lookingAtComments ? "contained" : "text"} onClick={() => setLookingAtComments(true)}>
                    Comments
                </Button>
            </ButtonGroup>
            {hasSong ?
                <div style={{ display: lookingAtComments ? "none" : "block", maxHeight: "100%", height: "94%", overflowY: "scroll"}}>
                    <YouTube key={store.selectedPlaylist._id + "" + store.playingSongIndex + "|" + currSong?.youTubeId} onEnd={handleVideoEnded} ref={playerRef} videoId={currSong?.youTubeId} opts={opts} />
                    {/* <div style={{ width: "100%", height: "40%", position: "absolute", bottom: 0 }}> */}
                    <Typography style={{ fontWeight: "bold" }} align="center" variant="body1">Now Playing</Typography>
                    <table>
                        <tbody>
                            <tr>
                                <td><Typography style={{ fontWeight: "bold" }} display="inline" variant="body1">Playlist:</Typography></td>
                                <td><Typography display="inline" variant="body1">{store.selectedPlaylist?.name}</Typography></td>
                            </tr>
                            <tr>
                                <td><Typography style={{ fontWeight: "bold" }} display="inline" variant="body1">Song #:</Typography></td>
                                <td><Typography display="inline" variant="body1">{store.playingSongIndex >= 0 ? store.playingSongIndex + 1 : ""}</Typography></td>
                            </tr>
                            <tr>
                                <td><Typography style={{ fontWeight: "bold" }} display="inline" variant="body1">Title:</Typography></td>
                                <td><Typography display="inline" variant="body1">{currSong?.title}</Typography></td>
                            </tr>
                            <tr>
                                <td><Typography style={{ fontWeight: "bold" }} display="inline" variant="body1">Artist:</Typography></td>
                                <td><Typography display="inline" variant="body1">{currSong?.artist}</Typography></td>
                            </tr>
                        </tbody>
                    </table>
                    {/* <Paper sx={{ m: 1, textAlign: "center", position: "absolute", bottom: 0, width: "100%" }}> */}
                    <Paper sx={{ m: 1, textAlign: "center" }}>
                        <IconButton onClick={() => store.setPlayingSongIndex(store.playingSongIndex - 1)} disabled={store.playingSongIndex <= 0} size="large">
                            <FastRewindIcon />
                        </IconButton>
                        <IconButton onClick={handleClickPause} disabled={!shouldBePlaying} size="large">
                            <PauseIcon />
                        </IconButton>
                        <IconButton onClick={handleClickPlay} disabled={shouldBePlaying} size="large">
                            <PlayArrowIcon />
                        </IconButton>
                        <IconButton onClick={() => store.setPlayingSongIndex(store.playingSongIndex + 1)} disabled={store.playingSongIndex + 1 >= store.selectedPlaylist?.songs?.length} size="large">
                            <FastForwardIcon />
                        </IconButton>
                    </Paper>
                </div>
                : <></>
            }
        </div>
    );
};