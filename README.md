# fakeStoreJs :construction: [![Build Status](https://travis-ci.org/FabienGreard/fakeStoreJs.svg?branch=master)](https://travis-ci.org/FabienGreard/fakeStoreJs)[![dependencies Status](https://david-dm.org/FabienGreard/fakeStoreJs/status.svg)](https://david-dm.org/FabienGreard/fakeStoreJs)[![devDependencies Status](https://david-dm.org/FabienGreard/fakeStoreJs/dev-status.svg)](https://david-dm.org/FabienGreard/fakeStoreJs?type=dev)

FakeStoreJs make mocking easy, quickly create a CRUD acess to any object

Create multiple store less than a heartbeat ! :hearts:
Auto implements a unique id on mocked data ! :free:
Extends CRUD method using resolvers ! :unlock:
Easy to use ! 🔥

If something doesn’t work, please [file an issue](https://github.com/FabienGreard/fakeStoreJs/issues/new) :bug:.

## QuickStart :rocket:

### Install

```sh
$ npm install fakestorejs or yarn install fakestorejs
```

### Use it Now !

Start importing `createStore` from fakeStoreJs.

```javascript
const createStore = require('fakeStoreJs');
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

fakeStoreJs when trying to create a fake store need an object with at least on key.
Each key must provide an array of data and a constructor, look at the example below.

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

fakeStoreJs comes with embeded crud like method :
However you can override them and or create new one using [resolvers](https://github.com/FabienGreard/fakeStoreJs#Resolvers) !

| Method   | Parameters          | sucess                            | error                              |
| -------- | ------------------- | --------------------------------- | ---------------------------------- |
| post()   | Object              | { sucess: Boolean, data: Object } | { sucess: Boolean, error: String } |
| get()    |                     | { sucess: Boolean, data: Object } |                                    |
| put()    | uid: String, Object | { sucess: Boolean, data: Object } | { sucess: Boolean, error: String } |
| delete() | uid: String         | { sucess: Boolean}                | { sucess: Boolean, error: String } |

FakeStoreJs will add an uid for each items.

#### Resolvers

Resolvers allow to add custom methods by adding a key inside your object call `resolvers` :

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
    resolvers: {
      // Add your own methods !!
      getById: function(uid) {
        return this.db.find(item => item.uid === uid);
      }
    }
  }
});
```

fakeStoreJs bind the resolvers with a neat context : `{ db: Array, cst: constructor }` where :

- `db` is the data from your store.
- `cst` is your constructor from the `createStore()`.

## Contributing

This project welcome any new contribution.
