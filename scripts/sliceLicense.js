var fs = require('fs');

const filename = `${process.cwd()}/dist/hooked-form.modern.js`;

fs.readFile(filename, 'utf8', function(err, data) {
  const lines = data.split('\n');
  const imports = lines.slice(0, 2);
  const source = lines.slice(17);
  const final = [...imports, ...source].join('\n');
  fs.writeFile(filename, final, console.log);
});
