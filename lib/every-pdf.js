const pdfjsLib = require('pdfjs-dist');
//const every_page = require('./every-page.js').every_page;
//const init_nspell = require('./every-page.js').init_nspell;
const path = require('path');
const jsonfile = require('jsonfile');
const fs = require('fs');

let full_fr_words = new Set();
let full_fr_stems = new Set();

module.exports.write_final_reports = ()=>{
  // Save white lists
  console.log('writing white lists...')
  fs.writeFileSync('white_words',[...full_fr_words].sort().join('\n'),'utf8');
  fs.writeFileSync('white_stems',[...full_fr_stems].sort().join('\n'),'utf8');
  console.log('stop.')
}



async function get_pages(pdfName, options) {
//  console.log(`xpages<${pdfPath}>`)
  argv = argv || {}
  // we might need base folder in options.

  const pdfPath = path.join(argv.dir, pdfName)

  const p1 = pdfjsLib.getDocument(pdfPath);
  argv.verbose
    && console.log('p1:',p1);
  doc = await p1;

  let char_total = 0;
  let words_total = 0;

  const pages = [];

  for (let j=0; j<doc.numPages; j++) {
    let pageInfo = await doc.getPage(j+1);
//    console.warn(j)
//    console.log('pageInfo:',pageInfo)
    let page = await pageInfo.getTextContent()
//    console.log('page:',page)

    page.push({pageno:j, _text:page.text});

/********************************************
    every_page(page, argv);
    char_total += page._length; // accumulate for total
    words_total += page._words_count
//    total_ww += page._white_words
//    console.log('text.length:',page._length);

    full_fr_words = new Set([...full_fr_words, ...page._fr_words]);
//    console.log(`full_fr_words.length:${[...full_fr_words].length}`)
    page._words = page._words.sort().join(' ')
    page._fr_words = page._fr_words.sort().join(' ')

    full_fr_stems = new Set([...full_fr_stems, ...page._fr_stems]);
//    console.log(`full_fr_stems.length:${[...full_fr_stems].length}`)

    console.log(`=> ${[...full_fr_stems].length}/${[...full_fr_words].length}`)

    /*
      write JSON data
    */
    const year = pdfName.match(/^(\d+)/)[1];
    try {
      fs.mkdirSync(path.join(argv.dir+'-tmp',year));
    } catch (err) {
      if (err.code !== 'EEXIST') throw err
    }
    const out = path.join(argv.dir+'-tmp',year,`${pdfName}::${j+1}.json`)
//    jsonfile.writeFileSync(out, page, {spaces:2});
  }

  console.log(`average:${char_total}/${doc.numPages} = ${char_total/doc.numPages}`);
  doc._total_raw = char_total;
  return doc;
}
