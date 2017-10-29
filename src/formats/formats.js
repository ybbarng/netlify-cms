import YAML from './yaml';
import TOML from './toml';
import JSONFormatter from './json';
import Frontmatter from './frontmatter';

export const formatToExtension = format => ({
  markdown: 'md',
  yaml: 'yml',
  json: 'json',
  html: 'html',
}[format]);

export const formatByExtension = extension => ({
  yml: YAML,
  yaml: YAML,
  toml: TOML,
  json: JSONFormatter,
  md: Frontmatter,
  markdown: Frontmatter,
  html: Frontmatter,
}[extension] || Frontmatter);

const formatByName = name => ({
  yml: YAML,
  yaml: YAML,
  toml: TOML,
  frontmatter: Frontmatter,
}[name] || Frontmatter);

export function resolveFormat(collectionOrEntity, entry) {
  if (collectionOrEntity === "editorialWorkflow") {
    return Frontmatter;
  }
  const path = entry && entry.path;
  if (path) {
    return formatByExtension(path.split('.').pop());
  }
  return formatByName(collectionOrEntity.get('format'));
}
