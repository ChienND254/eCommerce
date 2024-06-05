import * as mongoose from 'mongoose';
import {countConnect} from '../helpers/check.connect';
import config from '../configs/config.mongodb'
const {host, port, name} = config.db
const connectString: string = `mongodb://${host}:${port}/${name}`;
console.log(connectString)
class Database {
    static instance: Database;
    private constructor(){
        this.connect()
    }

    private async connect(type = 'mongodb') {
        if (true) {
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true });
        }
        try {
            await mongoose.connect(connectString);
            console.log('Connected to MongoDB');
            await countConnect();
        } catch (err) {
            console.log(`Error connecting to MongoDB: ${err}`);
        }
    }
    
    static getInstance():Database {
        if (!Database.instance) {
            Database.instance = new Database()
        }

        return Database.instance
    }
}

const instanceMongodb = Database.getInstance()

export default instanceMongodb;