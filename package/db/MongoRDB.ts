import { MongoClient, ObjectId, Db } from 'mongodb';

interface MongoRDBDef {
  connect(): Promise<any>;
  insert(dbName, collectionName, jsonArr): Promise<any>;
  find(dbName, collectionName, json): Promise<any>;
  remove(dbName, collectionName, json): Promise<any>;
  update(dbName, collectionName, filter, json): Promise<any>;
  getObjectId(id: string): ObjectId;
}

module.exports = class MongoRDB implements MongoRDBDef {
  private url: string;
  private client: MongoClient | null = null;

  constructor(url) {
    this.url = url;
    this.client = null;
    this.connect();
  }

  connect() {
    return new Promise((resolve, reject) => {
      if (!this.client) {
        MongoClient.connect(this.url)
          .then((client) => {
            this.client = client;
            resolve(this.client);
          })
          .catch((err) => {
            reject(err);
          });
      } else {
        resolve(this.client);
      }
    });
  }
  insert(dbName, collectionName, jsonArr) {
    if (!dbName || !collectionName || !jsonArr || !(jsonArr instanceof Array)) throw '参数错误';
    return new Promise((resolve, reject) => {
      this.connect().then((client) => {
        const db = (client as MongoClient).db(dbName);
        const collect = db.collection(collectionName);
        collect
          .insertMany(jsonArr)
          .then((result) => {
            resolve(result);
          })
          .catch((err) => {
            reject(err);
          });
      });
    });
  }
  find(dbName, collectionName, json) {
    if (!dbName || !collectionName || !json) throw '参数错误';
    return new Promise((resolve, reject) => {
      this.connect().then((client) => {
        const db = (client as MongoClient).db(dbName);
        let result = db.collection(collectionName).find(json);
        result
          .toArray()
          .then((data) => {
            resolve(data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    });
  }
  remove(dbName, collectionName, json) {
    if (!dbName || !collectionName || !json) throw '参数错误';
    return new Promise((resolve, reject) => {
      this.connect().then((client) => {
        const db = (client as MongoClient).db(dbName);
        const collection = db.collection(collectionName);
        collection
          .deleteOne(json)
          .then((result) => {
            resolve(result);
          })
          .catch((err) => {
            reject(err);
          });
      });
    });
  }
  update(dbName, collectionName, filter, json) {
    if (!dbName || !collectionName || !filter || !json) throw '参数错误';
    return new Promise((resolve, reject) => {
      this.connect().then((client) => {
        const db = (client as MongoClient).db(dbName);
        const collection = db.collection(collectionName);
        collection
          .updateOne(filter, { $set: json })
          .then((result) => {
            resolve(result);
          })
          .catch((err) => {
            reject(err);
          });
      });
    });
  }
  getObjectId(id) {
    /*mongodb里面查询 _id 把字符串转换成对象*/
    return new ObjectId(id);
  }
}
