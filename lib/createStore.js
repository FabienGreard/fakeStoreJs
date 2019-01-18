const appendCrud = require('./appendCrud');
const withPersistent = require('./persistentData');

/*
 *
 * createStore function
 * create a store from a specific object
 * { key: { [data], (schema), {resolvers}, {options} } }
 *
 */

module.exports = mock => {
  if ((!mock && typeof mock !== 'object') || Object.keys(mock).length === 0)
    throw new Error("No object found in 'createStore' parameter.");

  const distributedData = (data = [], schema, options) =>
    data.map((item, i) => useSchema(schema, item, i, options)); // return a mock data with an iud

  const generateSchema = (data, name) => {
    // Generate a schema based on an array of data
    if (data.length === 0)
      throw new Error(
        'Require at least one object inside the data key, with useSchema option at false.'
      );

    const objWithSchema = {
      [name]: function(params) {
        Object.entries(params).forEach(param => {
          this[param[0]] = param[1];
        });
      }
    };
    return objWithSchema[name];
  };

  const useSchema = (schema, obj, uid, options, collection = []) => {
    // Generate an uid append to a schema
    const { idLabel = 'uid' } = options;

    const genUid = uid => {
      uid = String(uid);
      let genUiRow = `${'0'.repeat(6 - uid.length)}${uid}`;
      if (uid.length === 6) {
        return uid;
      } else {
        if (collection.length > 0) {
          const genUidArray = collection
            .map(obj => obj[idLabel])
            .sort((a, b) => a - b);

          /*
           *  this is for avoiding jump in uid and always have a linear count of uid
           *  ie 000001 and 000003 where 000002 is missing, 000003 will became 000002
           */
          for (const index in genUidArray) {
            const linearUid = `${'0'.repeat(6 - String(index).length)}${index}`;
            if (genUidArray[index] !== linearUid) {
              genUiRow = linearUid;
              break;
            }
          }
        }
        return genUid(genUiRow);
      }
    };

    return {
      ...new schema({ ...obj }),
      [idLabel]: genUid(uid)
    };
  };

  return Object.entries(mock).reduce((acc, cur) => {
    const key = cur[0]; // name
    const obj = cur[1]; // content
    const options = obj.options || { useSchema: false }; // options
    const resolvers = obj.resolvers; // resolvers

    if (options.useSchema && !obj.schema) {
      throw new Error(
        'A schema must be spcecified with useSchema option at true.'
      );
    }
    const schemaName = key
      .toLowerCase()
      .replace(/^./, str => str.toUpperCase()); // schema name
    const schema = options.useSchema
      ? obj.schema
      : generateSchema(obj.data, schemaName); // schemaless or not
    const collection = distributedData(obj.data, schema, options); // Data with uid

    return withPersistent(
      {
        ...acc,
        [key]: {
          collection,
          [schemaName]: function(obj) {
            return useSchema(
              schema,
              obj,
              this.collection.length,
              options,
              this.collection
            );
          }, // Get context (db) to return an object with a generated uid
          ...appendCrud(schemaName, options), // Auto generate crud
          ...resolvers // resolvers
        }
      },
      options.isPersistent
    );
  }, {});
};
