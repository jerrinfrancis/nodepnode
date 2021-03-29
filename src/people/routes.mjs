import http from 'http'

import { WritePeople, ReadInsertResponse, WritePerson } from '../db/write.mjs';
import { CsvStringToPeople, StringToPerson } from './stringToPeople.mjs';
import { MultipartToCsv } from '../csv/csv.mjs';

const end = (response, err, status = 500) => {
    console.error(err);
    response.writeHead(status, http.STATUS_CODES[500])
    response.end(err.message)
    return response;
}

export const addPeople = (request, response) => {
    request.on('error', (err) => end(response, err));
    response.on('error', (err) => end(response, err));
    const csv = new MultipartToCsv().on('error',(err) => people.destroy(err))
    const people = new CsvStringToPeople().on('error', (err) => write.destroy(err))
    const write = new WritePeople({ name: 'people' }).on('error', (err) => end(response, err))
    const readResp = new ReadInsertResponse().on('error', (err) => end(response, err))
    request
        .pipe(csv)
        .pipe(people)
        .pipe(write)
        .pipe(readResp)
        .pipe(response)
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
}
