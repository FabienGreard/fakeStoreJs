const createCrud = (obj, source, cst) => {
  obj.get = () => {
    return { sucess: true, data: source };
  };

  obj.post = _obj => {
    try {
      _obj = new cst(_obj);
    } catch (e) {
      return { sucess: false, error: e };
    }
    _obj.genUid(source.length);
    const { genUid, ...__obj } = _obj;
    source = [...source, __obj];
    return { sucess: true, data: __obj };
  };

  obj.delete = uid => {
    if (!source.find(obj => obj.uid === uid)) {
      return { sucess: false, error: "couldnt match the uid" };
    }
    source = source.filter(obj => obj.uid !== uid);
    return { sucess: true };
  };

  obj.put = (uid, _obj) => {
    if (!source.find(obj => obj.uid === uid)) {
      return { sucess: false, error: "couldnt match the uid" };
    }
    source = source.map(obj => {
      if (obj.uid === uid) {
        obj = { ...obj, ..._obj };
      }
      return obj;
    });
    return { sucess: true, data: source.find(obj => obj.uid === uid) };
  };

  return obj;
};

const createStore = (mock = {}) => {
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
          .split("")
          .reverse("")
          .join("");
      } else {
        this.genUid(`${uid}${"0".repeat(6 - uid.length)}`);
      }
    };
    return {
      ...acc,
      [key]: createCrud({}, distributedData(data, cst), cst)
    };
  }, {});
};

module.exports = createStore;
