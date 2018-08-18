#! /usr/bin/env node

/*
  Construction d'un Thesaurus
*/

const fs = require('fs');
const ls = require('./lib/ls-recurse.js');
const jsonfile = require('jsonfile')
//const spell = require('./lib/mk-gdico.js');
const spell = require('./lib/nspell.js');

const files = ls('/media/dkz/Seagate/18.08-museum-all-pdf-4407-tmp','.json')
console.log('count:',files.length);


const th = {};

  for (let j=0; j<files.length; j++) {
    if (j%1000 == 0) console.log(`${j} ${files[j]}`)
    const page = jsonfile.readFileSync(files[j]);
    const fn = files[j];
    page._tokens.forEach(token => {
//      (Number(token) != NaN) || token.match(/[0-9]/) || return;
      if ((token.length <2) || token.match(/[0-9]/)) return;
      token = token.toLowerCase();
      if (token.match(/[aeiou]{4,}/)) return;
      if (token.match(/[bcdfghjklmnpqrstvwxyz]{4}/)) return;
      // 'uu','ii','jj','kk','qq','hh','vv','ww','xx','yy','zz'
      th[token] = (th[token] || 0) + 1;
    })
}

var spell_fr, spell_en, spell_de;

const p1 = spell.init_nspell('fr')
const p2 = spell.init_nspell('en-us')
const p3 = spell.init_nspell('de')

Promise.all([p1,p2,p3])
.then((v)=>{
  spell_fr = v[0];
  spell_en = v[1];
  spell_de = v[2];
//  spell_fr.correct('hello');
  spell_fr.correct('hello');
  spell_en.correct('hello');
//  spell_de.correct('hello');

  const map = Object.entries(th)
        .sort((a,b)=>(b[1]-a[1]))
        .map(it=>{
          console.log('--it:',it)
          it.push(spell_fr.correct(it[0])? ':FR':'')
          it.push(spell_en.correct(it[0])? ':EN':'')
          it.push(spell_de.correct(it[0])? ':DE':'')
          return it;
        })
        .map(it=>`${it[0]} :${it[1]}${it[2]||''}${it[3]||''}${it[4]||''}`);

  console.log('map.length:',map.length)
  jsonfile.writeFileSync('_112-thesaurus.json',map,{spaces:2})
  fs.writeFileSync('_112-thesaurus.txt', map.join('\n'),'utf8')
  console.log('done.');

})

/*
.then(it=>{
  spell_fr = it;
  return spell.init_nspell('en')
})
.then(it=>{
  spell_en = it;
  return spell.init_nspell('de')
})
.then(it=>{
  spell_de = it;

})
*/
