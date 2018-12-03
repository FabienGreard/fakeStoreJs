const { createStore } = require('../lib');

describe('createStore', () => {
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
  it('Storeify (post)!', () => {
    // Post
    expect(
      store.book.post({ title: 'new_entry', author: 'new_entry' }).data
    ).toEqual({ uid: '000004', title: 'new_entry', author: 'new_entry' });
  });
  it('Storeify (get)!', () => {
    // get
    expect(store.book.get().data).toEqual([
      {
        uid: '000000',
        title: 'Speaking JavaScript',
        author: 'Dr. Axel Raushmayer'
      },
      { uid: '000001', title: 'Effective JavaScript', author: 'David Herman' },
      {
        uid: '000002',
        title: 'Eloquent Javascript',
        author: 'Marijin Haverbeke'
      },
      { uid: '000003', title: 'You-Dont-Know-JS', author: 'Kyle Simpson' },
      { uid: '000004', title: 'new_entry', author: 'new_entry' }
    ]);
  });
  it('Storeify (put)!', () => {
    expect(
      store.book.put('000003', { title: 'new_entry', author: 'new_entry' }).data
    ).toEqual({ uid: '000003', title: 'new_entry', author: 'new_entry' });
  });
  it('Storeify (delete)!', () => {
    expect(store.book.delete('000003').sucess).toEqual(true);
  });
});
