import { Transform } from 'stream';

export class StringToJsonStream extends Transform {
    fulldata = ''
    _flush(cb) {
        const objs = JSON.parse(this.fulldata)
        objs.forEach(o => this.push(o))
        cb()
    }
    _transform(chunk, encoding, cb) {
        const isUtf8 =  (['utf8', 'utf-8'].includes(encoding))
        const data = isUtf8 && chunk || chunk.toString()
        this.fulldata += data;
        cb()
    }
    constructor() {
        super({ readableObjectMode: true, writableObjectMode: true })
    }
}
