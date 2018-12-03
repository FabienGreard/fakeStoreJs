const { createStore } = require('../lib');

describe('createStore', () => {
  it('Should create a store with schema', () => {
    const store = createStore({
      book: {
        data: [
          { title: 'Speaking JavaScript', author: 'Dr. Axel Raushmayer' },
          { title: 'Effective JavaScript', author: 'David Herman' },
          { title: 'Eloquent Javascript', author: 'Marijin Haverbeke' },
          { title: 'You-Dont-Know-JS', author: 'Kyle Simpson' }
        ],
        schema: function Book({ author, title }) {
          this.author = author;
          this.title = title;
        },
        options: {
          useSchema: true
        }
      }
    });
    // Store with mock
    expect(store).toHaveProperty('book');
  });
  it('Should create a store without schema', () => {
    const store = createStore({
      book: {
        data: [
          { title: 'Speaking JavaScript', author: 'Dr. Axel Raushmayer' },
          { title: 'Effective JavaScript', author: 'David Herman' },
          { title: 'Eloquent Javascript', author: 'Marijin Haverbeke' },
          { title: 'You-Dont-Know-JS', author: 'Kyle Simpson' }
        ]
      }
    });
    // Store with mock
    expect(store).toHaveProperty('book');
  });
  it('Should create a store without data', () => {
    const store = createStore({
      book: {
        schema: function Book({ author, title }) {
          this.author = author;
          this.title = title;
        },
        options: {
          useSchema: true
        }
      }
    });
    // Store with mock
    expect(store).toHaveProperty('book');
  });
  it('Should throw an error', () => {
    expect(createStore).toThrowError(
      "No object found in 'createStore' parameter."
    );

    expect(() =>
      createStore({
        book: {
          data: []
        }
      })
    ).toThrowError(
      'Require at least one object inside the data key, with useSchema option at false.'
    );

    expect(() =>
      createStore({
        book: {
          data: [],
          options: {
            useSchema: true
          }
        }
      })
    ).toThrowError(
      'A schema must be spcecified with useSchema option at true.'
    );
  });
  it('Should create a store with multiple storeDB', () => {
    const store = createStore({
      user: {
        data: [],
        schema: function user({ name }) {
          this.name = name;
        },
        options: {
          useSchema: true
        }
      },
      message: {
        data: [],
        schema: function message({ title, content }) {
          this.title = title;
          this.content = content;
        },
        options: {
          useSchema: true
        }
      }
    });
    // Stores
    expect(store).toHaveProperty('user');
    expect(store).toHaveProperty('message');
  });
  it('Should extends resolvers', () => {
    const store = createStore({
      book: {
        data: [
          { title: 'Speaking JavaScript', author: 'Dr. Axel Raushmayer' },
          { title: 'Effective JavaScript', author: 'David Herman' },
          { title: 'Eloquent Javascript', author: 'Marijin Haverbeke' },
          { title: 'You-Dont-Know-JS', author: 'Kyle Simpson' }
        ],
        constructor: function Book({ author, title }) {
          this.author = author;
          this.title = title;
        },
        resolvers: {
          getById: function(uid) {
            return this.db.find(item => item.uid === uid);
          }
        }
      }
    });

    expect(store.book).toHaveProperty('getById');
  });
  it('Should add options', () => {
    const store = createStore({
      book: {
        data: [
          { title: 'Speaking JavaScript', author: 'Dr. Axel Raushmayer' },
          { title: 'Effective JavaScript', author: 'David Herman' },
          { title: 'Eloquent Javascript', author: 'Marijin Haverbeke' },
          { title: 'You-Dont-Know-JS', author: 'Kyle Simpson' }
        ],
        constructor: function Book({ author, title }) {
          this.author = author;
          this.title = title;
        },
        options: {
          idLabel: 'id'
        }
      }
    });

    expect(store.book.get().data[0]).toHaveProperty('id');
  });
});
