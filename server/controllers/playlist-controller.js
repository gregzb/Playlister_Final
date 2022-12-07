const Playlist = require('../models/playlist-model')
const User = require('../models/user-model');
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/

// body: {name, songs}, ownerEmail will be derived
createPlaylist = async (req, res) => {
    const body = req.body;
    console.log("createPlaylist body: " + JSON.stringify(body));

    if (!body) {
        return res.status(400).json({
            error: true,
            errorMsg: 'You must provide a Playlist',
        })
    }

    const user = await User.findOne({ _id: req.userId });
    if (!user) {
        return res.status(400).json({
            error: true,
            errorMsg: 'User finding error',
        });
    }
    body.ownerEmail = user.email;
    body.username = user.username;

    if (body.name === "") body.name = `Untitled ${user.playlists.length}`

    body.likes = [];
    body.dislikes = [];
    body.comments = [];
    body.listens = 0;
    body.isPublished = false;
    body.publishDate = new Date();
    body.lastEditedDate = new Date();

    const playlistFound = await Playlist.findOne({ownerEmail: body.ownerEmail, name: body.name});
    if (playlistFound) {
        return res.status(400).json({ error: true, errorMsg: "A playlist with that name already exists for the current user" });
    }

    const playlist = new Playlist(body);
    console.log("playlist: " + playlist.toString());
    if (!playlist) {
        return res.status(400).json({ error: true, errorMsg: "issue creating playlist" })
    }

    User.findOne({ _id: req.userId }, (err, user) => {
        console.log("user found: " + JSON.stringify(user));
        playlist.save();
        user.playlists.push(playlist._id);
        user.save();
        return res.status(201).json({
            error: false,
            playlist: playlist
        });
    })
}
deletePlaylist = async (req, res) => {
    console.log("delete Playlist with id: " + JSON.stringify(req.params.id));
    console.log("delete " + req.params.id);
    Playlist.findById({ _id: req.params.id }, (err, playlist) => {
        console.log("playlist found: " + JSON.stringify(playlist));
        if (err) {
            return res.status(404).json({
                error: true,
                errorMsg: 'Playlist not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            User.findOne({ email: list.ownerEmail }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    console.log("correct user!");
                    Playlist.findOneAndDelete({ _id: req.params.id }, () => {
                        return res.status(200).json({error: false});
                    });
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({
                        error: true,
                        errorMsg: "authentication error, playlist doesnt belong to user" 
                    });
                }
            });
        }
        asyncFindUser(playlist);
    })
}
getPlaylistById = async (req, res) => {
    console.log("Find Playlist with id: " + JSON.stringify(req.params.id));

    // await Playlist.findById(req.params.id, (err, list) => {
    await Playlist.findById({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ error: true, errorMsg: "issue retrieving playlist" });
        }

        console.log("Found list: " + JSON.stringify(list));
        if (list.isPublished) {
            return res.status(200).json({ error: false, playlist: list });
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            User.findOne({ email: list.ownerEmail }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    console.log("correct user!");
                    return res.status(200).json({ error: false, playlist: list })
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({ error: true, errorMsg: "authentication error getting playlist by id" });
                }
            });
        }
        asyncFindUser(list);
    });
}




updatePlaylistDetails = async (req, res) => {
    const body = req.body
    console.log("updatePlaylistDetails: " + JSON.stringify(body));
    console.log("req.body.name: " + req.body.name);

    if (!body || body.name === "") {
        return res.status(400).json({
            error: true,
            errorMsg: 'You must provide a body or name to update',
            playlist: null
        })
    }

    Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
        if (err) {
            return res.status(404).json({
                err,
                error: true,
                errorMsg: 'Playlist not found!',
                playlist: null
            });
        }
        if (playlist.isPublished) {
            return res.status(400).json({
                error: true,
                errorMsg: 'Playlist is already published!',
                playlist: playlist
            });
        }
        console.log("playlist found: " + JSON.stringify(playlist));

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            User.findOne({ email: list.ownerEmail }, async (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    console.log("correct user!");
                    console.log("req.body.name: " + req.body.name);

                    if (body.name !== list.name) {
                        const playlistFound = await Playlist.findOne({ownerEmail: body.ownerEmail, name: body.name});
                        if (playlistFound) {
                            return res.status(400).json({ error: true, errorMsg: "A playlist with that name already exists for the current user", playlist: list });
                        }
                    }

                    list.name = body.name;
                    list.songs = body.songs;
                    list.lastEditedDate = new Date();
                    list.isPublished = body.isPublished;
                    if (list.isPublished) {
                        list.publishDate = new Date();
                    }
                    list
                        .save()
                        .then(() => {
                            console.log("SUCCESS!!!");
                            return res.status(200).json({
                                error: false,
                                id: list._id,
                                playlist: list,
                                message: 'Playlist updated!',
                            })
                        })
                        .catch(err => {
                            console.log("FAILURE: " + JSON.stringify(err));
                            return res.status(404).json({
                                // error,
                                error: true,
                                errorMsg: 'Playlist not updated: ' + JSON.stringify(err),
                                playlist: list
                            })
                        })
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({ error: true, errorMsg: "authentication error for detail update", playlist: list });
                }
            });
        }
        asyncFindUser(playlist);
    })
}


