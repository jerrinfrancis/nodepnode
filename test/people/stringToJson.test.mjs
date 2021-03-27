import { StringToPerson, StringToPeople } from '../../src/people/stringToPeople.mjs';
import { Person } from '../../src/people/person.mjs';
import { Readable, Transform } from 'stream';
import { strict } from 'assert';

const testPerson = {
    id: 10001,
    first_name: "Ak",
    last_name: "Hil",
    email: "jcockren0@shinystat.com",
    gender: "Genderfluid",
    ip_address: "93.220.138.40"
};

const testPeople = {
    [testPerson.id]: testPerson,
    2: {
        id: 2,
        first_name: "Rosalyn",
        last_name: "Spinas",
        email: "rspinas1@hugedomains.com",
        gender: "Genderqueer",
        ip_address: "151.89.134.225"
    }};

const readaperson = new Readable();
const readpeople = new Readable();
const outperson = new Transform({
    readableObjectMode: true,
    writableObjectMode: true,
    transform(chunk, encoding, callback) {
        try {
            strict.deepEqual(chunk, new Person(testPerson))
            this.push(JSON.stringify(chunk) + '\n');
            callback();
        } catch (err) {
            callback(err);
        }        
    }
});
const outpeople = new Transform({
    readableObjectMode: true,
    writableObjectMode: true,
    transform(chunk, encoding, callback) {
        try {
            strict.deepEqual(chunk, new Person(testPeople[chunk.id]))
            this.push(JSON.stringify(chunk) + '\n');
            callback();
        } catch (err) {
            callback(err);
        }        
    }
})

const person = new StringToPerson();
const people = new StringToPeople();

readaperson.push(JSON.stringify(testPerson));
readaperson.push(null);

readaperson
    .pipe(person)
    .pipe(outperson)
    .pipe(process.stdout)


readpeople.push(JSON.stringify(Object.values(testPeople)));
readpeople.push(null);

readpeople
    .pipe(people)
    .pipe(outpeople)
    .pipe(process.stdout)
