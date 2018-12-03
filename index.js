const { createStore } = require('./lib');

const store = createStore({
  book: {
    data: [
      { author: 'Speaking JavaScript', title: 'Dr. Axel Raushmayer' },
      { author: 'Effective JavaScript', title: 'David Herman' },
      { author: 'Eloquent Javascript', title: 'Marijin Haverbeke' },
      { author: 'You-Dont-Know-JS', title: 'Kyle Simpson' }
    ],
    resolvers: {
      testAdd(obj) {
        try {
          obj = this.Book(obj);
        } catch (e) {
          return { sucess: false, error: e };
        }
        this.collection = [...this.collection, obj];
        return { sucess: true, data: obj };
      },
      multiplepost: function(arrayOfObj) {
        let returnObj = {
          sucess: true
        };
        arrayOfObj = arrayOfObj.map(obj => {
          try {
            obj = this.Book(obj);
          } catch (e) {
            returnObj = { sucess: false, error: e };
          }
          return obj;
        });
        if (!returnObj.status) return error;
        this.collection = [...this.collection, ...arrayOfObj];
        return { sucess: true, data: arrayOfObj };
      }
    }
  }
});

store.book.post({
  author: '---S',
  title: '----n'
});

store.book.testAdd({
  author: '---JS',
  title: '----on'
});

console.log(store.book.Book());

module.exports = createStore;
