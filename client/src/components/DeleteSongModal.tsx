import * as React from 'react';
import { useContext } from 'react'
import { GlobalStoreContext, ModalType } from '../store';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

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

export const DeleteSongModal = () => {
    const store = useContext(GlobalStoreContext);

    const handleDeleteSong = (event: React.SyntheticEvent) => {
        store.addRemoveSongTransaction(store.markedSongIndex);
        store.setModal(ModalType.NONE);
    }

    const handleClose = (event: React.SyntheticEvent) => {
        store.setModal(ModalType.NONE);
    }

    return (
        <Dialog
            open={store.currentModal === ModalType.DELETE_SONG}
            onClose={handleClose}>
            <DialogTitle id="alert-dialog-title">
                Remove Song?
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you wish to permanently remove "<span style={{fontWeight: "bold"}}>{store.expandedPlaylist?.songs[store.markedSongIndex]?.title}</span>"" from the playlist?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDeleteSong}>Confirm</Button>
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