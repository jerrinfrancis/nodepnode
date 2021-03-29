import { Transform } from 'stream'

const isIncomplete = (line) => (line[line.length - 1] !== '\r')

export class MultipartToCsv extends Transform {
    _idx = 0;
    _line = 0;
    _prev = '\r';
    _transform(chunk, encoding, cb) {
        const lines = chunk.toString().split('\n')
        if (this._idx === 0) { // first chunk
            if (this._line + lines.length < 5) {
                this._line += lines.length;
                return cb()
            }
        }
        const toPush = this._idx && lines || lines.splice(4 - this._line)
        if (this._prev != '\r') {
            toPush[0] = this._prev + toPush[0]
            this._prev = '\r'
        }
        if (isIncomplete(toPush.slice(-1))) {
            this._prev = toPush.pop()
        }
        while (toPush.length) {
            const str = toPush.shift();
            if (str  === '\r') break;
            this.push(str);
        }
        this._idx++
        cb()
    }
    constructor() {
        super({ readableObjectMode: true, writableObjectMode: true })
    }
}
