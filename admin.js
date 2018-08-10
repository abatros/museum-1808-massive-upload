#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
// const pdf = require('./every-pdf.js');
const ls_files = require('./lib/ls-files.js')

// ----------------------------------------------------------------------------

console.log('This is (Admin.js) - A tool for Museum Administration.')

// ----------------------------------------------------------------------------

const argv = require('yargs')
  .alias('f','file')
  .alias('d','dir')
  .alias('a','all')
  .command('ls-files', ':list all files in Index.',
    () => {
      console.log('ls-files BUILDER');
    },
    (argv) => {
      console.log('ls-files:',argv);
      console.log('ls-files:',ls_files());
  })
  .demandCommand()
  .argv;


/*
main1 => to list all pdf files.    ls-file or ls-pages
*/

// ----------------------------------------------------------------------------
console.log('.stopped');
