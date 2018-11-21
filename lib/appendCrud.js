/*
 *
 * appendCrud function
 * append CRUD like methods to any object
 *
 */

module.exports = (obj, source, cst) => {
  obj.get = () => {
    return { sucess: true, data: source };
  };

  obj.post = _obj => {
    try {
      _obj = new cst(_obj);
      _obj.genUid(source.length);
    } catch (e) {
      return { sucess: false, error: e };
    }
    const { genUid, ...__obj } = _obj;
    source = [...source, __obj];
    return { sucess: true, data: __obj };
  };

  obj.delete = uid => {
    if (!source.find(obj => obj.uid === uid)) {
      return { sucess: false, error: 'couldnt match the uid' };
    }
    source = source.filter(obj => obj.uid !== uid);
    return { sucess: true };
  };

  obj.put = (uid, _obj) => {
    if (!source.find(obj => obj.uid === uid)) {
      return { sucess: false, error: 'couldnt match the uid' };
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
