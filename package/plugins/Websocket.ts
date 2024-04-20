import { WebSocketServer } from 'ws';
import { W } from 'mongodb';
import { uuidV4 } from '../utils/uuid';

class WebsocketManager {
  public server = null;
  public action: any = {};
  public clients: any = {};

  constructor(webSocketServer) {
    this.server = webSocketServer;
    this.onEvent();
  }

  setAction(key, fn: Function) {
    if (fn) {
      this.action[key] = fn;
    }
  }

  getAction(key) {
    return this.action[key];
  }

  onEvent() {
    if (this.server) {
      const wss: WebSocketServer = this.server;
      wss.on('connection', (client: WebSocketServer) => {
        const userID = uuidV4();
        this.clients[userID] = client;
        client.send(userID);
        client.on('message', (message: any) => {
          client.send(message);
        });
        client.on('close', () => {
          delete this.clients[userID];
        });
      });
    }
  }
}

class Websocket {
  public static instance: WebSocketServer | null = null;

  static onCreate = function (server) {
    const wss: WebSocketServer = new WebSocketServer({ server: server });
    const websocketManager = new WebsocketManager(wss);
    Websocket.instance = websocketManager;
    return websocketManager;
  };
}

const useWebsocket = function () {
  return Websocket.instance;
};

export { Websocket, useWebsocket };
