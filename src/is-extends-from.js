/* eslint-disable no-proto */
function isExtendedFrom(constructor, base) {
  if (!constructor || !base) {
    return false;
  }

  if (constructor.__proto__ === base || constructor === base) {
    return true;
  }
  if (constructor.__proto__ !== undefined && constructor.__proto__ !== null) {
    return isExtendedFrom(constructor.__proto__, base);
  }

  return false;
}

export default isExtendedFrom;
