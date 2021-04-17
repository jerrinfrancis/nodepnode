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
        this.collection.insertOne(obj, { session: this.session })
            .then(({ insertedId }) => this.push({ insertedId }))
            .then(() => cb())
            .catch(cb)
    }
    constructor({ name }){
        super({ readableObjectMode: true, writableObjectMode: true })
        this.session = client.startSession()
        this.collection = db.collection(name)
        this.session.startTransaction()
    }
}

export class ReadInsertResponse extends Transform {
    first = true;
    _destroy(err, cb) {
        cb(err)
    }
    _flush(cb) {
        cb(null, "]")
    }
    _transform({ insertedId }, _encoding, cb) {
        if (this.first) {
            this.first = false;
            return cb(null, `[${JSON.stringify(insertedId)}`)
        }
        cb(null, `,${JSON.stringify(insertedId)}`)
    }
    constructor() {
        super({ writableObjectMode: true })
    }
}
