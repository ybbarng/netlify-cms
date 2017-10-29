export function fromFile(collectionOrEntity, content) {
  return JSON.parse(content);
}

export function toFile(collectionOrEntity, data) {
  return JSON.stringify(data);
}
