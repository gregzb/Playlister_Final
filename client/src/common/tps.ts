export type Transaction = {
    doTransaction: () => void;
    undoTransaction: () => void;
};

export class TPS {
    transactions: Transaction[]
    mostRecentTransaction: number
    performingOp: boolean

    init = () => {
        this.transactions = [];
        this.mostRecentTransaction = -1;
        this.performingOp = false;
    }

    constructor() {
        this.init();
    }

    isPerformingOp = () => {
        return this.isPerformingOp;
    }

    /**
     * getSize
     * 
     * Accessor method for getting the number of transactions on the stack.
     */
    getSize = () => {
        return this.transactions.length;
    }

    /**
     * getRedoSize
     * 
     * Method for getting the total number of transactions on the stack
     * that can possibly be redone.
     */
    getRedoSize() {
        return this.getSize() - this.mostRecentTransaction - 1;
    }

    /**
     * getUndoSize
     * 
     * Method for getting the total number of transactions on the stack
     * that can possible be undone.
     */
    getUndoSize() {
        return this.mostRecentTransaction + 1;
    }

    /**
     * hasTransactionToRedo
     * 
     * Method for getting a boolean representing whether or not
     * there are transactions on the stack that can be redone.
     */
    hasTransactionToRedo() {
        return (this.mostRecentTransaction+1) < this.getSize();
    }

    /**
     * hasTransactionToUndo
     * 
     * Method for getting a boolean representing whehter or not
     * there are transactions on the stack that can be undone.
     */
    hasTransactionToUndo() {
        return this.mostRecentTransaction >= 0;
    }

    addTransaction(transaction: Transaction) {
        this.transactions.splice(this.mostRecentTransaction + 1, Infinity);
        this.transactions.push(transaction);
        this.doTransaction();
    }

    /**
     * doTransaction
     * 
     * Does the current transaction on the stack and advances the transaction
     * counter. Note this function may be invoked as a result of either adding
     * a transaction (which also does it), or redoing a transaction.
     */
    doTransaction() {
        if (this.hasTransactionToRedo()) {
            this.performingOp = true;
            this.transactions[this.mostRecentTransaction+1].doTransaction();
            this.mostRecentTransaction++;
            this.performingOp = false;
        }
    }

    /**
     * This function gets the most recently executed transaction on the 
     * TPS stack and undoes it, moving the TPS counter accordingly.
     */
    undoTransaction() {
        if (this.hasTransactionToUndo()) {
            this.performingOp = true;
            this.transactions[this.mostRecentTransaction].undoTransaction();
            this.mostRecentTransaction--;
            this.performingOp = false;
        }
    }

    /**
     * clearAllTransactions
     * 
     * Removes all the transactions from the TPS, leaving it with none.
     */
    clearAllTransactions() {
        this.init();
    }

    /**
     * toString
     * 
     * Builds and returns a textual represention of the full TPS and its stack.
     */
    toString() {        
        let text = "--Number of Transactions: " + this.getSize() + "\n";
        text += "--Current Index on Stack: " + this.mostRecentTransaction + "\n";
        text += "--Current Transaction Stack:\n";
        for (let i = 0; i <= this.mostRecentTransaction; i++) {
            let jT = this.transactions[i];
            text += "----" + jT.toString() + "\n";
        }
        return text;        
    }
}