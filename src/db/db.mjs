import mongodb from 'mongodb';

const { MongoClient } = mongodb;

const url = 'mongodb://localhost:30003';

// Database Name

const dbName = 'nodep';

export const client = await MongoClient.connect(url);

export const db = client.db(dbName);
