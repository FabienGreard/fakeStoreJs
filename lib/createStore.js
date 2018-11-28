const appendCrud = require('./appendCrud');

/*
 *
 * createStore function
 * create a store from a specific object with a constructor
 * { key: { [mock<optional>], (constructor), {resolvers<optional>} } }
 *
 */

module.exports = mock => {
  if (!mock || typeof mock != 'object')
    throw new Error("No object found in 'createStore' parameter.");

  const distributedData = (data, cst) => {
    // Render data to be used with an uid
    return data.map((item, i) => {
      const obj = new cst(item);
      obj.genUid(i);
      const { genUid, ..._obj } = obj;
      return _obj;
    });
  };

  const genUid = (cst, options = {}) => {
    const { idLabel = 'uid' } = options;
    // Generate an uid
    cst.prototype.genUid = function(uid) {
      if (String(uid).length === 6) {
        this[idLabel] = uid
          .split('')
          .reverse('')
          .join('');
      } else {
        this.genUid(`${uid}${'0'.repeat(6 - uid.length)}`);
      }
    };
    return cst;
  };

  return Object.entries(mock).reduce((acc, cur) => {
    const key = cur[0]; // name
    const obj = cur[1]; // content
    const options = obj.options; // options
    const cst = genUid(obj.constructor, options); // Add a function prototype to generate an uid
    const source = distributedData(obj.data, cst); // Data with uid
    const resolvers = { db: source, [cst.name]: cst, ...obj.resolvers }; // Set context in resolvers
    return {
      ...acc,
      [key]: {
        ...appendCrud({}, source, cst), // Auto generate crud resolvers
        ...resolvers // Custom resolvers
      }
    };
  }, {});
};
