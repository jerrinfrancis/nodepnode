import mongodb from 'mongodb';

const { MongoClient } = mongodb;

const url = 'mongodb://localhost:27017,localhost:27018,localhost:27019/stackfinance?replicaSet=mongodb-replicaset';

// Database Name

const dbName = 'nodep';

export const client = await MongoClient.connect(url);

export const db = client.db(dbName);
