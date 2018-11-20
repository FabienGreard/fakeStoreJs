const { appendCrud } = require('../lib');

describe('appendCrud', () => {
  it('Should append crud method to an object', () => {
    const crud = appendCrud({}, [], jest.fn());
    // Post
    expect(crud).toHaveProperty('post');
    // get
    expect(crud).toHaveProperty('get');
    // Put
    expect(crud).toHaveProperty('put');
    // Delete
    expect(crud).toHaveProperty('delete');
  });
});
