#! /usr/bin/env node

/*
    english 350,000 words.
*/

const fs = require('fs');
const jsonfile = require('jsonfile');


// ---------------------------------------------------------------------------

const argv = require('yargs')
//  .alias('f','file')      // source file
//  .alias('o','output')    // destination
//  .alias('n','no-match')  // write non-matching words
  .argv;


const words = fs.readFileSync('./tree/english-gutenberg.txt', 'utf8').split('\n');
console.log(`words.length:${words.length}`);

const tg = {};

words.forEach((it,j)=>{
  if (j%1000 == 0) console.log(`${j} (${it})`);
  const k = it.slice(-3);
//  console.log(`--(${it}) ${k}`);
  if (!tg[k]) {
    tg[k] = {hits:1, tri: new Set()}
  } else {
    tg[k].hits ++;
  }
  tg[k].tri.add(it)
  //console.log(tg[k])
});


const v = Object.keys(tg).sort().map(it=>{
  return {key:it, hits:tg[it].hits, li: [...tg[it].tri].join(' ')}
})

jsonfile.writeFileSync('_111.json', v, {spaces:2});
