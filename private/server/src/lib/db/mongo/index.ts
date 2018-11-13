import { MongoClient } from 'mongodb';
import { IDBConfig } from '..';

export async function Connect(dbConfig: IDBConfig) {
    const { url, name } = dbConfig;
    const client = new MongoClient(url, { useNewUrlParser: true });
    await client.connect();
    return client.db(name);
}

export * from './repo_mongo';
