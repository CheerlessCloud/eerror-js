# EError
> An error that can easily combine with additional data

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Build Status](https://travis-ci.org/CheerlessCloud/eerror-js.svg?branch=master)](https://travis-ci.org/CheerlessCloud/eerror-js)
[![Coverage Status](https://coveralls.io/repos/github/CheerlessCloud/eerror-js/badge.svg?branch=master)](https://coveralls.io/github/CheerlessCloud/eerror-js?branch=master)

[![Greenkeeper badge](https://badges.greenkeeper.io/CheerlessCloud/eerror-js.svg)](https://greenkeeper.io/)
[![dependencies Status](https://david-dm.org/CheerlessCloud/eerror-js/status.svg)](https://david-dm.org/CheerlessCloud/eerror-js)
[![devDependencies Status](https://david-dm.org/CheerlessCloud/eerror-js/dev-status.svg)](https://david-dm.org/CheerlessCloud/eerror-js?type=dev)

[![npm](https://img.shields.io/npm/v/eerror.svg)]()
[![node](https://img.shields.io/node/v/eerror.svg)]()
[![MIT License](https://img.shields.io/npm/l/eerror.svg)]()

[![NPM](https://nodei.co/npm/eerror.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/eerror/)


## Usecase
In clear js we do that:
```javascript
function errored() {
  /// ...
  const error = new Error('Entity not found');
  error.status = 404;
  error.code = 'NOT_FOUND';
  error.query = { /* ... */ };
  throw error;
}
```

With this library we can do that:
```javascript
import EError from 'eerror';

function errored() {
  /// ...
  throw new EError('Entity not found').combine({
    query,
    code: 'NOT_FOUND',
    status: 404,
  });
}

// or
function errored() {
  /// ...
  throw new EError().combine({
    message: 'Entity not found',
    code: 'NOT_FOUND',
    status: 404,
    query,
  });
}
```
For clear logs don't combine error with very huge object, like models from database. Just put the most important data, such as the entity id or error codes from external services.

## Error wrapping
Use static method ```wrap``` to add data to existing errors:
```javascript
async function tryAndCatch(user) {
  try {
    await user.foo();
  } catch(error) {
    // this call only apply params to error object
    throw EError.wrap(error, { userId: user.id });
  }
}
```
Also, EError object has method ```wrap```, who assign all of properties of EError instance to error, but not name and stack.
```javascript
async function tryAndCatch(user) {
  try {
    await user.foo();
  } catch(error) {
    // this call apply all of properties from EError instance to error object
    throw new EError().combine({ query }).wrap(error, { userId: user.id });
    // thrower error with 'query' property, userId and all of data from error object
    // stacktrace and name properties will be get from error object
  }
}
```

## Prepared errors
You can create prepared error constructors:
```javascript
const MyBuisnessError = EError.prepare({ message: 'Something wen wrong', code: 42 });

MyBuisnessError instanceof EError // true

async function errored() {
  if (moonPhase) {
    throw new MyBuisnessError({ moonPhase }); // error will contain correct stacktrace,
    // code = 42 and moonPhase value,
    // message will be equal 'Something wen wrong'
  }
}
```
You can create prepared error extends from custom class:
```javascript
// Base class must be extends from EError or childs
const MyBuisnessError2 = EError.prepare(MyBuisnessError, { success: false });

MyBuisnessError instanceof EError // true
MyBuisnessError2 instanceof EError // true

async function errored() {
  if (moonPhase) {
    throw new MyBuisnessError({ moonPhase }); // error will contain correct stacktrace,
    // code = 42, moonPhase value, success = false
    // and message will be equal 'Something wen wrong'
  }
}
```

Also you can wrap errors from prepared error:
```javascript
const MyBuisnessError = EError.prepare({ message: 'Something wen wrong', code: 42 });

async function tryAndCatch(user) {
  try {
    await user.foo();
  } catch(error) {
    // throwed error message will be 'Something wen wrong',
    // and contain code = 42 and userId
    // stack and other additional properties from error will be saved
    throw MyBuisnessError.wrap(error, { userId: user.id });
  }
}
```

## Conflicts resolving
What about conflicts resolving? How don't loose data when we combine error who contain 'code' with options { code: ... }? Yes, save the data in the renamed property!

```javascript
const error = new EError()
  .combine({ message: 'first' })
  .combine({ message: 'second' });
  .combine({ message: 'N + 1' });

error.message === 'N + 1';
error.message_old2 === 'second';
error.message_old1 === 'first';
```

Because it error, you don't interact with this dynamic named properties manual, but you will se replaced data in logs. If you want, you can filtred 'backup' properties in your logger layer by regexp ```/.+_old\d+/```
