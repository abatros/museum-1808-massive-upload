#! /usr/bin/env node

const Crawler = require("crawler");

const pages = new Map(); // each item key is a url.
// value {q:0|1|2} : inserted, processing, terminated.
// check when a page has no new links.
// if last page has no new links the process terminates.
// for each link we need to remember the current page.

const c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            console.log($("title").text());
            links = $('a'); //jquery get all hyperlinks
            $(links).each(function(i, link){
//              console.log($(link).text() + ':\n  ' + $(link).attr('href'));
              console.log($(link).attr('href'));
              const _link = $(link).attr('href')
              if (!pages.has(_link)) {
                pages.set(_link,0);
//                console.log('pages:',[...pages.keys()].join(' '))
                c.queue(_link);
              }
            });
        }
        done();
    }
});

pages.set('http://ultimheat.com',0)
c.queue('http://ultimheat.com');

console.log('pages:',[...pages.keys()].join(' '))
