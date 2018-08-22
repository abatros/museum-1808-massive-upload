#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const Massive = require('massive');
const monitor = require('pg-monitor');

//const json = JSON.parse(fs.readFileSync('../postgres/pdf-store.json'))

const conn = {
  host: 'inhelium.com',
  port: 5433,
  database: 'museum-v2',
  user: 'postgres',
  password: 'sandeep'
};


//const pdfUtil = require('pdf-to-text');
//const pdf_parse = require('pdf-parse');
//const pdf = require('./lib/every-pdf.js');
const pdf = require('./lib/pdf-lib.js');

console.log(process.env.pdfdir)

const argv = require('yargs')
  .alias('f','file')
  .alias('d','dir')
  .alias('a','all')
  .alias('v','verbose')
  .alias('u','upload')
  .argv;


argv.dir = argv.dir || process.env.pdfdir;

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


/*
  Here we process an entire folder.
*/

const base_dir = argv.dir;

const pdf_files = fs.readdirSync(base_dir).filter(it => it.endsWith('.pdf'))
if (pdf_files.length > 0) {
  console.log(`Directory <${argv.dir}> contains ${pdf_files.length} .pdf/files`);
} else {
  console.log('NO PDF STOP')
  return;
}


console.log(`files:${pdf_files.length}`);

// ---------------------------------------------------------------------------

function xtract_kwords(s) {
  const v = s.toLowerCase().replace(/[\s0-9]*\.pdf$/,'')
    .match(/^([0-9]{4}) (ca)? *(.*)$/)
  const year = v.slice(1,3).filter(it=>it).join('-');
  const kwords = year + ' ' + v.slice(3);
//  console.log(`match: (${v.slice(1,3).filter(it=>it).join('-')})`,v.slice(3).join(' ').replace(/\s+/,' '))
  return kwords.replace(/section/g,'').replace(/\s+/g,' ');
}

// ---------------------------------------------------------------------------

async function main(){
  let total_raw = 0;
  let total_pages = 0;
  const pages = [];
  if (argv.verbose)
  console.log('loading Massive...');
  const db = await Massive(conn);
  if (argv.verbose)
  console.log('Massive is ready.');

  for (let j=0; j<pdf_files.length; j++) {
//    const fp = path.join(argv.dir, pdf_files[j]);
    if (argv.verbose)
    console.log(`--(${j})---`,pdf_files[j]);
    /*
      every_pdf is an async function that for each page:
      - extracts text
      - writes a json file with original text and words distribution
    */

    try {
      const url = path.join(base_dir,pdf_files[j]);
      const doc = await pdf.get_pages(url, argv)
//      console.log(`${pages.length} + ${doc.length}`);
      doc.forEach(async (page,k)=>{
        page.url = url;
        page.pageNo = k+1;
        page.kwords = xtract_kwords(pdf_files[j]);
        // maybe some cleaning here.
        //console.log(`it.kwords:${it.kwords}`)
        pages.push(page);
        // THEN UPLOAD.
        [pageNo,raw_text,data]=[k+1,page.raw_text,null];
        if (argv.upload) {
          const retv = await db.pdf_write_page(url,pageNo,raw_text,data);
          console.log('retv:',retv)
        }

      })
//      pages.push(...doc);

    } catch (e) {
      console.log('ERROR:',e.message)
      throw `FATAL-ERROR file: <<${pdf_files[j]}>>`;
    }
  }
//  console.log(`total_raw:${total_raw}`);
//  console.log(`total_pages:${total_pages}`);
  return pages
}


main()
.then((pages)=>{
  console.log('done npages:',pages.length);
  pages.forEach((it,j)=>{
    console.log(`${j} =>${it.url}::${it.pageNo} [${it.kwords}]`)
    // do more cleaning and formatting
  })
})
.catch (e => {
  console.log(e)
})
