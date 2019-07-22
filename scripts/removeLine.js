var fs = require('fs');

const filename = `${process.cwd()}/node_modules/microbundle/dist/microbundle.js`;
const IGNORED_LINE = 647;

fs.readFile(filename, 'utf8', function(err, data) {
  let lines = data.split('\n')
  if (lines[IGNORED_LINE].includes('browser: options.target')) {
    lines = lines.filter((x, i) => i !== IGNORED_LINE && !x.includes("browser: options.target !== 'node'"))
  }
  if (!lines[712].includes('fs.writeFileSync')) {
    lines[712] = "fs.writeFileSync(path.resolve(options.cwd, 'mangle.json'), JSON.stringify(nameCache, null, 2));"
  }
  fs.writeFileSync(filename, lines.join('\n'))
})
