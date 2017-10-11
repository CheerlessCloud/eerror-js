import applyArgs from './apply-args';

class EError extends Error {
  /**
   * @description Creates an instance of EError or extends an already created error object.
   * @param {(string|Error)} param1 - Message of error or extended error object.
   * @param {...any} args - Data to be added.
   */
  // eslint-disable-next-line constructor-super
  constructor(...args) {
    if (args.length > 0) {
      if (args[0] instanceof Error) {
        applyArgs(args[0], args.slice(1));
        return args[0];
      }

      if (typeof args[0] !== 'string') {
        args.unshift('');
      }

      super(args[0]);

      args.shift();

      applyArgs(this, args);
    } else {
      super();
    }
  }

  static prepare(params) {
    if (typeof params !== 'object') {
      throw new EError('Params must be object', {
        current: params,
        currentType: typeof params,
      });
    }

    return class extends EError {
      constructor(...args) {
        super(...args, params);
      }
    };
  }
}

module.exports = EError;
