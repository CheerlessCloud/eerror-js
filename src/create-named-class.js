/**
 * @function createNamedClass - Instantiate class constructor with passed name and base class.
 * @exports
 * @param {string} className - Name of created class.
 * @param {Function} baseClass - Constructor of base class.
 * @returns {Function} - Created class.
 */
export default function createNamedClass(className, baseClass) {
  return {
    [className]: class extends baseClass {},
  }[className];
}
