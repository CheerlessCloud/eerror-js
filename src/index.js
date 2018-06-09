import { merge } from './merge-options';
import isExtendsFrom from './is-extends-from';

class EError extends Error {
  /**
   * @param {string?} message - Message of error.
   */
  constructor(message) {
    super(message);
    this.name = this.constructor.name || 'EError';

    if (this.constructor.defaultOptions) {
      merge(this, this.constructor.defaultOptions);
    }
  }

  combine(options) {
    merge(this, options);
    return this;
  }

  wrap(error) {
    const options = Object.getOwnPropertyNames(this)
      .reduce((obj, key) => {
        // eslint-disable-next-line no-param-reassign
        obj[key] = this[key];
        return obj;
      }, {});
    if (error.name) {
      options.name = undefined;
    }
    options.stack = undefined;
    return merge(error, options);
  }

  static wrap(error, options = {}) {
    const opts = merge(merge({}, options), this.defaultOptions || {});
    if (error.name) {
      opts.name = undefined;
    }

    return merge(error, opts);
  }

  static prepare(...args) {
    let baseClass;
    let options;
    if (typeof args[0] === 'function' && (args[1] && typeof args[1] === 'object')) {
      [baseClass, options] = args;
    } else if (args[0] && typeof args[0] === 'object') {
      baseClass = EError;
      [options] = args;
    } else {
      throw new EError('Invalid arguments').combine({ args });
    }

    if (!isExtendsFrom(baseClass, EError)) {
      throw new EError('Base class must be extended from EError').combine({ baseClass });
    }

    const className = (typeof options.name === 'string' && options.name.replace(/\s/g, '_')) ||
                      `Prepared${baseClass.name}` ||
                      'PreparedError';

    const body = `return class ${className} extends ${baseClass.name} { }`;

    // eslint-disable-next-line no-new-func
    const newClass = new Function(baseClass.name, body)
      .call(null, baseClass);

    newClass.defaultOptions = merge(
      merge({}, baseClass.defaultOptions || {}),
      options,
    );

    return newClass;
  }
}

module.exports = EError;
