import { WritePeople, ReadInsertResponse, WritePerson } from '../db/writeToCollection.mjs';
import { StringToPeople, StringToPerson } from './stringToPeople.mjs';

const end = (response, err, status = 500) => {
    console.error(err);
    response.writeHead(status)
    response.end(err.message)
    return response;
}

export const addPeople = (request, response) => {
    request.on('error', (err) => end(response, err));
    response.on('error', (err) => end(response, err));
    const people = new StringToPeople().on('error', (err) => write.destroy(err))
    const write = new WritePeople({ name: 'people' }).on('error', (err) => end(response, err))
    const readResp = new ReadInsertResponse().on('error', (err) => end(response, err))
    request
        .pipe(people)
        .pipe(write)
        .pipe(readResp)
        .pipe(response)
    
    response.writeHead(200, {'content-type': 'application/json'});
}

export const addPerson = (request, response) => {
    request.on('error', (err) => end(response, err));
    response.on('error', (err) => end(response, err));
    const person = new StringToPerson().on('error', (err) => write.destroy(err))
    const write = new WritePerson({ name: 'people' }).on('error', (err) => end(response, err))
    const readResp = new ReadInsertResponse().on('error', (err) => end(response, err))
    request
        .pipe(person)
        .pipe(write)
        .pipe(readResp)
        .pipe(response)
    
    response.writeHead(200, {'content-type': 'application/json'});
}
