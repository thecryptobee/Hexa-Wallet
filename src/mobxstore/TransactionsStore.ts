import { makeObservable, observable, action, computed, runInAction } from 'mobx'
import RESTUtils from '../utils/ln/RESTUtils'
import Transaction from '../models/Transaction'
export default class TransactionsStore {
    transactions: Array<Transaction> = []

    constructor() {
        makeObservable(this, {
            transactions: observable,
            fetchTransactions: action,
            reset: action
        })
    }

    reset = () => {
        this.transactions = []
    }

    public fetchTransactions = async (node: any) => {
        try {
            await RESTUtils.getTransactions(node).then((data: any) => {
                runInAction(() => {
                    this.transactions = data.transactions
                        .slice()
                        .reverse()
                        .map((tx: any) => new Transaction(tx))
                });
            })
        } catch {
            (err: any) => {
                console.log(err)
            }
        }
    };

}