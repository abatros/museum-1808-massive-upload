#! /usr/bin/env node
const jsonfile = require('jsonfile')

const dico = jsonfile.readFileSync('dico.json')
const alist = require('./lib/mk-alist.js')(dico);
const zlist = require('./lib/mk-zlist.js')(dico);

console.log('writing alist.json ...');
jsonfile.writeFileSync('alist.json',alist, {spaces:2})
console.log('writing zlist.json ...');
jsonfile.writeFileSync('zlist.json',zlist, {spaces:2})
console.log('done');
