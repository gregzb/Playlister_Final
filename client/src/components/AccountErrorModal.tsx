import * as React from "react";
import { useContext } from 'react'
import { AuthContext } from '../auth'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export const AccountErrorModal = () => {
    const auth = useContext(AuthContext);
    const errMsg = auth.accountError.message;
    
    const handleCloseModal = () => {
        auth.clearAccountError();
    }

    return (
        <Modal
            open={auth.accountError.error}
        >
            <Box sx={style}>
            <Alert severity="error">{errMsg}</Alert>
            <Button onClick={handleCloseModal} variant="contained">Close</Button>
            </Box>
        </Modal>
    );
    // return <div></div>;
}