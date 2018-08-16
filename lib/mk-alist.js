/*

  From dico.json
  filter and make sorted list.

*/


function mk_alist(dico) {
  return Object.keys(dico)
      .map(it => {
        if (it.match(/[0-9]{5,}/)) {
          dico[it].opCode = 'noise'
        } else
        if (it.match(/[0-9]+[a-zA-Z]+/)) {
          dico[it].opCode = 'noise'
        }
        return it;
      })
      .filter(it=> (it.length>3)&&(dico[it].opCode!='noise'))
      .sort()
      .map(it => {
        const x = {key:it, opCode:dico[it].opCode};
        if (dico[it].alt_fr) x.alt_fr = dico[it].alt_fr;
        if (dico[it].alt_en) x.alt_en = dico[it].alt_en;
        return x;
      });
}


module.exports = mk_alist;
