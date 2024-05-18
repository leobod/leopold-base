import { WebSocketServer } from 'ws';

class WebsocketFactory {
  public static instance: WebSocketServer | null = null;

  static onCreate = function (server) {
    const wss: WebSocketServer = new WebSocketServer({ server: server });
    WebsocketFactory.instance = wss;
    return wss;
  };
}

export { WebsocketFactory };
