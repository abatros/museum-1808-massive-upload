var pdfjsLib = require('pdfjs-dist');

/*

  pdfpath : filename
  returns: an array of pdf-page (json)

*/


async function get_pages(filepath, options) {
  if (options && options.verbose)
    console.log(`pdf-lib::get_pages filepath:${filepath}`);
  const pages = [];
  let total = 0;
  const doc = await pdfjsLib.getDocument(filepath);
  for (let j=0; j<doc.numPages; j++) {
    const page = await doc.getPage(j+1);
//    console.warn(j)
//    console.log('page:',page)
    const page_Content = await page.getTextContent()
//    console.log('page_Content.length:',page_Content.items.length)
    /*
    page_Content.items.forEach(it => {
      console.log(it.transform);
    })
    */
    const text = page_Content.items
      .map(it => it.str).join(' ')
      .replace(/\s+/g,' ')
      .replace(/\.\.+/g,'.');

    pages.push({raw_text:text})

//    options.fn.bind(this,page,text)();
    total += page._length;
//    console.log('text.length:',page._length);
  }

//  console.log(`average:${total}/${doc.numPages} = ${total/doc.numPages}`);
  return pages;
}

async function every_pdf (pdfPath, options) {
//  console.log(`xpages<${pdfPath}>`)
  options = options || {}
  options.fn = options.fn || function(text){
    console.log('\npageIndex:',page.pageIndex)
    console.log('=> text:',text);
  }

  const pages = [];

  const p1 = pdfjsLib.getDocument(pdfPath);
  options.verbose
    && console.log('p1:',p1);
  doc = await p1;
//  console.log('Number of Pages: ' + doc.numPages);

/*
  console.log('doc:',doc)
  const p2 = doc.getMetadata();
  console.log('p2:',p2)
  try {
    const data = await p2;
    console.log('metadata:',data)
  }
  catch (e) {
    console.log('dkz-error:',e)
  }
*/
//  console.log(JSON.stringify(data.info, null, 2));

  let total = 0;
  for (let j=0; j<doc.numPages; j++) {
    page = await doc.getPage(j+1);
//    console.warn(j)
//    console.log('page:',page)
    page_Content = await page.getTextContent()
//    console.log('page_Content.length:',page_Content.items.length)
    /*
    page_Content.items.forEach(it => {
      console.log(it.transform);
    })
    */
    const text = page_Content.items
      .map(it => it.str).join(' ')
      .replace(/\s+/g,' ')
      .replace(/\.\.+/g,'.');

    options.fn.bind(this,page,text)();
    total += page._length;
//    console.log('text.length:',page._length);
  }

  console.log(`average:${total}/${doc.numPages} = ${total/doc.numPages}`);
}


module.exports = {
  get_pages
}
