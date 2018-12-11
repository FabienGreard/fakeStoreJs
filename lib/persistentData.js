const fs = require('fs'),
  path = require('path');

/*
 *
 * persistentData function
 * create a collection json, to persist data from server restart
 *
 */

const dbPath = path.join(__dirname, '../db/collection.json');

const readJSON = () => {
  return fs.readFileSync(dbPath);
};

const writeJSON = collection => {
  // create db folder if doesn't exist
  if (!fs.existsSync(path.join(__dirname, '../db'))) {
    fs.mkdirSync(path.join(__dirname, '../db'));
  }
  fs.writeFileSync(dbPath, JSON.stringify(collection)); // create a collection json

  return readJSON();
};

const appendJSON = collection => {
  fs.writeFileSync(
    dbPath,
    JSON.stringify({ ...JSON.parse(readJSON()), ...collection })
  );
};

const handlerCollection = db => {
  return {
    set: (target, property, value) => {
      if (property === 'collection') {
        appendJSON({ [db]: value });
        target[property] = value;
      } else return Reflect.set(...arguments);
    }
  };
};

const isJSON = () => fs.existsSync(dbPath);

module.exports = (store, usePersistent) => {
  return !usePersistent
    ? store
    : Object.entries(store).reduce((acc, cur) => {
        const db = cur[0];
        const collection = cur[1].collection;
        // get initial json or create one
        const collectionJSON = isJSON()
          ? readJSON()
          : writeJSON({ [db]: collection });

        if (!JSON.parse(collectionJSON)[db]) {
          // append data of the specific collection to the json file
          appendJSON({ [db]: collection });
        }

        // assign initial data from json to the store
        cur[1].collection = JSON.parse(readJSON())[db];

        return {
          ...acc,
          [db]: new Proxy(cur[1], handlerCollection(db))
        };
      }, {});
};
