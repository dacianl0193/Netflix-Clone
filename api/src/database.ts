import { MongoClient, Db, Filter, UpdateFilter, UpdateOptions, WithId } from "mongodb";

interface DatabaseOptions {
    uri: string,
    database: string
}

export class Database {

    public readonly mongoClient: MongoClient;
    public readonly database: Db;

    constructor({ uri, database }: DatabaseOptions) {
        try {
            this.mongoClient = new MongoClient(uri);
            this.database = this.mongoClient.db(database);
        } catch (e) {
            throw new DatabaseError(e.message);
        }
    }

    public findOne = async (collection: string, identifier: { [key: string]: string }): Promise<WithId<any>> => {
        return await this.database.collection(collection).findOne(identifier);
    }
    
    public findAll = async (collection: string): Promise<WithId<any>[]> => {
        return await this.database.collection(collection).find({}).toArray();
    }
    
    public insertOne = async (collection: string, object: any): Promise<void> => {
        await this.database.collection(collection).insertOne(object);
    }
    
    public updateOne = async (collection: string, filter: Filter<any>, update: UpdateFilter<any>, options?: UpdateOptions): Promise<void> => {
        await this.database.collection(collection).updateOne(filter, update, options);
    }
    
    public deleteOne = async (collection: string, identifier: { [key: string]: string }): Promise<void> => {
        await this.database.collection(collection).deleteOne(identifier);
    }
    
    public count = async (collection: string): Promise<number> => {
        return await this.database.collection(collection).countDocuments();
    }
    
    public close = async (): Promise<void> => {
        await this.mongoClient.close();
    }
}

export class DatabaseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DatabaseError";
    }
}