#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
// const pdf = require('./every-pdf.js');
const ls_files = require('./lib/ls-files.js')
const medium = require('./lib/medium.com.js')
// ----------------------------------------------------------------------------

console.log('This is (Admin.js) - A tool for Museum Administration.')

// ----------------------------------------------------------------------------

// failed url

const url_failed = [];

// ----------------------------------------------------------------------------

const argv = require('yargs')
  .alias('f','file')
  .alias('d','dir')
  .alias('a','all')
  .command('ls-files', ':list all files in Index.',
    () => {
      console.log('ls-files BUILDER');
    },
    async (argv) => {
      console.log('ls-files:',argv);
      const files = await ls_files();
      console.log('ls-files:',files);
      console.log('-stopped-');
      process.exit(0);
  })
// ----------------------------------------------------------------------------
// mrxm5446

.command('robots', ':Infos on robots.txt.',
  () => {
    console.log('ls-files BUILDER');
  },
  async (argv) => {
    /*****************
    const dom = await require('./lib/medium.com.js').get_mainContent('https://medium.com/@nilegirl/when-i-visualize-slavery-this-is-literally-what-it-looks-like-2d2c77db3a32');
    try {
      console.log('dom.text:',dom.text())
    }
    catch(err) {
      console.log('err:',err)
      console.log(dom)
    }
return;
    *******************/

    const robot = require('./lib/robots.js');
    var urlset = await robot.get_urlset('https://medium.com/sitemap/posts/2017/posts-2017-08-05.xml')
    console.log('urlset.length:',urlset.length);
    for (let j=0; j<urlset.length; j++) {
      const url = urlset[j].text;
      try {
        const data = await medium.get_mainContent(url,10000);
        console.log('data:',data.html())
      }
      catch(e) {
        console.log(`unable to access <${url}> exception.errno:`,e.errno)
        url_failed.push(url);
      }

    }
//    urlset.forEach(async (uri)=>{
//    })
    console.log('URL-FAILED:',url_failed)
return;
    //console.log('urlset:',urlset);
    urlset = await robot.get_urlset('https://medium.com/sitemap/publications/2016/publications-2016-09-21.xml');
    console.log('urlset.length:',urlset.length);
    return;
    const v = await robot.getSitemap('https://medium.com/robots.txt')
    console.log('v:',v);
    console.log('-stopped-');
//    process.exit(0);
})

// ----------------------------------------------------------------------------
  .demandCommand()
  .argv;


/*
main1 => to list all pdf files.    ls-file or ls-pages
*/

// ----------------------------------------------------------------------------
