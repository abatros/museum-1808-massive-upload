#! /usr/bin/env node

const U = require('./lib/ultimheat-com.js');

console.log('U:',U)

U.get_mainContent('http://ultimheat.com')
.then(html=>{
  console.log(html.html())  
})
