import matter from 'gray-matter';
import TOML from './toml';
import YAML from './yaml';
import JSONFormatter from './json';

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

function inferFrontmatterFormat(str) {
  const firstLine = str.substr(0, str.indexOf('\n')).trim();
  if ((firstLine.length > 3) && (firstLine.substr(0, 3) === "---")) {
    // No need to infer, `gray-matter` will handle things like `---toml` for us.
    return;
  }
  switch (firstLine) {
    case "---":
      return { language: "yaml", delimiters: "---" };
    case "+++":
      return { language: "toml", delimiters: "+++" };
    case "{":
      return { language: "json", delimiters: ["{", "}"] };
    default:
      throw "Unrecognized front-matter format.";
  }
}

export default {
  fromFile(collectionOrEntity, content) {
    const result = matter(content, { engines: parsers, ...inferFrontmatterFormat(content) });
    return {
      ...result.data,
      body: result.content,
    };
  },

  toFile(collectionOrEntity, data, sortedKeys) {
    const { body, ...meta } = data;
    const matterFormat = collectionOrEntity.get('front_matter_format', "yaml");
    return matter.stringify(body, meta, { engines: parsers, language: matterFormat, delimiters: getDelims(matterFormat) });
  },
};
