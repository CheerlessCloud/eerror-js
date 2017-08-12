# EError
An error that takes additional properties in the constructor

[![Greenkeeper badge](https://badges.greenkeeper.io/TeslaCtroitel/eerror-js.svg)](https://greenkeeper.io/)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Build Status](https://travis-ci.org/TeslaCtroitel/eerror-js.svg?branch=master)](https://travis-ci.org/TeslaCtroitel/eerror-js)
[![Coverage Status](https://coveralls.io/repos/github/TeslaCtroitel/eerror-js/badge.svg?branch=master)](https://coveralls.io/github/TeslaCtroitel/eerror-js?branch=master)
[![BCH compliance](https://bettercodehub.com/edge/badge/TeslaCtroitel/eerror-js?branch=master)](https://bettercodehub.com/)
[![dependencies Status](https://david-dm.org/TeslaCtroitel/eerror-js/status.svg)](https://david-dm.org/TeslaCtroitel/eerror-js)
[![devDependencies Status](https://david-dm.org/TeslaCtroitel/eerror-js/dev-status.svg)](https://david-dm.org/TeslaCtroitel/eerror-js?type=dev)


[![npm](https://img.shields.io/npm/v/eerror.svg)]()
[![node](https://img.shields.io/node/v/eerror.svg)]()
[![MIT License](https://img.shields.io/npm/l/eerror.svg)]()

[![NPM](https://nodei.co/npm/eerror.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/eerror/)

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
