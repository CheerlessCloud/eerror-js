/* eslint-disable no-param-reassign */

/**
 * @param {Error} error - Target error object.
 * @param {any[]} args - Data to be added.
 */
export default function applyArgs(error, args) {
  for (let i = 0; i < args.length; i += 1) {
    if (typeof args[i] === 'object') {
      Object.assign(error, args[i]);
    } else {
      error[`param${i + 1}`] = args[i];
    }
  }
}
