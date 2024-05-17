type SQLTypeOptions = {
  name: string;
  cast: string;
  length?: any;
  decimals?: any;
};

class SQLType {
  _name: any;
  _cast: any;
  _length: any;
  _decimals: any;
  _options: any;

  constructor(options: SQLTypeOptions) {
    this._name = options.name || null;
    this._cast = options.cast || null;
    this._length = options.length || null;
    this._decimals = options.decimals || null;
    this._options = options;
  }

  toDialect() {
    if (this._decimals) {
      return `${this._name}(${this._length},${this._decimals})`;
    } else if (this._length) {
      return `${this._name}(${this._length})`;
    } else {
      return `${this._name}`;
    }
  }
}

const SQLModelType = {
  VARCHAR: function (length = 255) {
    const options = {
      name: 'VARCHAR',
      cast: 'string',
      length: length
    };
    return new SQLType(options);
  },
  TEXT: function () {
    const options = {
      name: 'TEXT',
      cast: 'string'
    };
    return new SQLType(options);
  },
  MEDIUMTEXT: function () {
    const options = {
      name: 'MEDIUMTEXT',
      cast: 'string'
    };
    return new SQLType(options);
  },
  LONGTEXT: function () {
    const options = {
      name: 'LONGTEXT',
      cast: 'string'
    };
    return new SQLType(options);
  },
  BOOLEAN: function (length = 1) {
    const options = {
      name: 'TINYINT',
      cast: 'boolean',
      length: length
    };
    return new SQLType(options);
  },
  INTEGER: function () {
    const options = {
      name: 'INTEGER',
      cast: 'number'
    };
    return new SQLType(options);
  },
  BIGINT: function () {
    const options = {
      name: 'BIGINT',
      cast: 'number'
    };
    return new SQLType(options);
  },
  FLOAT: function (length = 10, decimals = 2) {
    const options = {
      name: 'FLOAT',
      cast: 'number',
      length: length,
      decimals: decimals
    };
    return new SQLType(options);
  },
  DOUBLE: function (length = 10, decimals = 2) {
    const options = {
      name: 'DOUBLE',
      cast: 'number',
      length: length,
      decimals: decimals
    };
    return new SQLType(options);
  },
  DATETIME: function () {
    const options = {
      name: 'DATETIME',
      cast: 'Date'
    };
    return new SQLType(options);
  }
};

export { SQLModelType };
