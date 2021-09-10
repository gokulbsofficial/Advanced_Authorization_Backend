import { MongoClientOptions } from 'mongodb';
import { MongoClient, AnyError, Db } from 'mongodb';
import config from './default';

const { MONGO_DATABASE, MONGO_URL } = config.MONGO;

const MONGO_OPTIONS: MongoClientOptions = {

}

const state: { db?: Db | null } = {
    db: null
}

const connect = (done: any) => {
    MongoClient.connect(MONGO_URL, MONGO_OPTIONS, (err: AnyError | undefined, client: MongoClient | undefined) => {
        if (err) {
            done(err)
        } else {
            state.db = client?.db(MONGO_DATABASE)
            done()
        }
    })
}

const get = () => {
    return state.db
}

export default { connect, get }