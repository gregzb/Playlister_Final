import {TPS} from "../common/tps"
/**
 * CreateSong_Transaction
 * 
 * This class represents a transaction that creates a song
 * in the playlist. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export class CreateSong_Transaction extends TPS {
    store: any;
    index: number;
    song: {title: String, artist: String, youTubeId: string};

    constructor(initStore: any, initIndex: number, initSong: {title: String, artist: String, youTubeId: string}) {
        super();
        this.store = initStore;
        this.index = initIndex;
        this.song = initSong;
    }

    doTransaction() {
        this.store.createSong(this.index, this.song);
    }
    
    undoTransaction() {
        this.store.removeSong(this.index);
    }
}