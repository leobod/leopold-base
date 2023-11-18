const { createClient } = require('redis');

export class RedisRDB {
  private config: {};

  constructor(config = {}) {
    const configTemplate = {
      host: '',
      port: '6379',
      maxConnections: 5
    };
    this.config = Object.assign({}, configTemplate, config);
  }

  async execute(command) {
    let result = null;
    let client: any = null;
    try {
      client = await createClient(this.config)
        .on('error', (err) => console.log('Redis Client Error', err))
        .connect();
      if (typeof command === 'string') {
        const commandList = command.split(' ');
        result = await client.sendCommand(commandList);
      }
      if (command instanceof Array) {
        result = await client.sendCommand(command);
      }
    } catch (e) {
      console.log(e);
    } finally {
      if (client) await client.quit();
    }
    return result;
  }
}
