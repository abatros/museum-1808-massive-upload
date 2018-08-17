/*

  from folder : greate a global dictionary.
  from file: create a report

*/

const fs = require('fs')
const join = require('path').join;
const jsonfile = require('jsonfile')
const ls = require('./ls-recurse.js')

const nspell = require('nspell');
const fr_dico = require('dictionary-fr');
const en_dico = require('dictionary-en-us');

// ---------------------------------------------------------------------------

// to be dumped into jsonfile.

let total_raw_size = 0;
let dico;
const tokens = {}
const fr_tokens = {}
const en_tokens = {}
const de_tokens = {}
const black_tokens = {}
const noise = {} // regular expression filter
const suggest = {}


// ---------------------------------------------------------------------------

process.on('SIGINT', function(){
  console.log('--SIGINT-- (mk-gdico.js)');
  process.exit(-1)
})

process.on('SIGHUP', function(){
  console.log('--SIGHUP-- (mk-gdico.js)');
//  process.kill(process.pid, 'SIGHUP');
  process.exit(-1)
})

//process.kill(process.pid, 'SIGHUP');

// ---------------------------------------------------------------------------

async function init_nspell() {
  return new Promise((resolve)=>{
    fr_dico((err,dict)=>{
      if (err) {
        throw err
      }

      const spell = nspell(dict)
      resolve(spell);
    })
  }); // promise
}; // init_nspell

async function init_nspell_en() {
  return new Promise((resolve)=>{
    en_dico((err,dict)=>{
      if (err) {
        throw err
      }

      const spell = nspell(dict)
      resolve(spell);
    })
  }); // promise
}; // init_nspell



// ----------------------------------------------------------------------------

function main(fpath) {
  try {
    if (fs.statSync(fpath).isDirectory()) {
      console.log('processing directory')
      do_directory(fpath);
    } else {
      console.log('processing file')
    }
  }
  catch (e) {
    console.log('fatal error:',e);
  }
}


const noise2 = (w) => {
  const v = w.match(/[0-9]{5,}/)
    || w.match(/[o]{4,}/)
    || w.match(/[a-z][A-Z]/)
    || w.match(/[0-9][A-Za-z]/)
    || w.match(/[aeiuAEIOU]{3,}/)
    || w.match(/[a-z]{2,}[A-Z]/)
    || w.match(/[A-Z]{2,}[a-ziïî]/)
    || w.match(/[hjkqvwxyzHJKQVWXYZ]{2,}/)
    || w.match(/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{4,}/)

//  if (v) console.log(`noise2-- (${w}) :${v&&v.length} =>`,v&&v[0])
  return v;
}

var nspell_fr;
var nspell_en;

const fr_alphabet = ("abcdefghijklmnopqrstuvwxyzéâêîôûëïüàèù").split("");
const alphabet = ("abcdefghijklmnopqrstuvwxyz").split("");

function fr_suggest(w) {
  const v = w.split('');
  const length = v.length;
  const alt = [];

  for (let j=0; j<v.length; j++) {
    // Deletion
    let w2 = w.substring(0, j) + w.substring(j + 1, v.length);
    if (nspell_fr.correct(w2)) {
      alt.push(w2);
    }
    // doublement
    let w3 = w.substring(0, j + 1) + w.substring(j, j + 1) + w.substring(j + 1, length);
    if (nspell_fr.correct(w3)) {
      alt.push(w3);
    }
    // transposition
    let w4 = w.substring(0, j) + v[j+1] + v[j] + w.substring(j + 2, length);
    if (nspell_fr.correct(w3)) {
      alt.push(w3);
    }
    // replacement
    for (let a = 0, aLength = fr_alphabet.length; a < aLength; a++) {
      var i_ = j !== length ? i_ = j + 1 : 0;
      var letter = alphabet[a];
      var w5 = w.substring(0, i_) + letter + w.substring(i_ + 1, length);
      if (nspell_fr.correct(w5)) {
        alt.push(w5);
      }
    }
    // Insertion
    for (let a = 0, aLength = fr_alphabet.length; a < aLength; a++) {
			var letter = alphabet[a];
			var w6 = w.substring(0, j) + letter + w.substring(j, length);
      if (nspell_fr.correct(w6)) {
        alt.push(w6);
      }
		}
  }

  //if (alt.length > 0)  console.log(`alt-fr(${w})=>`,alt.join(' '));
  return (alt.length>0) ? alt : null;
}


