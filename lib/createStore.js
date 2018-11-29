const appendCrud = require('./appendCrud');

/*
 *
 * createStore function
 * create a store from a specific object
 * { key: { [data], (schema), {resolvers}, {options} } }
 *
 */

module.exports = mock => {
  if (!mock || typeof mock !== 'object')
    throw new Error("No object found in 'createStore' parameter.");

  const distributedData = (data = [], schema) => {
    // Render data to be used with an uid
    return data.map((item, i) => {
      const obj = new schema(item);
      obj.genUid(i);
      const { genUid, ..._obj } = obj;
      return _obj;
    });
  };

  const generateSchema = (data, name) => {
    // Generate a schema based on an array of data
    if (data.length === 0)
      throw new Error(
        'Require at least one object inside the data key, with useSchema option at false.'
      );

    const keyName = name.toLowerCase().replace(/^./, str => str.toUpperCase());

    const objWithSchema = {
      [keyName]: function(params) {
        Object.entries(params).forEach(param => {
          this[param[0]] = param[1];
        });
      }
    };

    return objWithSchema[keyName];
  };

  const genUid = (schema, options) => {
    const { idLabel = 'uid' } = options;
    // Generate an uid
    schema.prototype.genUid = function(uid) {
      if (String(uid).length === 6) {
        this[idLabel] = uid
          .split('')
          .reverse('')
          .join('');
      } else {
        this.genUid(`${uid}${'0'.repeat(6 - uid.length)}`);
      }
    };
    return schema;
  };

  return Object.entries(mock).reduce((acc, cur) => {
    const key = cur[0]; // name
    const obj = cur[1]; // content
    const options = obj.options || { useSchema: false }; // options

    if (options.useSchema && !obj.schema) {
      throw new Error(
        'A schema must be spcecified with useSchema option at true.'
      );
    }

    const schema = genUid(
      options.useSchema ? obj.schema : generateSchema(obj.data, key),
      options
    ); // Add a function prototype to generate an uid
    const db = distributedData(obj.data, schema); // Data with uid
    const resolvers = {
      db,
      [key.toLowerCase().replace(/^./, str => str.toUpperCase())]: schema,
      ...obj.resolvers
    }; // Set context in resolvers
    return {
      ...acc,
      [key]: {
        ...appendCrud({}, db, schema), // Auto generate crud resolvers
        ...resolvers // Custom resolvers
      }
    };
  }, {});
};
