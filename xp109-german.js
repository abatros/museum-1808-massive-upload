#! /usr/bin/env node

/*
    - read the list of words (zlist.json)
    - load the german dictionary
    - count the number of hits.

    $ npm i dictionary-de --save

*/

const fs = require('fs');
const gdico = require('./lib/mk-gdico.js')
const jsonfile = require('jsonfile');


// ---------------------------------------------------------------------------

const argv = require('yargs')
  .alias('f','file')      // source file
  .alias('o','output')    // destination
  .alias('n','no-match')  // write non-matching words
  .argv;

if (!argv.file && !argv.output) {
  console.log('Need input/output files\nexit.');
  return;
}


// ---------------------------------------------------------------------------
var data;
try {
  data = jsonfile.readFileSync(argv.file);
  if (!data) {
    console.log(`No data in file <${argv.file}>\nexit.`);
    return;
  }
} catch(e) {
  console.log(`No data in file <${argv.file}>\nexit.`);
    return;
}


var hits = 0;


// ---------------------------------------------------------------------------


var nspell;

// ---------------------------------------------------------------------------

const check_name = (w)=>{
  console.log(`${w}: ${nspell.correct(w.toLowerCase())}`);
}

function checkName(w){
  const v = [...arguments]
    .map(it=>{
      return `${it}:${nspell.correct(it)}`
    })
    .join(' ')

  console.log(v);
}

// ---------------------------------------------------------------------------


gdico.init_nspell('dictionary-de')
.then((_nspell)=>{
  nspell = _nspell;
  //console.log('_nspell:',nspell);
  data.forEach((it,j)=>{
    nspell.correct(it) && (()=>{
      hits ++;
      console.log(`${hits}/${j} =>${it}`)
    })()
  })
  console.log('total entries:',data.length);
})
