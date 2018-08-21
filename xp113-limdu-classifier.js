#! /usr/bin/env node

/*
    LIMDU

    Machine Learning Framework for Node.js
*/

const fs = require('fs');
const jsonfile = require('jsonfile');
const ls = require('./lib/ls-recurse.js');
//const nspell = require('./lib/nspell.js')
const assert = require('assert');
var LanguageDetect = require('languagedetect');
var lngDetector = new LanguageDetect();

// ---------------------------------------------------------------------------

const argv = require('yargs')
//  .alias('f','file')      // source file
//  .alias('o','output')    // destination
//  .alias('n','no-match')  // write non-matching words
  .argv;

  const getRandomInt = (max) => {
      return Math.floor(Math.random() * Math.floor(max));
    }


function main2() {
  const files = ls('/media/dkz/Seagate/museum-data','.json')
  for (let i=0; i< files.length; i++) {
    const pdf1 = jsonfile.readFileSync(files[i]);

    const vl = lngDetector.detect(pdf1._text,2)[0] || [['undefined',0]]

    // check this document using ratio 'un' / nbre token => FRENCH
    pdf1._tokens = pdf1._tokens || []
    const n1 = pdf1._tokens
        .reduce((a,v)=>{
//          return (a + (v == 'un')?1:0);
          if (v == 'un') return a+1;
          return a;
        },0)
//    console.log('n1:',n1)
    // report:
    if (i%1000 == 0)
    console.log(`(${vl[0] || 'xxxx'})(${Math.floor(1000*n1/pdf1._tokens.length)}) ${files[i]}`)
  } // each file.

  // report min/max for 'un'
  console.log(`min:${min_un} max:${max_un}`)

}


// --------------------------------------------------------------------------

const limdu = require('limdu');

// First, define our base classifier type (a multi-label classifier based on winnow):
var TextClassifier = limdu.classifiers.multilabel.BinaryRelevance.bind(0, {
	binaryClassifierType: limdu.classifiers.Winnow.bind(0, {retrain_count: 30})
});

// Now define our feature extractor - a function that takes a sample and adds features to a given features set:
var WordExtractor = function(input, features) {
	input.split(" ").forEach(function(word) {
		features[word]=1;
	});
};

// Initialize a classifier with the base classifier type and the feature extractor:
var intentClassifier = new limdu.classifiers.EnhancedClassifier({
	classifierType: TextClassifier,
	featureExtractor: WordExtractor
});

// Train and test:
intentClassifier.trainBatch([
  {input: `C’est l’histoire d’une institutrice de dernière année de maternelle, au milieu de janvier, le mois le plus dur pour tout le monde… Un des gamins lui demande de l’aide pour mettre ses bottes pour aller en récréation et, en effet, elles sont vraiment difficiles à enfiler. Après avoir poussé, tiré,
     re-poussé et tiré dans tous`, output: "fr"},
	{input: "hello Dolly how are you", output: "en"},
	{input: "ceci est du texte pour voir bien des choses", output: "fr"},
	{input: `AI Scientist will innovate product solutions,
    including python-based machine learning and client/server data frameworks
    to interpret images and text data for the creation of web-enabled applications.
    Scientific and engineering works that you produce will generate further evidence
    that superior results are achieved by machine learning neural networks.
    He/she will represent Galaxy on a global scale and will
    have the opportunity to pioneer AI in the insurance industry.`, output:    "en"},
	]);

console.dir(intentClassifier.classify("il était toujours premier"));  // ['apl','bnn']
console.dir(intentClassifier.classify("dolly"));  // []


/*
const langClassifier = new limdu.classifiers.NeuralNetwork();
console.log('training....')
langClassifier.trainBatch([
  {input:'hello Dolly how are you?', output:'english'},
  {input:'ceci est du texte pour voir bien des choses', output:'french'},
  {input:'hello Dolly how are you?', output:'english'},
  {input:`AI Scientist will innovate product solutions,
    including python-based machine learning and client/server data frameworks
    to interpret images and text data for the creation of web-enabled applications.
    Scientific and engineering works that you produce will generate further evidence
    that superior results are achieved by machine learning neural networks.
    He/she will represent Galaxy on a global scale and will
    have the opportunity to pioneer AI in the insurance industry.`, output:'english'},
]);

console.log('action')
const lr = lanClassifier.classify('When an insured end-user has an accident they click image');
console.log('lang:',lr)
// --------------------------------------------------------------------------
******/
