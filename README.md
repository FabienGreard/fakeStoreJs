# fakeStoreJs :construction: [![Build Status](https://travis-ci.org/FabienGreard/fakeStoreJs.svg?branch=master)](https://travis-ci.org/FabienGreard/fakeStoreJs)[dependencies Status](https://david-dm.org/FabienGreard/fakeStoreJs/status.svg)](https://david-dm.org/FabienGreard/fakeStoreJs)[![devDependencies Status](https://david-dm.org/FabienGreard/fakeStoreJs/dev-status.svg)](https://david-dm.org/FabienGreard/fakeStoreJs?type=dev)

FakeStoreJs is a javascript library, quickly create a CRUD acess to any object

## Fast Use :rocket:

```bash
yarn install fakeStoreJs
```

Or

```bash
npm install fakeStoreJs
```

Start using your store, by importing `createStore` from fakeStoreJs.

```javascript
const createStore = require("fakeStoreJs");
```

Create a store from any object.

```javascript
const store = createStore({
  book: {
    data: [
      { author: "Speaking JavaScript", title: "Dr. Axel Raushmayer" },
      { author: "Effective JavaScript", title: "David Herman" },
      { author: "Eloquent Javascript", title: "Marijin Haverbeke" },
      { author: "You-Dont-Know-JS", title: "Kyle Simpson" }
    ],
    constructor: function Book({ author, title }) {
      this.author = author;
      this.title = title;
    }
  }
});
```

:tada: Start using it :tada:

```javascript
store.book.get(); // { sucess: true, data: [ { uid: "000000" author: "Speaking JavaScript", title: "Dr. Axel Raushmayer" }, ...] }
```

### Methods allowed

| Method   | Parameters          | sucess                            | error                              |
| -------- | ------------------- | --------------------------------- | ---------------------------------- |
| post()   | Object              | { sucess: Boolean, data: Object } | { sucess: Boolean, error: String } |
| get()    |                     | { sucess: Boolean, data: Object } |                                    |
| put()    | uid: String, Object | { sucess: Boolean, data: Object } | { sucess: Boolean, error: String } |
| delete() | uid: String         | { sucess: Boolean}                | { sucess: Boolean, error: String } |

:rotating_light: FakeStoreJs will add an uid for each items.

### Object fomat

```
{
  user: // This is your fake store name
      {
       data: Array, // This is like a mock array to initiate the store with some data
       constructor: function // This will be use to create new entry
      },
   message: // Chain store !
      {
       data: Array,
       constructor: function
      }
 }
```
