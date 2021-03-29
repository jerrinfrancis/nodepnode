import http from 'http';

import { addPeople, addPerson } from './people/routes.mjs';

const notFound = (req, res) => {
    res.writeHead(404);
    res.end(`${req.method} ${req.url}`);
}

const logger = (req) => {
    const d = new Date()
    console.time(`${d.toISOString()} : ${req.method} ${req.headers.host}${req.url}`)
    req.on('end', () => console.timeEnd(`${d.toISOString()} : ${req.method} ${req.headers.host}${req.url}`))
}

const server = http.createServer(logger);

const routes = {
    '/addPeople': addPeople,
    '/addPerson': addPerson
}

server.on('request', (request, response) => {
    response.writeHead(200, {'content-type': 'application/json'});
    const route = routes[request.url];
    if (!route) return notFound(request, response)
    return route(request, response)
})
server.listen(3002)
