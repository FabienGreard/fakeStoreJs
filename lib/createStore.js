const appendCrud = require('./appendCrud');

/*
 *
 * createStore function
 * create a store from a specific object with a constructor
 * { key: { [mock<optional>], (constructor) } }
 *
 */

module.exports = (mock = {}) => {
  const distributedData = (data, cst) => {
    return data.map((item, i) => {
      const obj = new cst(item);
      obj.genUid(i);
      const { genUid, ..._obj } = obj;
      return _obj;
    });
  };

  return Object.entries(mock).reduce((acc, cur) => {
    const key = cur[0];
    const obj = cur[1];
    const cst = obj.constructor;
    const data = obj.data;
    cst.prototype.genUid = function(uid) {
      if (String(uid).length === 6) {
        this.uid = uid
          .split('')
          .reverse('')
          .join('');
      } else {
        this.genUid(`${uid}${'0'.repeat(6 - uid.length)}`);
      }
    };
    return {
      ...acc,
      [key]: appendCrud({}, distributedData(data, cst), cst)
    };
  }, {});
};
