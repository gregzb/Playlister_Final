import * as React from "react";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TPS } from "../common/tps";
// import jsTPS from '../common/jsTPS'
// import api from './store-request-api'
import { AuthContext } from "../auth";

import { createPlaylist, deletePlaylist, getPlaylists, updatePlaylistDetails } from "./requests-api";
import type { Playlist } from "./requests-api";
export type { Playlist } from "./requests-api";

import { CreateSong_Transaction } from "../transactions/CreateSong_Transaction";
import { MoveSong_Transaction } from "../transactions/MoveSong_Transaction";
import { RemoveSong_Transaction } from "../transactions/RemoveSong_Transaction";
import { UpdateSong_Transaction } from "../transactions/UpdateSong_Transaction";

export enum GlobalStoreActionType {
    CHANGE_HOME_VIEW,
    CHANGE_UNPUBLISHED_SORT_DIRECTION,
    CHANGE_PUBLISHED_SORT_DIRECTION,
    CHANGE_SEARCH_TEXT,
    CHANGE_LOADED_PLAYLISTS,
    CHANGE_EXPANDED_PLAYLIST,
    UPDATE_PLAYLIST,
    CHANGE_MODAL,
    CHANGE_MARKED_SONG_INDEX
};

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new TPS();

export enum ModalType {
    NONE,
    DELETE_LIST,
    EDIT_SONG,
    DELETE_SONG,
};

export enum HomeView {
    NONE,
    OWN,
    ALL,
    USER
};

export enum UnpublishedSortDirection {
    NAME,
    CREATION_DATE,
    LAST_EDIT_DATE,
};

export enum PublishedSortDirection {
    NAME,
    PUBLISH_DATE,
    LISTENS,
    LIKES,
    DISLIKES,
};

const defaultStoreState: {
    currentModal: ModalType,
    currentHomeView: HomeView,
    searchText: string | null,
    unpublishedSortDirection: UnpublishedSortDirection,
    publishedSortDirection: PublishedSortDirection,
    loadedPlaylists: Playlist[],
    expandedPlaylist: Playlist | null,
    markedSongIndex: number,

    setHomeView?: (newView: HomeView) => void,
    setUnpublishedSortDirection?: (_: UnpublishedSortDirection) => void,
    setPublishedSortDirection?: (_: PublishedSortDirection) => void,
    setSearchText?: (_: string) => void,
    loadOwnPlaylists?: () => void,
    loadAllPlaylists?: () => void,
    loadUserPlaylists?: (_: string) => void
    loadPlaylistsWrapper?: (newView: HomeView) => void,
    createPlaylist?: (name: string, songs: {
        title: string,
        artist: string,
        youTubeId: string
    }[]) => void,
    setExpandedPlaylist?: (playlist: Playlist) => void,
    updateExpandedPlaylist?: () => void,
    publishExpandedPlaylist?: () => void,
    deleteExpandedPlaylist?: () => void,
    setModal?: (modal: ModalType) => void,
    setMarkedSongIndex?: (index: number) => void,

    clearAllTransactions?: () => void,
    addCreateSongTransaction?: (index: number, title: string, artist: string, youTubeId: string) => void,
    addMoveSongTransaction?: (start: number, end: number) => void,
    addRemoveSongTransaction?: (index: number) => void,
    addUpdateSongTransaction?: (index: number, title: string, artist: string, youTubeId: string) => void,

    createSong?: (index: number, song: { title: string, artist: string, youTubeId: string }) => void,
    removeSong?: (index: number) => void,
    moveSong?: (oldIndex: number, newIndex: number) => void,
    updateSong?: (index: number, song: { title: string, artist: string, youTubeId: string }) => void,

    undo?: () => void,
    redo?: () => void,
    canUndo?: () => boolean,
    canRedo?: () => boolean,
} = {
    currentModal: ModalType.NONE,
    currentHomeView: HomeView.NONE,
    searchText: null,
    unpublishedSortDirection: UnpublishedSortDirection.NAME,
    publishedSortDirection: PublishedSortDirection.NAME,
    loadedPlaylists: [],
    expandedPlaylist: null,
    markedSongIndex: -1,
};

export const GlobalStoreContext = createContext(defaultStoreState);
console.log("create GlobalStoreContext");