updatePlaylistInteractions = async (req, res) => {
    const body = req.body
    console.log("updatePlaylistInteractions: " + JSON.stringify(body));
    console.log("req.body.name: " + req.body.name);

    if (!body) {
        return res.status(400).json({
            error: true,
            errorMsg: 'You must provide a body to update',
        })
    }

    Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
        if (err) {
            return res.status(404).json({
                err,
                error: true,
                errorMsg: 'Playlist not found!',
            });
        }
        if (!playlist.isPublished) {
            return res.status(400).json({
                error: true,
                errorMsg: "Playlist isn't published yet!",
            });
        }
        console.log("playlist found: " + JSON.stringify(playlist));

        // list.name = body.name;
        // list.songs = body.songs;
        // list.isPublished = body.isPublished;
        // if (list.isPublished) {
        //     list.publishDate = new Date();
        // }
        list.likes = body.likes;
        list.dislikes = body.dislikes;
        list.comments = body.comments;
        list.listens = body.listens;
        list
            .save()
            .then(() => {
                console.log("SUCCESS!!!");
                return res.status(200).json({
                    error: false,
                    id: list._id,
                    playlist: list,
                    message: 'Playlist updated!',
                })
            })
            .catch(err => {
                console.log("FAILURE: " + JSON.stringify(err));
                return res.status(404).json({
                    // error,
                    error: true,
                    errorMsg: 'Playlist not updated: ' + JSON.stringify(err),
                })
            });
        asyncFindUser(playlist);
    })
}


getOwnPlaylists = async (req, res) => {
    User.findOne({ _id: req.userId }, (err, user) => {
        console.log(err, user);
        if (err) {
            return res.status(404).json({
                error: true,
                errorMsg: 'Self user not found!',
            });
        }
        console.log("find user with id " + req.userId);
        async function asyncFindLists(email) {
            console.log("find all Playlists owned by " + email);
            Playlist.find({ ownerEmail: email }, (err, playlists) => {
                if (err) {
                    return res.status(400).json({ error: true, errorMsg: JSON.stringify(err) })
                }
                // if (!playlists.length) {
                //     return res
                //         .status(404)
                //         .json({ success: false, error: `Playlists not found` })
                // }
                return res.status(200).json({ error: false, playlists: playlists })
            });
        }
        asyncFindLists(user.email);
    });
}


getAllPlaylists = async (req, res) => {
    Playlist.find({ isPublished: true }, (err, playlists) => {
        if (err) {
            return res.status(400).json({ error: true, errorMsg: JSON.stringify(err) })
        }
        return res.status(200).json({ error: false, playlists: playlists })
    });
}


getUserPlaylists = async (req, res) => {
    const username = req.query.username;
    User.findOne({username: username}, async (err, user) => {
        if (err) {
            return res.status(400).json({ error: true, errorMsg: JSON.stringify(err) })
        }
        // const email = user.email;
        Playlist.find({username: username, isPublished: true}, (err, playlists) => {
            if (err) {
                return res.status(400).json({ error: true, errorMsg: JSON.stringify(err) })
            }
            return res.status(200).json({ error: false, playlists: playlists });
        });
    });
}









// getPlaylistPairs = async (req, res) => {
//     console.log("getPlaylistPairs");
//     await User.findOne({ _id: req.userId }, (err, user) => {
//         console.log("find user with id " + req.userId);
//         async function asyncFindList(email) {
//             console.log("find all Playlists owned by " + email);
//             await Playlist.find({ ownerEmail: email }, (err, playlists) => {
//                 console.log("found Playlists: " + JSON.stringify(playlists));
//                 if (err) {
//                     return res.status(400).json({ success: false, error: err })
//                 }
//                 if (!playlists) {
//                     console.log("!playlists.length");
//                     return res
//                         .status(404)
//                         .json({ success: false, error: 'Playlists not found' })
//                 }
//                 else {
//                     console.log("Send the Playlist pairs");
//                     // PUT ALL THE LISTS INTO ID, NAME PAIRS
//                     let pairs = [];
//                     for (let key in playlists) {
//                         let list = playlists[key];
//                         let pair = {
//                             _id: list._id,
//                             name: list.name
//                         };
//                         pairs.push(pair);
//                     }
//                     return res.status(200).json({ success: true, idNamePairs: pairs })
//                 }
//             }).catch(err => console.log(err))
//         }
//         asyncFindList(user.email);
//     }).catch(err => console.log(err))
// }


// module.exports = {
//     createPlaylist,
//     deletePlaylist,
//     getPlaylistById,
//     getPlaylistPairs,
//     getPlaylists,
//     updatePlaylist
// }
module.exports = {
    createPlaylist,
    updatePlaylistDetails,
    updatePlaylistInteractions,
    deletePlaylist,
    getPlaylistById,
    getOwnPlaylists,
    getAllPlaylists,
    getUserPlaylists
}