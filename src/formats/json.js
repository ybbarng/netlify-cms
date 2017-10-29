export function fromFile(content) {
  return JSON.parse(content);
}

export function toFile(data) {
  return JSON.stringify(data);
}
