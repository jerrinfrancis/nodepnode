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

const objectifier = (header) =>  (line) => header.reduce((obj, h, i) => ({ ...obj, [h]: JSON.parse(line[i]) }), {})

export class CsvStringToPeople extends Transform {
    _headers
    _objectify
    _destroy(err, cb) {
        cb(err)
    }
    _transform(line, encoding, cb) {
        try {
            if (!this._headers) {
                this._headers = line.split(',').map(l => JSON.parse(l.trim('\r')))
                this._objectify = objectifier(this._headers)
                return cb()
            }
            cb(null, new Person(this._objectify(line.split(','))))
        } catch (err) {
            cb(err)
        }
        
    }

    constructor() {
        super({ readableObjectMode: true, writableObjectMode: true })
    }
}
