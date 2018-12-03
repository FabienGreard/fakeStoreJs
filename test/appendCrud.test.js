const { appendCrud } = require('../lib');

describe('appendCrud', () => {
  const collectionWithCrud = {
    schema: function(obj) {
      if (typeof obj !== 'object') throw new Error('is not an object');
      return { ...obj, uid: String(this.collection.length) };
    },
    collection: [
      { uid: '0', title: 'Speaking JavaScript', author: 'Dr. Axel Raushmayer' },
      { uid: '1', title: 'Effective JavaScript', author: 'David Herman' },
      { uid: '2', title: 'Eloquent Javascript', author: 'Marijin Haverbeke' },
      { uid: '3', title: 'You-Dont-Know-JS', author: 'Kyle Simpson' }
    ],
    ...appendCrud('schema')
  };
  it('Should append crud method to an object', () => {
    const crud = appendCrud({});
    expect(crud).toHaveProperty('post');
    expect(crud).toHaveProperty('get');
    expect(crud).toHaveProperty('put');
    expect(crud).toHaveProperty('delete');
  });
  it('Should post an object', () => {
    expect(
      collectionWithCrud.post({
        title: 'You-Dont-Know-JS',
        author: 'Kyle Simpson'
      }).data
    ).toEqual({ uid: '4', title: 'You-Dont-Know-JS', author: 'Kyle Simpson' });
  });
  it('Should post an object (throw error)', () => {
    expect(collectionWithCrud.post('super').error.message).toEqual(
      'is not an object'
    );
  });
  it('Should get a list of object', () => {
    expect(collectionWithCrud.get().data).toEqual(
      collectionWithCrud.collection
    );
  });
  it('Should update an object', () => {
    expect(
      collectionWithCrud.put('1', { title: 'updated' }).data.title
    ).toEqual('updated');
  });
  it('Should update an object (couldnt match the uid)', () => {
    expect(collectionWithCrud.put('10', { title: 'updated' }).error).toEqual(
      'couldnt match the uid'
    );
  });
  it('Should delete an object (couldnt match the uid)', () => {
    expect(collectionWithCrud.delete('1').sucess).toEqual(true);
  });
  it('Should update an object (couldnt match the uid)', () => {
    expect(collectionWithCrud.delete('10').error).toEqual(
      'couldnt match the uid'
    );
  });
});
