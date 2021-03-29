import { Transform } from 'stream';
// Thankful for top level await
import { db,  client } from './db.mjs'

export class WritePerson extends Transform {
    collection
    _transform(obj, encoding, cb) {
        this.collection.insertOne(obj).then(({
            insertedCount,
            insertedId,
            result
        }) => this.push({ insertedCount, insertedId, result }))
            .then(() => cb())
            .catch(cb)
    }
    constructor({ name }){
        super({ readableObjectMode: true, writableObjectMode: true });
        this.collection = db.collection(name)
    }
}

export class WritePeople extends Transform {
    session
    collection
    _destroy(err, cb) {
        this.session.endSession();
        cb(err); 
    }
    _flush(cb) {
        this.session.commitTransaction()
            .then((res) => cb())
            .catch((err) => cb(err))
            .finally(() => this.session.endSession())
    }
    _transform(obj, encoding, cb) {
        try {
            this.collection.insertOne(obj, { session: this.session })
                .then(({ insertedId }) => this.push({ insertedId }))
            cb()
        } catch (err) {
            cb(err)
        }
    }
    constructor({ name }){
        super({ readableObjectMode: true, writableObjectMode: true })
        this.session = client.startSession()
        this.collection = db.collection(name)
        this.session.startTransaction()
    }
}

export class ReadInsertResponse extends Transform {
    fulldata = []
    _destroy(err, cb) {
        cb(err)
    }
    _flush(cb) {
        cb(null, JSON.stringify(this.fulldata))
    }
    _transform({ insertedId }, _encoding, cb) {
        // console.log('insertedi', insertedId)
        this.fulldata.push(insertedId)
        cb()
    }
    constructor() {
        super({ writableObjectMode: true })
    }
}
