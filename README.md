# EError
An error that takes additional properties in the constructor

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Build Status](https://travis-ci.org/CheerlessCloud/eerror-js.svg?branch=master)](https://travis-ci.org/TeslaCtroitel/eerror-js)
[![Coverage Status](https://coveralls.io/repos/github/CheerlessCloud/eerror-js/badge.svg?branch=master)](https://coveralls.io/github/CheerlessCloud/eerror-js?branch=master)

[![Greenkeeper badge](https://badges.greenkeeper.io/CheerlessCloud/eerror-js.svg)](https://greenkeeper.io/)
[![dependencies Status](https://david-dm.org/CheerlessCloud/eerror-js/status.svg)](https://david-dm.org/CheerlessCloud/eerror-js)
[![devDependencies Status](https://david-dm.org/CheerlessCloud/eerror-js/dev-status.svg)](https://david-dm.org/CheerlessCloud/eerror-js?type=dev)

[![npm](https://img.shields.io/npm/v/eerror.svg)]()
[![node](https://img.shields.io/node/v/eerror.svg)]()
[![MIT License](https://img.shields.io/npm/l/eerror.svg)]()

[![Sponsor](https://app.codesponsor.io/embed/jkPpzosXxwDBBaBNpoqWKCXd/CheerlessCloud/eerror-js.svg)](https://app.codesponsor.io/link/jkPpzosXxwDBBaBNpoqWKCXd/CheerlessCloud/eerror-js)

[![NPM](https://nodei.co/npm/eerror.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/eerror/)

In ordinary js we do that:
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
  throw new EError('Entity not found', {
    code: 'NOT_FOUND',
    status: 404,
    ...query,
  }, 'this param will be placed at "param2" property');
}

// or
function errored() {
  /// ...
  throw new EError({
    message: 'Entity not found',
    code: 'NOT_FOUND',
    status: 404,
    query,
  }, 'this param will be placed at "param2" property');
}
```
And this:
```javascript
async function tryAndCatch(user) {
  try {
    await user.foo();
  } catch(error) {
    // this call only apply params to error object and return from constructor
    throw new EError(error, { userId: user.id })
  }
}
```
Also you can create prepared error constructors:
```javascript
const MyBuisnessError = EError.prepare({ message: 'Something wen wrong', code: 42 });

async function errored() {
  if (moonPhase) {
    throw new MyBuisnessError({ moonPhase }); // error will contain correct stacktrace, code = 42 and moonPhase value, message will be equal 'Something wen wrong'
  }
}
```

If you use it in NodeJS, use 'code' property for matching errors (see details in [Node.js Errors — Changes you need to know about](https://medium.com/the-node-js-collection/node-js-errors-changes-you-need-to-know-about-dc8c82417f65)).
