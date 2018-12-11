const { createStore } = require('./lib');

const store = createStore({
  book: {
    data: [{ title: 'amazing javascript' }],
    options: {
      isPersistent: true
    }
  }
});

//store.book.post({ title: 'amazing javascript 2' });

//console.log(store.book);

module.exports = createStore;
