"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const redis_1 = require("redis");
// @ts-ignore
const client = (0, redis_1.createClient)({ host: '127.0.0.1', port: 6379 });
exports.client = client;
client.on('error', (err) => console.log('Redis Client Error', err));
