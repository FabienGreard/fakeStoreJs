const { persistentData } = require('../lib'),
  fs = require('fs'),
  path = require('path');

describe('persistendData', () => {
  const dbPath = path.join(__dirname, '../db/collection.json');
  beforeAll(() => {
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
    if (fs.existsSync(path.join(__dirname, '../db'))) {
      fs.rmdirSync(path.join(__dirname, '../db'));
    }
  });
  afterAll(() => {
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
    if (fs.existsSync(path.join(__dirname, '../db'))) {
      fs.rmdirSync(path.join(__dirname, '../db'));
    }
  });
  it('should persist data', () => {
    const store = persistentData(
      {
        book: {
          collection: [
            { title: 'Speaking JavaScript', author: 'Dr. Axel Raushmayer' },
            { title: 'Effective JavaScript', author: 'David Herman' },
            { title: 'Eloquent Javascript', author: 'Marijin Haverbeke' },
            { title: 'You-Dont-Know-JS', author: 'Kyle Simpson' }
          ]
        }
      },
      true
    );

    expect(fs.existsSync(dbPath)).toBeTruthy();

    //code coverage
    fs.unlinkSync(dbPath);
    fs.rmdirSync(path.join(__dirname, '../db'));
  });
  it('should persist data with mutation', () => {
    // code coverage
    fs.mkdirSync(path.join(__dirname, '../db'));

    const store = persistentData(
      {
        book: {
          collection: [
            { title: 'Speaking JavaScript', author: 'Dr. Axel Raushmayer' },
            { title: 'Effective JavaScript', author: 'David Herman' },
            { title: 'Eloquent Javascript', author: 'Marijin Haverbeke' },
            { title: 'You-Dont-Know-JS', author: 'Kyle Simpson' }
          ]
        }
      },
      true
    );

    // usefull for code coverage, reflect.set on handlerCollection
    store.book.options = 'super';

    store.book.collection = [
      { title: 'Speaking JavaScript', author: 'Dr. Axel Raushmayer' }
    ];

    expect(JSON.parse(fs.readFileSync(dbPath)).book).toEqual([
      {
        title: 'Speaking JavaScript',
        author: 'Dr. Axel Raushmayer'
      }
    ]);
  });
  it('should persist data withing multiple store', () => {
    const store = persistentData(
      {
        book: {
          collection: [
            { title: 'Speaking JavaScript', author: 'Dr. Axel Raushmayer' },
            { title: 'Effective JavaScript', author: 'David Herman' }
          ]
        }
      },
      true
    );

    const store_3 = persistentData(
      {
        book2: {
          collection: [
            { title: 'Eloquent Javascript', author: 'Marijin Haverbeke' },
            { title: 'You-Dont-Know-JS', author: 'Kyle Simpson' }
          ]
        }
      },
      true
    );

    expect(JSON.parse(fs.readFileSync(dbPath)).book).toEqual([
      {
        title: 'Speaking JavaScript',
        author: 'Dr. Axel Raushmayer'
      }
    ]);
  });
});
