/*
 *
 * appendCrud function
 * append CRUD like methods to any object
 *
 */

module.exports = (obj, db, schema) => {
  obj.get = () => {
    return { sucess: true, data: db };
  };

  obj.post = obj => {
    try {
      obj = new schema(obj);
      obj.genUid(db.length);
    } catch (e) {
      return { sucess: false, error: e };
    }
    const { genUid, ..._obj } = obj;
    db = [...db, _obj];
    return { sucess: true, data: _obj };
  };

  obj.delete = uid => {
    if (!db.find(obj => obj.uid === uid)) {
      return { sucess: false, error: 'couldnt match the uid' };
    }
    db = db.filter(obj => obj.uid !== uid);
    return { sucess: true };
  };

  obj.put = (uid, _obj) => {
    if (!db.find(obj => obj.uid === uid)) {
      return { sucess: false, error: 'couldnt match the uid' };
    }
    db = db.map(obj => {
      if (obj.uid === uid) {
        obj = { ...obj, ..._obj };
      }
      return obj;
    });
    return { sucess: true, data: db.find(obj => obj.uid === uid) };
  };

  return obj;
};
