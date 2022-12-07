import {TPS} from "../common/tps"

/**
 * DeleteSong_Transaction
 * 
 * This class represents a transaction that deletes a song
 * in the playlist. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export class RemoveSong_Transaction extends TPS {
    store: any;
    index: any;
    song: any;

    constructor(initStore: any, initIndex: any, initSong: any) {
        super();
        this.store = initStore;
        this.index = initIndex;
        this.song = initSong;
    }

    doTransaction() {
        this.store.removeSong(this.index);
    }
    
    undoTransaction() {
        this.store.createSong(this.index, this.song);
    }
}