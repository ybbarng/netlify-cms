export default class JSONFormatter {
  fromFile(collectionOrEntity, content) {
    return JSON.parse(content);
  }

  toFile(collectionOrEntity, data) {
    return JSON.stringify(data);
  }
}
