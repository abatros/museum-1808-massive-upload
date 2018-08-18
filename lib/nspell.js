const nspell = require('nspell');
//const fr_dico = require('dictionary-fr');
//const en_dico = require('dictionary-en-us');
//const de_dico = require('dictionary-de');

function init_nspell(dictionary) {
  if (!dictionary || 'en-us fr de es'.indexOf(dictionary)<0) {
    throw 'dic not found'
    return null;
  }

//  try {
    return new Promise((resolve)=>{
      require('dictionary-'+dictionary)((err,dict)=>{
        if (err) {
          reject(err)
          return;
        }

        const spell = nspell(dict)
        resolve(spell);
      })
    }); // promise
//  } catch (e) {
//    cnsole.log(`Init_nspell(${dictionary}) error: `, e);
//  }
}


module.exports = {
  init_nspell
}
