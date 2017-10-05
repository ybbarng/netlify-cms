import stableStringify from 'json-stable-stringify';

export default class JSONFormatter {
  fromFile(content) {
    return JSON.parse(content);
  }

  toFile(data, sortedKeys = []) {
    const sortFn = sortKeys(sortedKeys);
    const cmdFn = (a, b) => sortFn(a.key, b.key);
    return stableStringify(data, { cmp: cmpFn });
  }
}
