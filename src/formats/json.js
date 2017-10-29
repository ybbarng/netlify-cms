export default {
  fromFile(collectionOrEntity, content) {
    return JSON.parse(content);
  },

  toFile(collectionOrEntity, data) {
    return JSON.stringify(data);
  },
};
