class EError extends Error {
  constructor(message, ...args) {
    super(message);
    this.name = 'EError';

    for (let i = 0; i < args.length; i += 1) {
      if (typeof args[i] === 'object') {
        Object.assign(this, args[i]);
      } else {
        this[`param${i + 1}`] = args[i];
      }
    }
  }
}

module.exports = EError;
