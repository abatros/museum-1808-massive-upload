/*
  extract main content from medium.com pages.
*/

const fs = require('fs');
const path = require('path');
const encodeUrl = require('encodeurl')
//const http = require('http');
//const XmlParser = require("xmljs");
var request = require('request');
request.defaults({
  timeout:10000
})
const cheerio = require('cheerio');
// ----------------------------------------------------------------------------

function get_mainContent(uri, timeout) {
  console.log(`get_mainContent(${uri})`);
//  return;
  return new Promise((resolve,reject)=>{
    request(encodeUrl(uri), function (err, response, html) {
      if (err) {
        console.log('get_mainContent error:', err); // Print the error if one occurred
        console.log('-- statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('-- Unable to access uri: ',uri)
        reject(err);
        return;
      }

      //
      const $ = cheerio.load(html);
      let ac = $('.postArticle-content section');

//      console.log('ac:', ac.text());
      console.log('ac.length:', ac | ac.length);
      resolve(ac);
  });
})
}

// ----------------------------------------------------------------------------

module.exports = {
  get_mainContent
}
