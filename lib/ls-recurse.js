const fs = require('fs');
const path = require('path');

/*
  .map() or .filter() could not be used in recursive function.
  Instead using .reduce()
*/

const ls_recurse = (dir,ext) =>
  fs.readdirSync(dir).reduce((acc_files, file) => {
    const next_fname = path.join(dir, file);
    if (fs.statSync(next_fname).isDirectory()) {
      return [...acc_files, ...ls_recurse(next_fname,ext)];
    } else {
      return file.endsWith(ext) ? [...acc_files, next_fname] : acc_files;
    }
  }, []);

module.exports = ls_recurse;
