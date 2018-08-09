#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const pdf = require('./every-pdf.js');

const argv = require('yargs')
  .alias('f','file')
  .alias('d','dir')
  .alias('a','all')
  .argv;


if (!argv.file && !argv.dir) {
  console.log('Need folder or pdf/file\nexit.');
  return;
}

/*
const every_page = (page, text) => {
  console.log('\npageIndex:',page.pageIndex)
  console.log('=> text:',text);
}
*/

//const every_pdf = require('./every-page.js').every_pdf;

if (argv.file) {
  if (argv.dir) {
    console.log('Warning: Both dir and file are specified');
  }
  const fp = path.join(argv.dir, argv.file)
  if (!fs.existsSync(fp)) {
    console.log(`Directory <${fp}> not found`);
    return;
  }
  console.log(`processing file <${fp}>...`);
  pdf.every_pdf(fp, argv);
  return;
}

/*
  By default, PDF files are not processed.
  Instead, go directly to JSON files.
*/

if (!argv.extract_pdf) {
/*
  const json_files = fs.readdirSync(argv.dir).filter(it => it.endsWith('.json'))
  if (pdf_files.length > 0) {
    console.log(`Directory <${argv.dir}> contains ${pdf_files.length} .pdf/files`);
  } else {
    console.log('NO PDF STOP')
    return;
  }
*/

  // main2 can't start until spell is resolved.
  require('./lib/main2.js').main2();
  //pdf.write_final_reports();
  return;
}
