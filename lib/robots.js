// get sitemap from robots.txt

const fs = require('fs');
const path = require('path');
const http = require('http');
const XmlParser = require("xmljs");

var request = require('request');
const Sitemapper = require('sitemapper')
const sitemapper = new Sitemapper('https://medium.com/sitemap/sitemap.xml');
sitemapper.timeout = 5000;

/*
  Get an array of pages/url (async).
*/

const get_urlset = async (sitemap_xml)=>{
  console.log(`get_urlset (${sitemap_xml})`)
  return new Promise(
    (resolve,reject)=>{
      request(sitemap_xml, function (error, response, body) {
        if (error) {
          console.log('urlset-error:', error); // Print the error if one occurred
          console.log('-- urlset-statusCode:', response && response.statusCode); // Print the response status code if a response was received
          console.log('-- Unable to access : ',sitemap_xml)
          reject(error);
          return;
        }

        const xmlReader = require('read-xml');

        xmlReader.readXML(Buffer.from(body, 'utf8'), function(err, data) {
          if (err) {
            console.error('Error reading xml',err);
            reject(err)
            return;
          }

          console.log('xml encoding:', data.encoding);
    //      console.log('Decoded xml:', data.content);

          var p = new XmlParser({ strict: true });
          p.parseString(data.content, function(err, urlset) {
              if(err) {
                  console.error(err);
                  reject(err)
                  return;
              }
    //          var nodes = xmlNode.path(["Envelope", "Body", "GetstockpriceResponse", "Price"], true);
    //          console.log(nodes.map(function(n) { return n.text; }));
              // console.log(xmlNode)
              // sitemap url.
              var nodes = urlset.path(["urlset","url","loc"], true);
            //   console.log(nodes.map(function(n) { return n.text; }));
              console.log(`<${sitemap_xml}> nodes.length:`,nodes.length)
              resolve(nodes);
          });
        }); // readXML
      }); // request
    }); // new Promise
//    console.log('body:', body); // Print the HTML for the Google homepage.

} // get_urlset

const getSitemap = function(){
  request('https://medium.com/sitemap/sitemap.xml', function (error, response, body) {
    if (error) {
      console.log('sitemap-error:', error); // Print the error if one occurred
      return;
    }
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//    console.log('body:', body); // Print the HTML for the Google homepage.

    const xmlReader = require('read-xml');

    xmlReader.readXML(Buffer.from(body, 'utf8'), function(err, data) {
      if (err) {
        console.error('Error reading xml',err);
        return;
      }

      console.log('xml encoding:', data.encoding);
//      console.log('Decoded xml:', data.content);

      var p = new XmlParser({ strict: true });
      var xmlNode = p.parseString(data.content, function(err, xmlNode) {
          if(err) {
              console.error(err);
              return;
          }
//          var nodes = xmlNode.path(["Envelope", "Body", "GetstockpriceResponse", "Price"], true);
//          console.log(nodes.map(function(n) { return n.text; }));
          // console.log(xmlNode)
          // sitemap url.
          var nodes = xmlNode.path(["sitemapindex","sitemap","loc"], true);
	      //   console.log(nodes.map(function(n) { return n.text; }));
          console.log('nodes.length:',nodes.length)
          nodes.forEach(async (it)=>{
            const urlset = await get_urlset(it.text);
          })
      });

    });

  });

return;



  request('https://medium.com/robots.txt', function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
    sitemapper.fetch()
      .then(({ url, sites }) => console.log(`url:${url}`, 'sites:', sites))
      .catch(error => console.log(error));
  });

//  console.log('Sitemap.')
}


module.exports = {
  getSitemap,
  get_urlset
}


/************************************

//    var robotsParser = require('robots-parser');
    const Crawler = require("crawler");
    var c = new Crawler({
    rateLimit: 1000, // `maxConnections` will be forced to 1
    callback: function(err, res, done){
        console.log('c.err: ',err);
//        console.log('c.res.body: ',res.body);
        const v = res.body
          .split('\n')
          .filter(it => (it.startsWith('Sitemap:')))
          .map(it => it.replace('Sitemap: ',''));

        console.log('sitemaps:\n',v.join('\n'));
        done();
      }
    });
console.log('Starting crawler...');
    c.queue({
      uri:"https://medium.com/robots.txt"
    });

return;
    var robots = robotsParser('https://medium.com/robots.txt', [
        'User-agent: *',
//        'Disallow: /dir/',
//        'Disallow: /test.html',
//        'Allow: /dir/test.html',
//        'Allow: /test.html',
//        'Crawl-delay: 1',
//        'Sitemap: http://example.com/sitemap.xml',
//        'Host: example.com'
    ].join('\n'));
    console.log('robots:',robots.getSitemaps());

*************************************/
