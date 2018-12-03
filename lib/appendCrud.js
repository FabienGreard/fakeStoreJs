/*
 *
 * appendCrud function
 * append CRUD like methods to any object
 *
 */

module.exports = schema => ({
  get() {
    return { sucess: true, data: this.collection };
  },
  post(obj) {
    try {
      obj = this[schema](obj);
    } catch (e) {
      return { sucess: false, error: e };
    }
    this.collection = [...this.collection, obj];
    return { sucess: true, data: obj };
  },
  put(uid, _obj) {
    uid = String(uid);
    if (!this.collection.find(obj => obj.uid === uid)) {
      return { sucess: false, error: 'couldnt match the uid' };
    }
    this.collection = this.collection.map(obj => {
      if (obj.uid === uid) {
        obj = { ...obj, ..._obj };
      }
      return obj;
    });
    return { sucess: true, data: this.collection.find(obj => obj.uid === uid) };
  },
  delete(uid) {
    uid = String(uid);
    if (!this.collection.find(obj => obj.uid === uid)) {
      return { sucess: false, error: 'couldnt match the uid' };
    }
    this.collection = this.collection.filter(obj => obj.uid !== uid);
    return { sucess: true };
  }
});
