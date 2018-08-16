/*

  From dico.json
  filter and make sorted list.

*/


function mk_zlist(dico) {
  return Object.keys(dico)
      .filter(it=> (dico[it].opCode == 'noise'))
      .sort()
}


module.exports = mk_zlist;
