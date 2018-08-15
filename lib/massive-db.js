const Massive = require('massive');
const conn = require('../.private/inhelium-com.js');

const connect_Sync = async ()=>{
  const db = await Massive(conn);
  return db;
}

module.exports = {
  connect_Sync
}
