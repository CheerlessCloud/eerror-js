/* eslint-disable no-param-reassign, no-confusing-arrow */
function findMaxId(target, keyName) {
  const regexp = new RegExp(`^${keyName}__old\\d+$`);
  const regexpToReplace = new RegExp(`^${keyName}__old`);

  return Object.keys(target)
    .filter(key => regexp.test(key))
    .map(key => key.replace(regexpToReplace, ''))
    .map(keyNumber => parseInt(keyNumber, 10))
    .reduce((max, current) => ((current > max) ? current : max), 0);
}

function merge(target, options) {
  if (!target || typeof target !== 'object') {
    throw new Error('Target must be object');
  }

  if (!options || typeof options !== 'object' || Array.isArray(options)) {
    throw new Error('Options must be object');
  }

  if (options instanceof Error) {
    options = { error: options };
  }

  for (const key of Object.keys(options)) {
    if (options[key] !== undefined) {
      const desc = Object.getOwnPropertyDescriptor(target, key);

      if (desc && (desc.value || desc.get)) {
        target[`${key}__old${findMaxId(target, key) + 1}`] = target[key];
      }

      Object.defineProperty(target, key, {
        enumerable: desc ? desc.enumerable : true,
        configurable: true,
        value: options[key],
        writable: desc ? desc.writable : true,
      });
    }
  }

  return target;
}

export default merge;
export { merge };
export { findMaxId };
