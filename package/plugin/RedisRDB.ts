import { createClient } from 'redis';

class RedisRDB {
  private config: {};

  constructor(config = {}) {
    const configTemplate = {
      host: '',
      port: '6379'
    };
    this.config = Object.assign({}, configTemplate, config);
  }

  async query(command, values = [], isRelease = true) {
    let result = null;
    let client: any = null;
    try {
      client = await createClient(this.config)
        .on('error', (err) => {
          throw err;
        })
        .connect();
      if (typeof command === 'string') {
        const commandList = command.split(' ');
        result = await client.sendCommand(commandList);
      }
      if (command instanceof Array) {
        result = await client.sendCommand(command);
      }
    } catch (e) {
      throw e;
    }
    if (isRelease && client) {
      client.quit();
    }
    return result;
  }
}

export { RedisRDB };
