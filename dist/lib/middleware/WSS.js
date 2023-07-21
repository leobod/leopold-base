"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const ws = new ws_1.default.Server({ port: 8361 });
ws.on('connection', (ws) => {
    console.log('server connection');
    ws.on('message', (msg) => {
        console.log('server receive msg：', msg.toString());
    });
    ws.send('Information from the server');
});
