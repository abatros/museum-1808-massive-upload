#! /usr/bin/env node

const rp = require('request-promise');
const Apify = require('apify');

(async ()=>{
  // Prepare a list of URLs to crawl
  const requestList = new Apify.RequestList({
    sources: [
        { url: 'http://www.example.com/page-1' },
        { url: 'http://www.example.com/page-2' },
    ],
  });
  await requestList.initialize();

  // Crawl the URLs
  const crawler = new Apify.BasicCrawler({
      requestList,
      handleRequestFunction: async ({ request }) => {
          // 'request' contains an instance of the Request class
          // Here we simply fetch the HTML of the page and store it to a dataset
          await Apify.pushData({
              url: request.url,
              html: await rp(request.url),
          })
      },
  });

  await crawler.run();

})();
