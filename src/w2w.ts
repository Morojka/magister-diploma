'use strict';
class W2w {
    w2v = require('word2vec');

    run = () => {
        console.log(process.cwd() + '/texts/vectors.txt');

        this.w2v.word2phrase( process.cwd() + '/fixtures/input.txt', process.cwd() + '/fixtures/phrases.txt', {
            threshold: 5,
            debug: 2,
            minCount: 2
        });

        // this.w2v.word2vec(process.cwd() + '/texts/phrases.txt', process.cwd() + '/texts/vectors.txt', {
        //     cbow: 1,
        //     size: 200,
        //     window: 8,
        //     negative: 25,
        //     hs: 0,
        //     sample: 1e-4,
        //     threads: 20,
        //     iter: 15,
        //     minCount: 2
        // })

        // this.w2v.loadModel('../texts/vectors.txt', function (err, model) {
        //     console.log(model);
        //
        //     var wordVecs = model.getVectors(['Hamlet', 'daughter']);
        //     console.log(model.getNearestWord(wordVecs[0].values, 1));
        //
        //     var similar = model.mostSimilar('dead', 20);
        //     console.log(similar);
        //
        //     var analogy = model.analogy('mother', ['Hamlet', 'father'], 10);
        //     console.log(analogy);
        //
        //     var similarity = model.similarity('father', 'mother');
        //     console.log(similarity);
        // })
    }
}

export default W2w;