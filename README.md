# fakeStoreJs :construction: [![Build Status](https://travis-ci.org/FabienGreard/fakeStoreJs.svg?branch=master)](https://travis-ci.org/FabienGreard/fakeStoreJs)[![install size](https://packagephobia.now.sh/badge?p=fakestorejs)](https://packagephobia.now.sh/result?p=fakestorejs)[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/FabienGreard/fakeStoreJs.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/FabienGreard/fakeStoreJs/context:javascript)[![devDependencies Status](https://david-dm.org/FabienGreard/fakeStoreJs/dev-status.svg)](https://david-dm.org/FabienGreard/fakeStoreJs?type=dev)

fakeStoreJs make mocking easy, quickly create a CRUD access to any object

- Create multiple store in less than a heartbeat ! :hearts:
- Come with a unique id attribution ! :boom:
- Extends CRUD method using resolvers ! :unlock:
- Persistant data ! :new:
- Easy to use ! 🔥

If something doesn’t work, please [file an issue](https://github.com/FabienGreard/fakeStoreJs/issues/new) :bug:.

## QuickStart :rocket:

### Install

```sh
$ npm install fakestorejs or yarn install fakestorejs
```

### Use it Now !

Start importing `createStore` from fakeStoreJs.

```javascript
const createStore = require('fakestorejs');
```

Create a store from any object.

```javascript
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
```

:tada: Start using it :tada:

```javascript
store.book.get();
// { sucess: true, data: [ { uid: "000000" author: "Speaking JavaScript", title: "Dr. Axel Raushmayer" }, ...] }
```

## Usage

### Requirements

fakeStoreJs need an object with at least on key.
Each key represent a collection name (or table name) and they must provide an array of data or a schema, look at the example below.

```javascript
const store = createStore({
  dragon: {
    data: [], // can be empty or fill with any object
    schema: function Dragon() {}, // deprecated use of anonymous function
    options: { useSchema: true } // Must be specified or it will create a schema from the data given see next example (schemaless)
  }
});
```

Or

```javascript
const store = createStore({
  dragon: {
    data: [{ name: 'Frizzly', type: 'Ice' }] // Must have at least one object
  }
});
```

Let's now have a deeper look at what are schema.

### Schema

A schema is the 'constructor' used by fakestorejs to create new object.

Example : You want to create a store of users, each user should have a username build from its lastname and firstname, you need to specified it :

```javascript
const store = createStore({
  user: {
    data: [],
    schema: function User({ firstname, lastname }) {
      this.firstname = firstname;
      this.lastname = lastname;
      this.username = `${firstname[0]}.${${lastname}}` // Usualy schema are used to create 'calculated' properties otherwise use fakeStoreJs schemaless strategy
    },
    options: {
      useSchema: true
    }
  }
});
```

### Schemaless strategy

Most of the time when mocking data you don't need complexity properties like in the schema model, this is the schemaless fakeStoreJs strategy.

```javascript
const store = createStore({
  user: {
    data: [{ firstname: 'David', lastname: 'Herman' }] // fakeStoreJs will automatically create a schema that take every key from your first object inside your data array
  }
});
```

### Methods

fakeStoreJs comes with embedded crud like method :
However you can override them and or create new one using [resolvers](https://github.com/FabienGreard/fakeStoreJs#Resolvers) !

| Method   | Parameters               | sucess                            | error                              |
| -------- | ------------------------ | --------------------------------- | ---------------------------------- |
| post()   | obj: Object              | { sucess: Boolean, data: Object } | { sucess: Boolean, error: String } |
| get()    | None                     | { sucess: Boolean, data: Object } | { sucess: Boolean, error: String } |
| put()    | uid: String, obj: Object | { sucess: Boolean, data: Object } | { sucess: Boolean, error: String } |
| delete() | uid: String              | { sucess: Boolean}                | { sucess: Boolean, error: String } |

FakeStoreJs will add a unique identifier(uid) for each item.

#### Resolvers

Resolvers allow custom methods by adding a key inside your object call `resolvers` :

```javascript
const store = createStore({
  book: {
    data: [
      { title: 'Speaking JavaScript', author: 'Dr. Axel Raushmayer' },
      { title: 'Effective JavaScript', author: 'David Herman' },
      { title: 'Eloquent Javascript', author: 'Marijin Haverbeke' },
      { title: 'You-Dont-Know-JS', author: 'Kyle Simpson' }
    ],
    resolvers: {
      // Add your own methods !!
      getById: function(uid) {
        // do not use arrow function
        const item = this.collection.find(item => item.uid === uid);
        return item
          ? { sucess: true, data: item }
          : { sucess: false, error: 'couldnt match the uid' };
      },
      multiplePost: function(arrayOfObj) {
        let error = false;
        for (let [i, obj] of arrayOfObj.entries()) {
          try {
            obj = this.Book(obj); // use of the schema context, 'collection': book with 'schema': Book
            this.collection = [...this.collection, obj];
          } catch (e) {
            error = { sucess: false, error: e };
            break;
          }
          arrayOfObj[i] = obj;
        }
        return error ? error : { sucess: true, data: arrayOfObj };
      }
    }
  }
});
```

fakeStoreJs bind the resolvers with a neat context : `{ collection: Array, schema: Function }` where :

- `collection` is the table from your store(database).
- `schema` is your schema from the `createStore()`.

Nb: `schema` will always be your collection name capitalized.

example: `book` cst will be `Book`

### Options

It is possible to add options to fakeStoreJs using the key : `options` :

```javascript
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
      idLabel: 'id',
      useSchema: true
    }
  }
});
```

| Method       | Type    | informations                                                   | Default |
| ------------ | ------- | -------------------------------------------------------------- | ------- |
| idLabel      | String  | Use as 'key name' for the generate identifier                  | 'uid'   |
| useSchema    | Boolean | Switch beetween embedded schema constructor or your own schema | false   |
| isPersistent | Boolean | Allow to save your data after a restart                        | false   |

## Contributing

This project welcome any new contribution.
