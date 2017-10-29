import matter from 'gray-matter';
import TOML from './toml';
import YAML from './yaml';
import JSONFormatter from './json';

const defaultFrontmatterFormat = "yaml";

const parsers = {
  toml: {
    parse: input => TOML.fromFile(null, input),
    stringify: output => TOML.toFile(null, output),
  },
  json: {
    parse: input => {
      let JSONinput = input.trim();
      // Fix JSON if leading and trailing brackets were trimmed.
      if (JSONinput.substr(0, 1) !== '{') {
        JSONinput = '{' + JSONinput;
      }
      if (JSONinput.substr(-1) !== '}') {
        JSONinput = JSONinput + '}';
      }
      return JSONFormatter.fromFile(null, JSONinput);
    },
    stringify: output => JSONFormatter.toFile(null, output),
  },
  yaml: {
    parse: input => YAML.fromFile(null, input),
    stringify: output => YAML.toFile(null, output),
  },
};

const getDelims = format => ({
  yaml: '---',
  toml: '+++',
  json: ['{', '}'],
}[format] || '---');

function matterSettings(collectionOrEntity) {
  const matterFormat = collectionOrEntity.get('front_matter_format', defaultFrontmatterFormat);
  return { engines: parsers, language: matterFormat, delims: getDelims(matterFormat) };
}

export default {
  fromFile(collectionOrEntity, content) {
    const result = matter(content, matterSettings(collectionOrEntity));
    const data = result.data;
    data.body = result.content;
    return data;
  },

  toFile(collectionOrEntity, data, sortedKeys) {
    const meta = {};
    let body = '';
    Object.keys(data).forEach((key) => {
      if (key === 'body') {
        body = data[key];
      } else {
        meta[key] = data[key];
      }
    });

    return matter.stringify(body, meta, matterSettings(collectionOrEntity));
  },
};
