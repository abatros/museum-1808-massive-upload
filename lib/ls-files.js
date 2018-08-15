//const Massive = require('massive');
//const conn = require('../.private/inhelium-com.js');

const pg = require('./massive-db.js');

const ls_files = async ()=>{
  const db = await pg.connect_Sync();
  const files = db.query('select filename from pdf_files');
  //db.end()
  return files;
}

module.exports = ls_files;
