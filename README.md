# EError
An error that takes additional properties in the constructor

(https://greenkeeper.io/)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Build Status](https://travis-ci.org/TeslaCtroitel/eerror.svg?branch=master)](https://travis-ci.org/TeslaCtroitel/eerror)
[![dependencies Status](https://david-dm.org/TeslaCtroitel/eerror/status.svg)](https://david-dm.org/TeslaCtroitel/eerror)
[![devDependencies Status](https://david-dm.org/TeslaCtroitel/eerror/dev-status.svg)](https://david-dm.org/TeslaCtroitel/eerror?type=dev)
[![Coverage Status](https://coveralls.io/repos/github/TeslaCtroitel/eerror/badge.svg?branch=master)](https://coveralls.io/github/TeslaCtroitel/eerror?branch=master)
[![BCH compliance](https://bettercodehub.com/edge/badge/TeslaCtroitel/eerror?branch=master)](https://bettercodehub.com/)

**Attention: this is very early version. Don't use it in production.**

In ordinary js we do that:
```javascript
function errored() {
  /// ...
  const error = new Error('Entity not found');
  error.status = 404;
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
    status: 404,
    ...query,
  }, 'this param will be placed at "param2"');
}
```
