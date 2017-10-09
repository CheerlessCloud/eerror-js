/* eslint-disable no-param-reassign */

/**
 * @param {Error} error - Target error object.
 * @param {any[]} args - Data to be added.
 */
export default function applyArgs(error, args) {
  const additionalArgs = args.filter((arg) => {
    if (typeof arg !== 'object') {
      return true;
    }

    return !Object.assign(error, arg);
  });

  if (additionalArgs.length) {
    if (error.additionalArgs && error.additionalArgs instanceof Array) {
      error.additionalArgs.push(...additionalArgs);
    } else {
      error.additionalArgs = [...additionalArgs];
    }
  }
}
