import * as React from 'react';
import { useContext, useState } from 'react'
import { GlobalStoreContext, ModalType } from '../store';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

// const style = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: 400,
//     bgcolor: 'background.paper',
//     border: '2px solid #000',
//     boxShadow: 24,
//     p: 4,
// };

export const EditSongModal = () => {
    const store = useContext(GlobalStoreContext);

    const currSong = store.expandedPlaylist?.songs[store.markedSongIndex];
    console.log(store.expandedPlaylist?.songs);
    console.log(store.markedSongIndex);
    console.log(JSON.stringify(currSong));

    const [ title, setTitle ] = useState(currSong?.title ?? "");
    const [ artist, setArtist ] = useState(currSong?.artist ?? "");
    const [ youTubeId, setYouTubeId ] = useState(currSong?.youTubeId ?? "");

    const handleEditSong = (event: React.SyntheticEvent) => {
        store.addUpdateSongTransaction(store.markedSongIndex, title, artist, youTubeId);
        store.setModal(ModalType.NONE);
    }

    const handleClose = (event: React.SyntheticEvent) => {
        store.setModal(ModalType.NONE);
    }

    return (
        <Dialog
            open={store.currentModal === ModalType.EDIT_SONG}
            onClose={handleClose}>
            <DialogTitle id="alert-dialog-title">
                Edit Song
            </DialogTitle>
            <DialogContent>
                {/* <DialogContentText id="alert-dialog-description"> */}
                <TextField
                    margin="normal"
                    id="title-textfield"
                    label="Title"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <TextField
                    margin="normal"
                    id="artist-textfield"
                    label="Artist"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                />
                <TextField
                    margin="normal"
                    id="youTubeId-textfield"
                    label="YouTube Id"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={youTubeId}
                    onChange={(e) => setYouTubeId(e.target.value)}
                />
                {/* </DialogContentText> */}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleEditSong}>Confirm</Button>
                <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </Dialog>

        // <Modal open={store.currentModal === ModalType.DELETE_LIST}>

        // </Modal>
        // <Modal
        //     open={store.listMarkedForDeletion !== null}
        // >
        //     <Box sx={style}>
        //         <div className="modal-dialog">
        //         <header className="dialog-header">
        //             Delete the <span style={{fontWeight: "bold"}}>{name}</span> playlist?
        //         </header>
        //         <div id="confirm-cancel-container">
        //             <button
        //                 id="dialog-yes-button"
        //                 className="modal-button"
        //                 onClick={handleDeleteList}
        //             >Confirm</button>
        //             <button
        //                 id="dialog-no-button"
        //                 className="modal-button"
        //                 onClick={handleCloseModal}
        //             >Cancel</button>
        //         </div>
        //     </div>
        //     </Box>
        // </Modal>
    );
}