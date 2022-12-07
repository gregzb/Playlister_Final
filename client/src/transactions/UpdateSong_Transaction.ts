import {TPS} from "../common/tps"

/**
 * UpdateSong_Transaction
 * 
 * This class represents a transaction that updates a song
 * in the playlist. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export class UpdateSong_Transaction extends TPS {
    store: any;
    index: any;
    oldSongData: any;
    newSongData: any;

    constructor(initStore: any, initIndex: any, initOldSongData: any, initNewSongData: any) {
        super(); 
        this.store = initStore;
        this.index = initIndex;
        this.oldSongData = initOldSongData;
        this.newSongData = initNewSongData;
    }

    doTransaction() {
        this.store.updateSong(this.index, this.newSongData);
    }
    
    undoTransaction() {
        this.store.updateSong(this.index, this.oldSongData);
    }
}