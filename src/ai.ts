const fs = require('fs');
const brain = require('brain.js')

const net = new brain.NeuralNetwork({
    hiddenLayers: [1],
});

var mimir = require('./bow'),
    bow = mimir.bow,
    dict = mimir.dict;


const modelPath = process.cwd() + '/models/model.json'

const texts = [
    'Дай мне на расписание расписания выдай распис расп р покажи распорядок моё мое сегодня пара пару пары',
    'баллы баллов балл б оценку оценки оценок рейтинг',
]

const voc = dict(texts);

let data = [
    {input: bow('расписание', voc), output: [0, 1]},
    {input: bow('расписания', voc), output: [0, 1]},
    {input: bow('расп', voc), output: [0, 1]},
    {input: bow('распис', voc), output: [0, 1]},
    {input: bow('р', voc), output: [0, 1]},
    {input: bow('распорядок', voc), output: [0, 1]},
    {input: bow('пары', voc), output: [0, 1]},
    {input: bow('пара', voc), output: [0, 1]},
    {input: bow('пару', voc), output: [0, 1]},

    {input: bow('дай расписание', voc), output: [0, 1]},
    {input: bow('дай распорядок', voc), output: [0, 1]},
    {input: bow('дай пары', voc), output: [0, 1]},

    {input: bow('дай мне расписание', voc), output: [0, 1]},
    {input: bow('дай мне распорядок', voc), output: [0, 1]},
    {input: bow('дай мне пары', voc), output: [0, 1]},

    {input: bow('расписание на сегодня', voc), output: [0, 1]},
    {input: bow('распорядок на сегодня', voc), output: [0, 1]},
    {input: bow('пары на сегодня', voc), output: [0, 1]},

    {input: bow('дай мне расписание на сегодня', voc), output: [0, 1]},
    {input: bow('дай мне распорядок на сегодня', voc), output: [0, 1]},
    {input: bow('дай мне пары на сегодня', voc), output: [0, 1]},

    {input: bow('покажи мне расписание на сегодня', voc), output: [0, 1]},
    {input: bow('покажи мне распорядок на сегодня', voc), output: [0, 1]},
    {input: bow('покажи мне пары на сегодня', voc), output: [0, 1]},

    {input: bow('выдай мне расписание на сегодня', voc), output: [0, 1]},
    {input: bow('выдай мне распорядок на сегодня', voc), output: [0, 1]},
    {input: bow('выдай мне пары на сегодня', voc), output: [0, 1]},

    {input: bow('баллы', voc), output: [1, 0]},
    {input: bow('баллов', voc), output: [1, 0]},
    {input: bow('балл', voc), output: [1, 0]},
    {input: bow('б', voc), output: [1, 0]},
    {input: bow('оценку', voc), output: [1, 0]},
    {input: bow('оценки', voc), output: [1, 0]},
    {input: bow('оценок', voc), output: [1, 0]},
    {input: bow('рейтинг', voc), output: [1, 0]},

    {input: bow('дай баллы', voc), output: [1, 0]},
    {input: bow('дай баллов', voc), output: [1, 0]},
    {input: bow('дай балл', voc), output: [1, 0]},
    {input: bow('дай б', voc), output: [1, 0]},
    {input: bow('дай оценку', voc), output: [1, 0]},
    {input: bow('дай оценки', voc), output: [1, 0]},
    {input: bow('дай оценок', voc), output: [1, 0]},
    {input: bow('дай рейтинг', voc), output: [1, 0]},

    {input: bow('дай мне баллы', voc), output: [1, 0]},
    {input: bow('дай мне баллов', voc), output: [1, 0]},
    {input: bow('дай мне балл', voc), output: [1, 0]},
    {input: bow('дай мне б', voc), output: [1, 0]},
    {input: bow('дай мне оценку', voc), output: [1, 0]},
    {input: bow('дай мне оценки', voc), output: [1, 0]},
    {input: bow('дай мне оценок', voc), output: [1, 0]},
    {input: bow('дай мне рейтинг', voc), output: [1, 0]},

    {input: bow('покажи баллы', voc), output: [1, 0]},
    {input: bow('покажи баллов', voc), output: [1, 0]},
    {input: bow('покажи балл', voc), output: [1, 0]},
    {input: bow('покажи б', voc), output: [1, 0]},
    {input: bow('покажи оценку', voc), output: [1, 0]},
    {input: bow('покажи оценки', voc), output: [1, 0]},
    {input: bow('покажи оценок', voc), output: [1, 0]},
    {input: bow('покажи рейтинг', voc), output: [1, 0]},

    {input: bow('покажи мне баллы', voc), output: [1, 0]},
    {input: bow('покажи мне баллов', voc), output: [1, 0]},
    {input: bow('покажи мне балл', voc), output: [1, 0]},
    {input: bow('покажи мне б', voc), output: [1, 0]},
    {input: bow('покажи мне оценку', voc), output: [1, 0]},
    {input: bow('покажи мне оценки', voc), output: [1, 0]},
    {input: bow('покажи мне оценок', voc), output: [1, 0]},
    {input: bow('покажи мне рейтинг', voc), output: [1, 0]},

    {input: bow('выдай баллы', voc), output: [1, 0]},
    {input: bow('выдай баллов', voc), output: [1, 0]},
    {input: bow('выдай балл', voc), output: [1, 0]},
    {input: bow('выдай б', voc), output: [1, 0]},
    {input: bow('выдай оценку', voc), output: [1, 0]},
    {input: bow('выдай оценки', voc), output: [1, 0]},
    {input: bow('выдай оценок', voc), output: [1, 0]},
    {input: bow('выдай рейтинг', voc), output: [1, 0]},

    {input: bow('выдай мне баллы', voc), output: [1, 0]},
    {input: bow('выдай мне баллов', voc), output: [1, 0]},
    {input: bow('выдай мне балл', voc), output: [1, 0]},
    {input: bow('выдай мне б', voc), output: [1, 0]},
    {input: bow('выдай мне оценку', voc), output: [1, 0]},
    {input: bow('выдай мне оценки', voc), output: [1, 0]},
    {input: bow('выдай мне оценок', voc), output: [1, 0]},
    {input: bow('выдай мне рейтинг', voc), output: [1, 0]},
];


const netOptions = {};

const trainingOptions = {
    iterations: 60,
    log: (details) => console.log(details),
};

// const crossValidate = new brain.CrossValidate(brain.NeuralNetwork, netOptions);
// const stats = net.train(data);
// console.log(stats);
// const net = crossValidate.toNeuralNetwork();

net.train(data, trainingOptions);

// if (fs.existsSync(modelPath)) {
//     const model = fs.readFileSync(modelPath)
//     net.fromJSON(JSON.parse(model))
// } else {
//     net.train(data, config);
//
//     const model = net.toJSON()
//     fs.writeFileSync(modelPath, JSON.stringify(model))
// }

export default net;