export const GlobalStoreContextProvider = (props: {
    children: React.ReactNode
}) => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState(defaultStoreState);
    const history = useNavigate();

    console.log("inside useGlobalStore");

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const auth = useContext(AuthContext);
    console.log("auth: " + auth);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action: { type: GlobalStoreActionType, payload: any }) => {
        const { type, payload } = action;
        switch (type) {
            case GlobalStoreActionType.CHANGE_HOME_VIEW: {
                return setStore(prev => ({
                    ...prev,
                    currentHomeView: payload,
                    searchText: null
                }));
            }
            case GlobalStoreActionType.CHANGE_PUBLISHED_SORT_DIRECTION: {
                return setStore(prev => ({
                    ...prev,
                    publishedSortDirection: payload
                }));
            } case GlobalStoreActionType.CHANGE_UNPUBLISHED_SORT_DIRECTION: {
                return setStore(prev => ({
                    ...prev,
                    unpublishedSortDirection: payload
                }));
            } case GlobalStoreActionType.CHANGE_SEARCH_TEXT: {
                return setStore(prev => ({
                    ...prev,
                    searchText: payload
                }));
            } case GlobalStoreActionType.CHANGE_LOADED_PLAYLISTS: {
                return setStore(prev => ({
                    ...prev,
                    loadedPlaylists: payload
                }));
            } case GlobalStoreActionType.CHANGE_EXPANDED_PLAYLIST: {
                return setStore(prev => ({
                    ...prev,
                    expandedPlaylist: payload,
                    markedSongIndex: -1
                }));
            } case GlobalStoreActionType.UPDATE_PLAYLIST: {
                return setStore(prev => {
                    const idx = prev.loadedPlaylists.findIndex((playlist) => playlist._id === payload._id);
                    const updatedPlaylists = [...prev.loadedPlaylists.slice(0, idx), payload, ...prev.loadedPlaylists.slice(idx + 1)];
                    return {
                        ...prev,
                        loadedPlaylists: updatedPlaylists
                    }
                })
            } case GlobalStoreActionType.CHANGE_MODAL: {
                return setStore(prev => ({
                    ...prev,
                    currentModal: payload
                }));
            } case GlobalStoreActionType.CHANGE_MARKED_SONG_INDEX: {
                return setStore(prev => ({
                    ...prev,
                    markedSongIndex: payload
                }));
            }
            // // LIST UPDATE OF ITS NAME
            // case GlobalStoreActionType.CHANGE_LIST_NAME: {
            //     return setStore(prev => ({
            //         currentModal : CurrentModal.NONE,
            //         idNamePairs: payload.idNamePairs,
            //         currentList: payload.playlist,
            //         currentSongIndex: -1,
            //         currentSong: null,
            //         newListCounter: prev.newListCounter,
            //         listNameActive: false,
            //         listIdMarkedForDeletion: null,
            //         listMarkedForDeletion: null
            //     }));
            // }
            // // STOP EDITING THE CURRENT LIST
            // case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
            //     return setStore(prev => ({
            //         currentModal : CurrentModal.NONE,
            //         idNamePairs: prev.idNamePairs,
            //         currentList: null,
            //         currentSongIndex: -1,
            //         currentSong: null,
            //         newListCounter: prev.newListCounter,
            //         listNameActive: false,
            //         listIdMarkedForDeletion: null,
            //         listMarkedForDeletion: null
            //     }));
            // }
            // // CREATE A NEW LIST
            // case GlobalStoreActionType.CREATE_NEW_LIST: {                
            //     return setStore(prev => ({
            //         currentModal : CurrentModal.NONE,
            //         idNamePairs: prev.idNamePairs,
            //         currentList: payload,
            //         currentSongIndex: -1,
            //         currentSong: null,
            //         newListCounter: prev.newListCounter + 1,
            //         listNameActive: false,
            //         listIdMarkedForDeletion: null,
            //         listMarkedForDeletion: null
            //     }));
            // }
            // // GET ALL THE LISTS SO WE CAN PRESENT THEM
            // case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
            //     return setStore(prev => ({
            //         currentModal : CurrentModal.NONE,
            //         idNamePairs: payload,
            //         currentList: null,
            //         currentSongIndex: -1,
            //         currentSong: null,
            //         newListCounter: prev.newListCounter,
            //         listNameActive: false,
            //         listIdMarkedForDeletion: null,
            //         listMarkedForDeletion: null
            //     }));
            // }
            // // PREPARE TO DELETE A LIST
            // case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
            //     return setStore(prev => ({
            //         currentModal : CurrentModal.DELETE_LIST,
            //         idNamePairs: prev.idNamePairs,
            //         currentList: null,
            //         currentSongIndex: -1,
            //         currentSong: null,
            //         newListCounter: prev.newListCounter,
            //         listNameActive: false,
            //         listIdMarkedForDeletion: payload.id,
            //         listMarkedForDeletion: payload.playlist
            //     }));
            // }
            // // UPDATE A LIST
            // case GlobalStoreActionType.SET_CURRENT_LIST: {
            //     return setStore(prev => ({
            //         currentModal : CurrentModal.NONE,
            //         idNamePairs: prev.idNamePairs,
            //         currentList: payload,
            //         currentSongIndex: -1,
            //         currentSong: null,
            //         newListCounter: prev.newListCounter,
            //         listNameActive: false,
            //         listIdMarkedForDeletion: null,
            //         listMarkedForDeletion: null
            //     }));
            // }
            // // START EDITING A LIST NAME
            // case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
            //     return setStore(prev => ({
            //         currentModal : CurrentModal.NONE,
            //         idNamePairs: prev.idNamePairs,
            //         currentList: payload,
            //         currentSongIndex: -1,
            //         currentSong: null,
            //         newListCounter: prev.newListCounter,
            //         listNameActive: true,
            //         listIdMarkedForDeletion: null,
            //         listMarkedForDeletion: null
            //     }));
            // }
            // // 
            // case GlobalStoreActionType.EDIT_SONG: {
            //     return setStore(prev => ({
            //         currentModal : CurrentModal.EDIT_SONG,
            //         idNamePairs: prev.idNamePairs,
            //         currentList: prev.currentList,
            //         currentSongIndex: payload.currentSongIndex,
            //         currentSong: payload.currentSong,
            //         newListCounter: prev.newListCounter,
            //         listNameActive: false,
            //         listIdMarkedForDeletion: null,
            //         listMarkedForDeletion: null
            //     }));
            // }
            // case GlobalStoreActionType.REMOVE_SONG: {
            //     return setStore(prev => ({
            //         currentModal : CurrentModal.REMOVE_SONG,
            //         idNamePairs: prev.idNamePairs,
            //         currentList: prev.currentList,
            //         currentSongIndex: payload.currentSongIndex,
            //         currentSong: payload.currentSong,
            //         newListCounter: prev.newListCounter,
            //         listNameActive: false,
            //         listIdMarkedForDeletion: null,
            //         listMarkedForDeletion: null
            //     }));
            // }
            // case GlobalStoreActionType.HIDE_MODALS: {
            //     return setStore(prev => ({
            //         currentModal : CurrentModal.NONE,
            //         idNamePairs: prev.idNamePairs,
            //         currentList: prev.currentList,
            //         currentSongIndex: -1,
            //         currentSong: null,
            //         newListCounter: prev.newListCounter,
            //         listNameActive: false,
            //         listIdMarkedForDeletion: null,
            //         listMarkedForDeletion: null
            //     }));
            // }
            // case GlobalStoreActionType.INIT: {
            //     return setStore(prev => ({
            //         currentModal : CurrentModal.NONE,
            //         idNamePairs: [],
            //         currentList: null,
            //         currentSongIndex : -1,
            //         currentSong : null,
            //         newListCounter: 0,
            //         listNameActive: false,
            //         listIdMarkedForDeletion: null,
            //         listMarkedForDeletion: null
            //     }));
            // }
            default:
                return store;
        }
    }

    store.loadPlaylistsWrapper = (newView: HomeView) => {
        if (newView === HomeView.OWN) {
            store.loadOwnPlaylists();
        } else if (newView === HomeView.ALL) {
            store.loadAllPlaylists();
        } else if (newView === HomeView.USER) {
            store.loadUserPlaylists("");
        }
    }

    store.setHomeView = async (newView: HomeView) => {
        // if (newView === HomeView.OWN) {
        //     store.loadOwnPlaylists();
        // } else if (newView === HomeView.ALL) {
        //     store.loadAllPlaylists();
        // } else if (newView === HomeView.USER) {
        //     store.loadUserPlaylists("");
        // }
        store.loadPlaylistsWrapper(newView);
        store.setExpandedPlaylist(null);
        storeReducer({ type: GlobalStoreActionType.CHANGE_HOME_VIEW, payload: newView });
        // setTimeout(() => {
        //     store.loadPlaylistsWrapper();
        // }, 1000);
        // store.loadPlaylistsWrapper();
    }

    store.setUnpublishedSortDirection = (newSortDirection: UnpublishedSortDirection) => {
        storeReducer({ type: GlobalStoreActionType.CHANGE_UNPUBLISHED_SORT_DIRECTION, payload: newSortDirection });
    }

    store.setPublishedSortDirection = (newSortDirection: PublishedSortDirection) => {
        storeReducer({ type: GlobalStoreActionType.CHANGE_PUBLISHED_SORT_DIRECTION, payload: newSortDirection });
    }

    store.setSearchText = (newSearchText: string) => {
        storeReducer({ type: GlobalStoreActionType.CHANGE_SEARCH_TEXT, payload: newSearchText });
    }

    store.loadOwnPlaylists = async () => {
        const res = await getPlaylists("own");
        if (res.error === true) {
            console.error("Couldn't get own playlists");
            return;
        }
        storeReducer({ type: GlobalStoreActionType.CHANGE_LOADED_PLAYLISTS, payload: res.playlists });
    }

    store.loadAllPlaylists = async () => {
        const res = await getPlaylists("all");
        if (res.error === true) {
            console.error("Couldn't get all playlists");
            return;
        }
        storeReducer({ type: GlobalStoreActionType.CHANGE_LOADED_PLAYLISTS, payload: res.playlists });
    }

    store.loadUserPlaylists = async (username: string) => {
        const res = await getPlaylists("user", username);
        if (res.error === true) {
            console.error("Couldn't get user playlists");
            return;
        }
        storeReducer({ type: GlobalStoreActionType.CHANGE_LOADED_PLAYLISTS, payload: res.playlists });
    }

    store.createPlaylist = async (name, songs) => {
        const res = await createPlaylist(name, songs);
        store.loadPlaylistsWrapper(HomeView.OWN);
    }

    store.setExpandedPlaylist = (playlist: Playlist) => {
        storeReducer({ type: GlobalStoreActionType.CHANGE_EXPANDED_PLAYLIST, payload: playlist });
        store.clearAllTransactions();
    }

    store.clearAllTransactions = () => {
        tps.clearAllTransactions();
    }

    store.addCreateSongTransaction = (index, title, artist, youTubeId) => {
        // ADD A SONG ITEM AND ITS NUMBER
        let song = {
            title: title,
            artist: artist,
            youTubeId: youTubeId
        };
        let transaction = new CreateSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }

    store.addMoveSongTransaction = (start, end) => {
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
    store.addRemoveSongTransaction = (index) => {
        let song = store.expandedPlaylist.songs[index];
        let transaction = new RemoveSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }

    store.addUpdateSongTransaction = (index, title: string, artist: string, youTubeId: string) => {
        let song = store.expandedPlaylist.songs[index];
        let oldSongData = {
            title: song.title,
            artist: song.artist,
            youTubeId: song.youTubeId
        };
        let newSongData = {
            title, artist, youTubeId
        };
        let transaction = new UpdateSong_Transaction(this, index, oldSongData, newSongData);
        tps.addTransaction(transaction);
    }

    store.updateExpandedPlaylist = async () => {
        const response = await updatePlaylistDetails(store.expandedPlaylist);
        if (response && 'playlist' in response) {
            storeReducer({
                type: GlobalStoreActionType.UPDATE_PLAYLIST,
                payload: response.playlist
            });
            storeReducer({
                type: GlobalStoreActionType.CHANGE_EXPANDED_PLAYLIST,
                payload: response.playlist
            });
        } else {
            console.error("uh oh");
        }
    }

    store.publishExpandedPlaylist = async () => {
        store.expandedPlaylist.isPublished = true;
        const response = await updatePlaylistDetails(store.expandedPlaylist);
        if (response && 'playlist' in response) {
            storeReducer({
                type: GlobalStoreActionType.UPDATE_PLAYLIST,
                payload: response.playlist
            });
            storeReducer({
                type: GlobalStoreActionType.CHANGE_EXPANDED_PLAYLIST,
                payload: response.playlist
            });
        } else {
            console.error("uh oh");
        }
    }

    store.deleteExpandedPlaylist = async () => {
        const res = await deletePlaylist(store.expandedPlaylist);
        if (res.error === true) {
            console.error("failed to delete playlist: " + res.errorMsg);
        }
        storeReducer({ type: GlobalStoreActionType.CHANGE_LOADED_PLAYLISTS, payload: store.loadedPlaylists.filter((playlist) => playlist._id !== store.expandedPlaylist._id) });
        storeReducer({ type: GlobalStoreActionType.CHANGE_EXPANDED_PLAYLIST, payload: null });
    }

    store.setModal = (modal: ModalType) => {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_MODAL,
            payload: modal
        })
    }

    store.setMarkedSongIndex = (index: number) => {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_MARKED_SONG_INDEX,
            payload: index
        });
    }

    store.createSong = (index: number, song: { title: string, artist: string, youTubeId: string }) => {
        store.expandedPlaylist.songs.splice(index, 0, song);
        store.updateExpandedPlaylist();
    }

    store.removeSong = (index: number) => {
        store.expandedPlaylist.songs.splice(index, 1);
        store.updateExpandedPlaylist();
    }

    store.moveSong = (start: number, end: number) => {
        const list = store.expandedPlaylist;
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }

        store.updateExpandedPlaylist();
    }

    store.updateSong = (index: number, song: { title: string, artist: string, youTubeId: string }) => {
        store.expandedPlaylist.songs[index].artist = song.artist;
        store.expandedPlaylist.songs[index].title = song.title;
        store.expandedPlaylist.songs[index].youTubeId = song.youTubeId;
        store.updateExpandedPlaylist();
    }

    store.undo = () => {
        tps.undoTransaction();
    }

    store.redo = () => {
        tps.doTransaction();
    }

    store.canUndo = () => {
        return tps.hasTransactionToUndo();
    }

    store.canRedo = () => {
        return tps.hasTransactionToRedo();
    }

    // store.init = () => {
    //     storeReducer({type: GlobalStoreActionType.INIT, payload: null});
    // }

    // // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    // store.changeListName = function (id, newName) {
    //     // GET THE LIST
    //     async function asyncChangeListName(id) {
    //         let response = await api.getPlaylistById(id);
    //         if (response.data.success) {
    //             let playlist = response.data.playlist;
    //             playlist.name = newName;
    //             async function updateList(playlist) {
    //                 response = await api.updatePlaylistById(playlist._id, playlist);
    //                 if (response.data.success) {
    //                     async function getListPairs(playlist) {
    //                         response = await api.getPlaylistPairs();
    //                         if (response.data.success) {
    //                             let pairsArray = response.data.idNamePairs;
    //                             storeReducer({
    //                                 type: GlobalStoreActionType.CHANGE_LIST_NAME,
    //                                 payload: {
    //                                     idNamePairs: pairsArray,
    //                                     // playlist: playlist
    //                                     playlist: null
    //                                 }
    //                             });
    //                         }
    //                     }
    //                     getListPairs(playlist);
    //                 }
    //             }
    //             updateList(playlist);
    //         }
    //     }
    //     asyncChangeListName(id);
    // }

    // // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    // store.closeCurrentList = function () {
    //     storeReducer({
    //         type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
    //         payload: {}
    //     });
    //     history.push("/");
    //     tps.clearAllTransactions();
    // }

    // store.clearAllTransactions = function () {
    //     tps.clearAllTransactions();
    // }

    // // THIS FUNCTION CREATES A NEW LIST
    // store.createNewList = async function () {
    //     let newListName = "Untitled" + store.newListCounter;
    //     const response = await api.createPlaylist(newListName, [], auth.user.email);
    //     console.log("createNewList response: " + response);
    //     if (response.status === 201) {
    //         tps.clearAllTransactions();
    //         let newList = response.data.playlist;
    //         storeReducer({
    //             type: GlobalStoreActionType.CREATE_NEW_LIST,
    //             payload: newList
    //         }
    //         );

    //         // IF IT'S A VALID LIST THEN LET'S START EDITING IT
    //         history.push("/playlist/" + newList._id);
    //     }
    //     else {
    //         console.log("API FAILED TO CREATE A NEW LIST");
    //     }
    // }

    // // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    // store.loadIdNamePairs = function () {
    //     async function asyncLoadIdNamePairs() {
    //         const response = await api.getPlaylistPairs();
    //         if (response.data.success) {
    //             let pairsArray = response.data.idNamePairs;
    //             storeReducer({
    //                 type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
    //                 payload: pairsArray
    //             });
    //         }
    //         else {
    //             console.log("API FAILED TO GET THE LIST PAIRS");
    //         }
    //     }
    //     asyncLoadIdNamePairs();
    // }

    // // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // // showDeleteListModal, and hideDeleteListModal
    // store.markListForDeletion = function (id) {
    //     async function getListToDelete(id) {
    //         let response = await api.getPlaylistById(id);
    //         if (response.data.success) {
    //             let playlist = response.data.playlist;
    //             storeReducer({
    //                 type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
    //                 payload: {id: id, playlist: playlist}
    //             });
    //         }
    //     }
    //     getListToDelete(id);
    // }

    // store.unmarkListForDeletion = function () {
    //     store.loadIdNamePairs();
    // }

    // store.deleteList = function (id) {
    //     async function processDelete(id) {
    //         let response = await api.deletePlaylistById(id);
    //         if (response.data.success) {
    //             store.loadIdNamePairs();
    //             history.push("/");
    //         }
    //     }
    //     processDelete(id);
    // }
    // store.deleteMarkedList = function() {
    //     store.deleteList(store.listIdMarkedForDeletion);
    //     store.hideModals();
    // }
    // // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // // TO SEE IF THEY REALLY WANT TO DELETE THE LIST

    // store.showEditSongModal = (songIndex, songToEdit) => {
    //     storeReducer({
    //         type: GlobalStoreActionType.EDIT_SONG,
    //         payload: {currentSongIndex: songIndex, currentSong: songToEdit}
    //     });        
    // }
    // store.showRemoveSongModal = (songIndex, songToRemove) => {
    //     storeReducer({
    //         type: GlobalStoreActionType.REMOVE_SONG,
    //         payload: {currentSongIndex: songIndex, currentSong: songToRemove}
    //     });        
    // }
    // store.hideModals = () => {
    //     storeReducer({
    //         type: GlobalStoreActionType.HIDE_MODALS,
    //         payload: {}
    //     });    
    // }
    // store.isDeleteListModalOpen = () => {
    //     return store.currentModal === CurrentModal.DELETE_LIST;
    // }
    // store.isEditSongModalOpen = () => {
    //     return store.currentModal === CurrentModal.EDIT_SONG;
    // }
    // store.isRemoveSongModalOpen = () => {
    //     return store.currentModal === CurrentModal.REMOVE_SONG;
    // }

    // // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // // moveItem, updateItem, updateCurrentList, undo, and redo
    // store.setCurrentList = function (id) {
    //     async function asyncSetCurrentList(id) {
    //         let response = await api.getPlaylistById(id);
    //         if (response.data.success) {
    //             let playlist = response.data.playlist;

    //             response = await api.updatePlaylistById(playlist._id, playlist);
    //             if (response.data.success) {
    //                 storeReducer({
    //                     type: GlobalStoreActionType.SET_CURRENT_LIST,
    //                     payload: playlist
    //                 });
    //                 history.push("/playlist/" + playlist._id);
    //             }
    //         }
    //     }
    //     asyncSetCurrentList(id);
    // }

    // store.getPlaylistSize = function() {
    //     return store.currentList.songs.length;
    // }
    // // store.addNewSong = function() {
    // //     let index = this.getPlaylistSize();
    // //     this.addCreateSongTransaction(index, "Untitled", "Unknown", "dQw4w9WgXcQ");
    // // }
    // // THIS FUNCTION CREATES A NEW SONG IN THE CURRENT LIST
    // // USING THE PROVIDED DATA AND PUTS THIS SONG AT INDEX
    // store.createSong = function(index, song) {
    //     let list = store.currentList;      
    //     list.songs.splice(index, 0, song);
    //     // NOW MAKE IT OFFICIAL
    //     store.updateCurrentList();
    // }
    // // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    // store.moveSong = function(start, end) {
    //     let list = store.currentList;

    //     // WE NEED TO UPDATE THE STATE FOR THE APP
    //     if (start < end) {
    //         let temp = list.songs[start];
    //         for (let i = start; i < end; i++) {
    //             list.songs[i] = list.songs[i + 1];
    //         }
    //         list.songs[end] = temp;
    //     }
    //     else if (start > end) {
    //         let temp = list.songs[start];
    //         for (let i = start; i > end; i--) {
    //             list.songs[i] = list.songs[i - 1];
    //         }
    //         list.songs[end] = temp;
    //     }

    //     // NOW MAKE IT OFFICIAL
    //     store.updateCurrentList();
    // }
    // // THIS FUNCTION REMOVES THE SONG AT THE index LOCATION
    // // FROM THE CURRENT LIST
    // store.removeSong = function(index) {
    //     let list = store.currentList;      
    //     list.songs.splice(index, 1); 

    //     // NOW MAKE IT OFFICIAL
    //     store.updateCurrentList();
    // }
    // // THIS FUNCTION UPDATES THE TEXT IN THE ITEM AT index TO text
    // store.updateSong = function(index, songData) {
    //     let list = store.currentList;
    //     let song = list.songs[index];
    //     song.title = songData.title;
    //     song.artist = songData.artist;
    //     song.youTubeId = songData.youTubeId;

    //     // NOW MAKE IT OFFICIAL
    //     store.updateCurrentList();
    // }
    // store.addNewSong = () => {
    //     let playlistSize = store.getPlaylistSize();
    //     store.addCreateSongTransaction(
    //         playlistSize, "Untitled", "Unknown", "dQw4w9WgXcQ");
    // }
    // // THIS FUNCDTION ADDS A CreateSong_Transaction TO THE TRANSACTION STACK
    // store.addCreateSongTransaction = (index, title, artist, youTubeId) => {
    //     // ADD A SONG ITEM AND ITS NUMBER
    //     let song = {
    //         title: title,
    //         artist: artist,
    //         youTubeId: youTubeId
    //     };
    //     let transaction = new CreateSong_Transaction(store, index, song);
    //     tps.addTransaction(transaction);
    // }    
    // store.addMoveSongTransaction = function (start, end) {
    //     let transaction = new MoveSong_Transaction(store, start, end);
    //     tps.addTransaction(transaction);
    // }
    // // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
    // store.addRemoveSongTransaction = () => {
    //     let index = store.currentSongIndex;
    //     let song = store.currentList.songs[index];
    //     let transaction = new RemoveSong_Transaction(store, index, song);
    //     tps.addTransaction(transaction);
    // }
    // store.addUpdateSongTransaction = function (index, newSongData) {
    //     let song = store.currentList.songs[index];
    //     let oldSongData = {
    //         title: song.title,
    //         artist: song.artist,
    //         youTubeId: song.youTubeId
    //     };
    //     let transaction = new UpdateSong_Transaction(this, index, oldSongData, newSongData);        
    //     tps.addTransaction(transaction);
    // }
    // store.updateCurrentList = function() {
    //     async function asyncUpdateCurrentList() {
    //         const response = await api.updatePlaylistById(store.currentList._id, store.currentList);
    //         if (response.data.success) {
    //             storeReducer({
    //                 type: GlobalStoreActionType.SET_CURRENT_LIST,
    //                 payload: store.currentList
    //             });
    //         }
    //     }
    //     asyncUpdateCurrentList();
    // }
    // store.undo = function () {
    //     tps.undoTransaction();
    // }
    // store.redo = function () {
    //     tps.doTransaction();
    // }
    // store.canAddNewSong = function() {
    //     return store.currentList !== null && store.currentModal === CurrentModal.NONE;
    // }
    // store.canUndo = function() {
    //     return (store.currentList !== null) && tps.hasTransactionToUndo() && store.currentModal === CurrentModal.NONE;
    // }
    // store.canRedo = function() {
    //     return (store.currentList !== null) && tps.hasTransactionToRedo() && store.currentModal === CurrentModal.NONE;
    // }
    // store.canClose = function() {
    //     return store.currentList !== null && store.currentModal === CurrentModal.NONE;
    // }

    // // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    // store.setIsListNameEditActive = function () {
    //     storeReducer({
    //         type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
    //         payload: null
    //     });
    // }

    return (
        <GlobalStoreContext.Provider value={store}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}