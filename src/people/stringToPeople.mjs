import { Transform } from 'stream';
import { Person } from './person.mjs'

export class StringToPerson extends Transform {
     fulldata = ''
    _flush(cb) {
        try {
            cb(null, new Person(JSON.parse(this.fulldata)))
        } catch (err) {
            cb(err)
        }
    }
    _transform(chunk, encoding, cb) {
        try {
            const isUtf8 =  (['utf8', 'utf-8'].includes(encoding))
            const data = isUtf8 && chunk || chunk.toString()
            this.fulldata += data;
            cb()
        } catch (err) {
            cb(err)
        }
    }
    constructor() {
        super({ readableObjectMode: true, writableObjectMode: true })
    }
}

export class StringToPeople extends Transform {
    fulldata = ''
    _flush(cb) {
        try {
            const objs = JSON.parse(this.fulldata)
            objs.forEach(o => this.push(new Person(o)))
            cb()
        } catch (err) {
            cb(err)
        }
    }
    _transform(chunk, encoding, cb) {
        try {
            const isUtf8 =  (['utf8', 'utf-8'].includes(encoding))
            const data = isUtf8 && chunk || chunk.toString()
            this.fulldata += data;
            cb()
        } catch (err) {
            cb(err)
        }
    }
    constructor() {
        super({ readableObjectMode: true, writableObjectMode: true })
    }
}