function en_suggest(w) {
  const v = w.split('');
  const length = v.length;
  const alt = [];

  for (let j=0; j<v.length; j++) {
    // Deletion
    let w2 = w.substring(0, j) + w.substring(j + 1, v.length);
    if (nspell_en.correct(w2)) {
      alt.push(w2);
    }
    // doublement
    let w3 = w.substring(0, j + 1) + w.substring(j, j + 1) + w.substring(j + 1, length);
    if (nspell_en.correct(w3)) {
      alt.push(w3);
    }
    // transposition
    let w4 = w.substring(0, j) + v[j+1] + v[j] + w.substring(j + 2, length);
    if (nspell_en.correct(w3)) {
      alt.push(w3);
    }
    // replacement
    for (let a = 0, aLength = alphabet.length; a < aLength; a++) {
      var i_ = j !== length ? i_ = j + 1 : 0;
      var letter = alphabet[a];
      var w5 = w.substring(0, i_) + letter + w.substring(i_ + 1, length);
      if (nspell_en.correct(w5)) {
        alt.push(w5);
      }
    }
    // Insertion
    for (let a = 0, aLength = alphabet.length; a < aLength; a++) {
			var letter = alphabet[a];
			var w6 = w.substring(0, j) + letter + w.substring(j, length);
      if (nspell_en.correct(w6)) {
        alt.push(w6);
      }
		}
  }

  //if (alt.length > 0)  console.log(`alt-fr(${w})=>`,alt.join(' '));
  return (alt.length>0) ? alt : null;
}


// ---------------------------------------------------------------------------

async function do_directory(fpath) {
  console.log('reloading dico.json ...')
  try {
    dico = jsonfile.readFileSync('./dico.json');
  } catch(e) {
    dico = {};
  }
  console.log('dico reloaded size:',Object.keys(dico).length);

  console.log('Init nspell....');
  nspell_fr = await init_nspell();
  nspell_en = await init_nspell_en();
//  console.log('Init nspell - done:',nspell);
  console.log('Init nspell - done.');
  console.log('Reading directory....');
  const files = ls(fpath,'.json');
  console.log('files.length:',files.length)

  for (let j=0; j<files.length; j++) {
    const json = jsonfile.readFileSync(files[j])
//    console.log(`(${files[j]}) => ${json._text.length}`);
    total_raw_size += json._text.length;
//    console.log(`(${j}) => ${json._text.length} => ${total_raw_size}`);

    if (j%1000 == 0) {
      console.log(`(${j}) dico: ${Object.keys(dico).length}`);
    }


    /*
      For each token/word in each json (page) check the word.
    */

    json._tokens.forEach(it=>{
      if (dico[it]) {
        dico[it].count += 1;
        return;
      }

      dico[it] = {count:1, opCode:'noise'}
      if (it.length <= 3) {
        dico[it].opCode = 'short';
        return;
      }

      if (it.match(/[1-2][0-9]{3}/)) {
        dico[it].opCode = 'year';
        return;
      }

      if (it.match(/[0-9]+[a-zA-Z]*/)) {
//        dico[it].opCode = 'noise';
        return;
      }


      if (nspell_fr.correct(it)) {
        dico[it].opCode = 'fr';
        return;
      }

      if (nspell_en.correct(it)) {
        dico[it].opCode = 'en';
        return;
      }

      /*
        Remove other noise.
      */

      if (noise2(it)) {
//        dico[it].opCode = 'noise';
        return;
      }


      /*
        We should not have any number here.
        Check first if already in suggestions
      */

      /************************
      let su = nspell.suggest(it);
      if (su.length > 0) {
//        console.log(`suggestions-${j} (${it})=>`,su.join(' '))
        dico[it].opCode = 'alt-fr';
        dico[it].alt_fr = su.join(' ');
//        return;
      }

      let se = nspell_en.suggest(it);
      if (se.length > 0) {
//        console.log(`suggestions-${j} (${it})=>`,su.join(' '))
        dico[it].opCode = 'alt-en';
        dico[it].alt_en = se.join(' ');
//        return;
      }
      **************************/

      dico[it].alt_fr = fr_suggest(it)
      if (dico[it].alt_fr) {
  //      console.log(`suggestions-${j} (${it})=>`,dico[it].alt_fr.join(' '))
        dico[it].opCode = 'alt';
      }

      dico[it].alt_en = en_suggest(it)
      if (dico[it].alt_en) {
//        console.log(`suggestions-${j} (${it})=>`,dico[it].alt_en.join(' '))
        dico[it].opCode = 'alt';
      }

    })
  }

  // extra-pass for suggestions:


  console.log(`total: ${total_raw_size}`);
  console.log(`(${files.length}) tokens.length: ${Object.keys(dico).length}`);
  jsonfile.writeFileSync('dico.json',dico, {spaces:2})
}


module.exports = {
  main,
  init_nspell_en,
  init_nspell_fr: init_nspell
}
