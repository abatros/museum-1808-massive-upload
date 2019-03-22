const fs = require('fs');
const path = require('path')
const jsonfile = require('jsonfile')
//const every_page = require('./every-page.js');
const ls_r = require('./ls-recurse.js');
const Massive = require('massive');

const conn = {
  host: 'inhelium.com',
  port: 5433,
  database: 'museum-v2',
  user: 'xxxxx',
  password: 'xxxxxx'
};

module.exports.main2 = async ()=>{
//  await every_page.init_nspell();
//  const db = Massive.connectSync(conn);
  const db = await Massive(conn);

  console.log('db:',db);
  const json_files = ls_r('/media/dkz/Seagate/18.08-museum-all-pdf-4407-tmp','.json')
  console.log('count:',json_files.length);

  for (let j=0; j<json_files.length; j++) {
//    if (j > 10) break;
    const page = jsonfile.readFileSync(json_files[j]);
    const fn = json_files[j];
    const v = fn.split('/').slice(-1)[0].match(/(.*)::(.*)\.json/);
    console.log (`--${j}-- ${v[1]}  pageno:${v[2]}`)
    const retv = await db.pdf_write_page(v[1],v[2],page._text,null)
    console.log('retv:',retv)
  }

  process.exit(0); // to close connection w/db.
}

process.on('SIGINT', function(){
//  write_final_reports
console.log('WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW');
  process.abort();
})
