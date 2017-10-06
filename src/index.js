import applyArgs from './apply-args';

class EError extends Error {
  /**
   * @description Creates an instance of EError or extends an already created error object.
   * @param {(string|Error)} messageOrErrorObject - Message of error or extended error object.
   * @param {...any} args - Data to be added.
   */
  constructor(messageOrErrorObject, ...args) {
    if (messageOrErrorObject instanceof Error) {
      applyArgs(messageOrErrorObject, args);
      return messageOrErrorObject;
    }

    super(messageOrErrorObject);
    this.name = 'EError';

    applyArgs(this, args);
  }

  static prepare(params) {
    if (typeof params !== 'object') {
      throw new EError('Params must be object', {
        current: params,
        currentType: typeof params,
      });
    }

    return class {
      constructor(...args) {
        return new EError(...args, params);
      }
    };
  }
}

module.exports = EError;
