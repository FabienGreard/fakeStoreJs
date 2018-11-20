const { createStore } = require('../lib');

describe('createStore', () => {
  it('Should create a store', () => {
    const store = createStore({
      book: {
        data: [
          { author: 'Speaking JavaScript', title: 'Dr. Axel Raushmayer' },
          { author: 'Effective JavaScript', title: 'David Herman' },
          { author: 'Eloquent Javascript', title: 'Marijin Haverbeke' },
          { author: 'You-Dont-Know-JS', title: 'Kyle Simpson' }
        ],
        constructor: function Book({ author, title }) {
          this.author = author;
          this.title = title;
        }
      }
    });
    // Store with mock
    expect(store).toHaveProperty('book');
  });
  it('Should create a store without a mock', () => {
    const store = createStore({
      book: {
        data: [],
        constructor: function Book({ author, title }) {
          this.author = author;
          this.title = title;
        }
      }
    });
    // Store without mock
    expect(store).toHaveProperty('book');
  });
  it('Should create a store with multiple storeDB', () => {
    const store = createStore({
      user: {
        data: [],
        constructor: function user({ name }) {
          this.name = name;
        }
      },
      message: {
        data: [],
        constructor: function message({ title, content }) {
          this.title = title;
          this.content = content;
        }
      }
    });
    // Stores
    expect(store).toHaveProperty('user');
    expect(store).toHaveProperty('message');
  });
});
