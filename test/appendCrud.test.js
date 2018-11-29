const { appendCrud } = require('../lib');

describe('appendCrud', () => {
  const schema = function({ name, race }) {
    this.name = name;
    this.race = race;
    this.genUid = function(uid) {
      this.uid = uid;
    };
  };
  it('Should append crud method to an object', () => {
    const crud = appendCrud({}, [], schema);
    // Post
    expect(crud).toHaveProperty('post');
    // get
    expect(crud).toHaveProperty('get');
    // Put
    expect(crud).toHaveProperty('put');
    // Delete
    expect(crud).toHaveProperty('delete');
  });
  it('Should create a dog object', () => {
    const crud = appendCrud({}, [], schema);
    // post
    expect(
      crud.post({
        name: 'fluffy',
        race: 'Dobermann'
      }).data
    ).toEqual({
      name: 'fluffy',
      race: 'Dobermann',
      uid: 0
    });
  });
  it('Should create a dog object with error', () => {
    const crud = appendCrud({}, [], jest.fn());
    // post
    expect(
      crud.post({
        name: 'fluffy',
        race: 'Dobermann'
      }).sucess
    ).toBe(false);
  });
  it('Should get a dog object', () => {
    const crud = appendCrud(
      {},
      [
        {
          name: 'fluffy',
          race: 'Dobermann'
        }
      ],
      schema
    );
    // get
    expect(crud.get().data[0]).toEqual({
      name: 'fluffy',
      race: 'Dobermann'
    });
  });
  it('Should update a dog object', () => {
    const crud = appendCrud(
      {},
      [
        {
          name: 'Grumpy',
          race: 'Cat',
          uid: '0'
        },
        {
          name: 'fluffy',
          race: 'Dobermann',
          uid: '1'
        }
      ],
      schema
    );
    // put
    expect(crud.put('1', { race: 'Boxer' }).data).toEqual({
      name: 'fluffy',
      race: 'Boxer',
      uid: '1'
    });
  });
  it('Should update a dog object with error', () => {
    const crud = appendCrud(
      {},
      [
        {
          name: 'fluffy',
          race: 'Dobermann',
          uid: '0'
        }
      ],
      schema
    );
    // put with error
    expect(crud.put('1', { race: 'Boxer' }).sucess).toBe(false);
  });
  it('Should delete a dog object', () => {
    const crud = appendCrud(
      {},
      [
        {
          name: 'fluffy',
          race: 'Dobermann',
          uid: '0'
        }
      ],
      schema
    );
    // delete
    expect(crud.delete('0').sucess).toBe(true);
  });
  it('Should delete a dog object with error', () => {
    const crud = appendCrud(
      {},
      [
        {
          name: 'fluffy',
          race: 'Dobermann',
          uid: '0'
        }
      ],
      schema
    );
    // delete with error
    expect(crud.delete('1').sucess).toBe(false);
  });
});
