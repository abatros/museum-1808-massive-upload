#! /usr/bin/env node

const fs = require('fs');
const gdico = require('./lib/mk-gdico.js')


var nspell_fr;
var nspell_en;

// ---------------------------------------------------------------------------

function check_name(w){
  console.log(`${w}: ${nspell_fr.correct(w.toLowerCase())}`);
}

function checkName(w){
  const v = [...arguments]
    .map(it=>{
      return `${it}:${nspell_fr.correct(it)}`
    })
    .join(' ')

  console.log(v);
}

// ---------------------------------------------------------------------------


gdico.init_nspell_fr()
.then(dico => {
    nspell_fr = dico;
    return gdico.init_nspell_en()
})
.then(dico => {
  nspell_en = dico;
})
.then(()=>{
  console.log('klutz:',nspell_fr.correct('klutz'))
  console.log('branche:',nspell_fr.correct('branche'))
  nspell_fr.personal(['klutz','jarraud'].join('\n'));
  console.log('klutz:',nspell_fr.correct('klutz'))
  nspell_fr.personal(['jumeau','dupont'].join('\n'));
  console.log('klutz:',nspell_fr.correct('klutz'))
  nspell_fr.personal(['jumeau','*dupont'].join('\n'));
  console.log('klutz:',nspell_fr.correct('klutz'))
  console.log('jumeau:',nspell_fr.correct('jumeau'))
  console.log('dupont:',nspell_fr.correct('dupont'))

  check_name('LOPEZ')
  check_name('Lopez')
  const lnames = fs.readFileSync('./tree/last-names.txt','utf8');
  nspell_fr.personal(lnames.toLowerCase());
  checkName('klutz','lopez','jumeau','jumeaux','ARMSTRONG','Durand')
  checkName('jumeauxi')
  console.log(nspell_fr.suggest('ARMSTRON'));
  console.log(nspell_fr.suggest('jumeauxi'));

})
