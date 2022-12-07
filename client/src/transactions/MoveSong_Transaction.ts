import {TPS} from "../common/tps"
/**
 * MoveSong_Transaction
 * 
 * This class represents a transaction that works with drag
 * and drop. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export class MoveSong_Transaction extends TPS {
    store: any;
    oldSongIndex: any;
    newSongIndex: any;

    constructor(initStore: any, initOldSongIndex: any, initNewSongIndex: any) {
        super();
        this.store = initStore;
        this.oldSongIndex = initOldSongIndex;
        this.newSongIndex = initNewSongIndex;
    }

    doTransaction() {
        this.store.moveSong(this.oldSongIndex, this.newSongIndex);
    }
    
    undoTransaction() {
        this.store.moveSong(this.newSongIndex, this.oldSongIndex);
    }
}