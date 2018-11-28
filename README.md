# fakeStoreJs :construction: [![Build Status](https://travis-ci.org/FabienGreard/fakeStoreJs.svg?branch=master)](https://travis-ci.org/FabienGreard/fakeStoreJs)[![install size](https://packagephobia.now.sh/badge?p=fakestorejs)](https://packagephobia.now.sh/result?p=fakestorejs)

akeStoreJs make mocking easy, quickly create a CRUD access to any object

- Create multiple store less than a heartbeat ! :hearts:
- Auto implements a unique id on mocked data ! :free:
- Extends CRUD method using resolvers ! :unlock:
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
```

:tada: Start using it :tada:

```javascript
store.book.get(); // { sucess: true, data: [ { uid: "000000" author: "Speaking JavaScript", title: "Dr. Axel Raushmayer" }, ...] }
```

## Usage

### Requirements

fakeStoreJs need an object with at least on key.
Each key represent a collection name (or table name) and they must provide an array of data and a constructor, look at the example below.

```javascript
{
  Dragons: {
    data: [], // can be empty or fill with any object
    constructor: function Dragon() {} // deprecated use of anonymous function
  }
}
```

Let's now have a deeper look at what are constructor.

### Constructor

A constructor is the schema used by fakestorejs to create new object.

Example : You want to create a store of users, each user should have a firstname and a lastname, you need to specified it :

```javascript
const store = createStore({
  user: {
    data: [],
    constructor: function User({ firstname, lastname }) {
      this.firstname = firstname;
      this.lastname = lastname;
    }
  }
});
```

### Methods

fakeStoreJs comes with embedded crud like method :
However you can override them and or create new one using [resolvers](https://github.com/FabienGreard/fakeStoreJs#Resolvers) !

| Method   | Parameters          | sucess                            | error                              |
| -------- | ------------------- | --------------------------------- | ---------------------------------- |
| post()   | Object              | { sucess: Boolean, data: Object } | { sucess: Boolean, error: String } |
| get()    |                     | { sucess: Boolean, data: Object } |                                    |
| put()    | uid: String, Object | { sucess: Boolean, data: Object } | { sucess: Boolean, error: String } |
| delete() | uid: String         | { sucess: Boolean}                | { sucess: Boolean, error: String } |

FakeStoreJs will add a unique identifier(uid) for each item.

#### Resolvers

Resolvers allow custom methods by adding a key inside your object call `resolvers` :

```javascript
const store = createStore({
  book: {
    data: [
      { author: 'Speaking JavaScript', title: 'Dr. Axel Raushmayer' },
      { author: 'Effective JavaScript', title: 'David Herman' },
      { author: 'Eloquent Javascript', title: 'Marijin Haverbeke' },
      { author: 'You-Dont-Know-JS', title: 'Kyle Simpson' }
    ],
    resolvers: {
      // Add your own methods !!
      getById: function(uid) {
        const item = this.db.find(item => item.uid === uid);
        return item
          ? { sucess: true, data: item }
          : { sucess: false, error: 'couldnt match the uid' };
      }
    }
  }
});
```

fakeStoreJs bind the resolvers with a neat context : `{ db: Array, cst: constructor }` where :

- `db` is the data from your store.
- `cst` is your constructor from the `createStore()`.

### Options

It is possible to add options to fakeStoreJs using the key : `options` :

```javascript
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
    },
    options: {
      idLabel: 'id'
    }
  }
});
```

| Method  | Type   | informations                                  |
| ------- | ------ | --------------------------------------------- |
| idLabel | String | Use as 'key name' for the generate identifier |

## Contributing

This project welcome any new contribution.
