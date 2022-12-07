    /*
    This is where we'll route all of the received http requests
    into controller response functions.
    
    @author McKilla Gorilla
*/
const express = require('express')
const PlaylistController = require('../controllers/playlist-controller')
const router = express.Router()
const auth = require('../auth')

// router.post('/playlist', auth.verify, PlaylistController.createPlaylist)
// router.delete('/playlist/:id', auth.verify, PlaylistController.deletePlaylist)
// router.get('/playlist/:id', auth.verify, PlaylistController.getPlaylistById)
// router.get('/playlistpairs', auth.verify, PlaylistController.getPlaylistPairs)
// router.get('/playlists', auth.verify, PlaylistController.getPlaylists)
// router.put('/playlist/:id', auth.verify, PlaylistController.updatePlaylist)

router.post('/playlist', auth.verify, PlaylistController.createPlaylist)
router.delete('/playlist/:id', auth.verify, PlaylistController.deletePlaylist)
router.get('/playlist/:id', auth.verify, PlaylistController.getPlaylistById)
router.put('/playlist/details/:id', auth.verify, PlaylistController.updatePlaylistDetails)
router.put('/playlist/interactions/:id', auth.verify, PlaylistController.updatePlaylistInteractions)
router.get('/playlists/own', auth.verify, PlaylistController.getOwnPlaylists)
router.get('/playlists/all', auth.verify, PlaylistController.getAllPlaylists)
router.get('/playlists/user', auth.verify, PlaylistController.getUserPlaylists)

module.exports = router