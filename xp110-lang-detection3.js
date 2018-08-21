#! /usr/bin/env node

/*
    Language auto detection

    [fr,en,de]
    start with fr
    get random token anc check against current thesaurus, until 3 matches
    if fails switch to next lang.
    limit to 100 tries.

*/

const fs = require('fs');
const jsonfile = require('jsonfile');
const ls = require('./lib/ls-recurse.js');
const nspell = require('./lib/nspell.js')
const assert = require('assert');
var LanguageDetect = require('languagedetect');
var lngDetector = new LanguageDetect();

// ---------------------------------------------------------------------------
var spell_fr, spell_en, spell_de, spell_es;

const p1 = nspell.init_nspell('fr')
const p2 = nspell.init_nspell('en-us')
const p3 = nspell.init_nspell('de')
const p4 = nspell.init_nspell('es')

const NL = 4;
// ---------------------------------------------------------------------------

const argv = require('yargs')
//  .alias('f','file')      // source file
//  .alias('o','output')    // destination
//  .alias('n','no-match')  // write non-matching words
  .argv;

  const getRandomInt = (max) => {
      return Math.floor(Math.random() * Math.floor(max));
    }


function main2() {
  const files = ls('/media/dkz/Seagate/museum-data','.json')
  // establish min ratio(un) for FRENCH
  let min_un=999999, max_un=0;

  for (let i=0; i< files.length; i++) {
    const pdf1 = jsonfile.readFileSync(files[i]);

    const vl = lngDetector.detect(pdf1._text,2)[0] || [['undefined',0]]

    // check this document using ratio 'un' / nbre token => FRENCH
    pdf1._tokens = pdf1._tokens || []
    const n1 = pdf1._tokens
        .reduce((a,v)=>{
//          return (a + (v == 'un')?1:0);
          if (v == 'un') return a+1;
          return a;
        },0)
//    console.log('n1:',n1)
    if (vl[0] == 'french')
      {
      min_un = Math.min(n1,min_un)
      max_un = Math.min(n1,max_un)
      }

    // report:
    if (i%1000 == 0)
    console.log(`(${vl[0] || 'xxxx'})(${Math.floor(1000*n1/pdf1._tokens.length)}) ${files[i]}`)
  } // each file.

  // report min/max for 'un'
  console.log(`min:${min_un} max:${max_un}`)

}


// --------------------------------------------------------------------------

function main(spell) {
  const files = ls('/media/dkz/Seagate/museum-data','.json')


  for (let i=0; i< files.length; i++) {
    const pdf1 = jsonfile.readFileSync(files[i]);
//    console.log(files[i]);
    let ilang = 0; // fr
    let hits = 0;

    for (let j=0; j<100; j++) {
      const iw = getRandomInt(pdf1._tokens.length);
      word = pdf1._tokens[iw];
      if (!word || word.length < 2) continue; // break if !word...
      if (Number(word) == NaN) continue;
      if (word.match(/[0-9]/)) continue;
      assert(spell[ilang],`Missing dict ${['FR','EN','DE','ES'][ilang]}`)
      if (spell[ilang].correct(word)) hits++;
      else {
        // next LANGUAGE
//        console.log(`FAIL:(${word}) lang:${ilang} hits:${hits} (${files[i]})`);
        ilang = (ilang+1)%NL; hits=0;
        assert(ilang<NL)
        continue;
      }
//      console.log(`HIT:(${word}) lang:${ilang} hits:${hits} (${files[i]})`);
      if (hits > 10) {
        break; // succes
      }
      //
    } // success or max try reached.

    const hlang = (hits<4) ? 'XX': ['FR','EN','DE','ES'][ilang];
    // if UNDECIDED = analyse the title.
    console.log(`lang:${hlang} hits:${hits} tokens:${pdf1._tokens.length} (${files[i]})`);
  } // each file.
}

// --------------------------------------------------------------------------

main2();

return;
Promise.all([p1,p2,p3,p4])
.then((v)=>{
  main(v)
});
