#! /usr/bin/env node

/*
    Language auto detection
    May be a better approach would be to collect [2,3,4] letters words
    and compare 'the' versus ''

    FIRST: V1
    collect frequence ['the','de','des']

    the and is of the in to from its as also at with they more
    un des est le la les en dans que son sa ses et du de au tu as il ce ces
*/

const fs = require('fs');
const jsonfile = require('jsonfile');
const ls = require('./lib/ls-recurse.js');


// ---------------------------------------------------------------------------

const argv = require('yargs')
//  .alias('f','file')      // source file
//  .alias('o','output')    // destination
//  .alias('n','no-match')  // write non-matching words
  .argv;

const files = ls('/media/dkz/Seagate/museum-data','.json')

const tf = {};
const tokens = ['the','de','des'];
for (let i=0; i< files.length; i++) {
  //console.log(`${files[i]}`);
  const pdf1 = jsonfile.readFileSync(files[i]);
//  console.log(`-- (${pdf1._tokens[Math.floor(pdf1._tokens.length/2)]}) token.length:${pdf1._tokens.length}`);
  const f = {};
  tokens.forEach(it=>{f[it]=0;})

  let nw = 0;

  pdf1._tokens.forEach(it=>{
    it = it.toLowerCase()
    if(!tokens.includes(it)) return;

    f[it] = (f[it] || 0) + 1;
    nw += 1;
  })


  const v = Object.keys(f).sort()
    //.map(it=> f[it]); // array-vector
    .map(it=> Math.floor(f[it]*100/nw)); // array-vector

  console.log(`${v.join(':')} ${files[i]}`)

} // each file.
