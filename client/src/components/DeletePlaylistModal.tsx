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

export const DeletePlaylistModal = () => {
    const store = useContext(GlobalStoreContext);

    const handleDeleteList = (event: React.SyntheticEvent) => {
        store.deleteExpandedPlaylist();
        store.setModal(ModalType.NONE);
    }

    const handleClose = (event: React.SyntheticEvent) => {
        store.setModal(ModalType.NONE);
    }

    return (
        <Dialog
            open={store.currentModal === ModalType.DELETE_LIST}
            onClose={handleClose}>
            {/* <DialogTitle id="alert-dialog-title">
                Delete the <span style={{fontWeight: "bold"}}>{store.expandedPlaylist?.name}</span> playlist?
            </DialogTitle> */}
            {/* <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Let Google help apps determine location. This means sending anonymous
                    location data to Google, even when no apps are running.
                </DialogContentText>
            </DialogContent> */}
            <DialogTitle id="alert-dialog-title">
                Delete Playlist?
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete the "<span style={{fontWeight: "bold"}}>{store.expandedPlaylist?.name}</span>" playlist?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDeleteList}>Confirm</Button>
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