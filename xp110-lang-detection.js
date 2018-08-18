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

for (let i=0; i< files.length; i++) {
  //console.log(`${files[i]}`);
  const pdf1 = jsonfile.readFileSync(files[i]);
//  console.log(`-- (${pdf1._tokens[Math.floor(pdf1._tokens.length/2)]}) token.length:${pdf1._tokens.length}`);
  const f = {};
  let nw = 0;
  let rev3 = new Set();
  let rev2 = new Set();

  pdf1._tokens.forEach(it=>{
//    console.log(`---- (${it})=>${it.slice(-1)}`)
//    if(!tokens.includes(it)) return;
    if (it.length < 3) return;
    const cc = it.slice(-3).toLowerCase();
    if (!Number.parseInt(cc)) {
      f[cc] = (f[cc] || 0) + 1;
      nw += 1;
    }
  })


  const v1 = Object.keys(f)
      .sort((a,b)=>f[b]-f[a])
      .slice(0,5)

  const v = v1
      .map(it=> `'${it}':${Math.floor(f[it]*100/nw)}`);

  const off = Math.floor(pdf1._tokens.length/2);
  console.log(`${v1.slice(-1).join('')}=(${pdf1._tokens[off]} ${pdf1._tokens[off+1]} ${pdf1._tokens[off+2]}) `, v.join(' '));

  /*
    add the most frequent trigram to tf.
    and add a random word.
  */

  const c3 = v1[0]
  if (!tf[c3]) {
    tf[c3] = {hits:1, h1:[]}
  } else {
    tf[c3].hits += 1;
  }
//  tf[c3].w.push(pdf1._tokens[off]);
  tf[c3].h1.push(it);
} // next file.

//console.log('TG:',tf)

//var x = new Map(Object.entries(tf))
//x = new Map([...x.entries()].sort())

//console.log('TG/map:',x)


const skeys = Object.keys(tf).sort((a,b)=>tf[b]-tf[a]);
const o2 = {};
skeys.forEach(it=>{o2[it]=tf[it]})
jsonfile.writeFileSync('_110.json', o2, {spaces:2});


console.log(``,skeys.map(it=> `'${it}':${tf[it]}`).join('\n'))
