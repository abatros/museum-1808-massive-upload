#! /usr/bin/env node

// test french auto corrector.


const nspell = require('nspell');
const fr_dico = require('dictionary-fr');
var levenshtein = require('levenshtein-edit-distance');

// ---------------------------------------------------------------------------

function init_nspell() {
  return new Promise((resolve)=>{
    fr_dico((err,dict)=>{
      if (err) {
        throw err
      }

      var spell = nspell(dict)
      resolve(spell);
    })
  }); // promise
}; // init_nspell

// ---------------------------------------------------------------------------
/*
const alphabet = ("abcdefghijklmnopqrstuvwxyz").split("");

function findWord(w) {
  cont v = w.split('');
  for (let j=0; j<v.length; j++) {
    let w2 = w.substring(0, i) + w.substring(i + 1, v.length);

  }
}
*/

// ----------------------------------------------------------------------------

function show_suggest(w,w2,etime) {
  console.log(`(${w})=>${w2} etime:${new Date().getTime()-etime}`);
}

console.log('loading dico....');
init_nspell()
.then(nspell => {
  console.log('loaded.');
  [
    'apprecier',
    'appreciiation',
    'apprécation',
    'appréci',
    'appréciat',
    'appréciatio',
    'etain',
    'étin',
    'etan',
    'étain'
  ].forEach(w=>{
    const etime = new Date().getTime();
//    console.log(`(${w})=>`,nspell.correct(w));
    if (nspell.correct(w)) {
      show_suggest(w,w,etime);
      return;
    }


    const v = w.split('');
    for (let j=0; j<v.length; j++) {
      let w2 = w.substring(0, j) + w.substring(j + 1, v.length);
//      console.log('w2:',w2);

      console.log(`(${w})=>(${w2}) dist:${levenshtein(w,w2)}`);


    }
  })
});
