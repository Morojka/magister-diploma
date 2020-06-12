var brain = require('brain.js')
const fs = require('fs');
const net = new brain.recurrent.LSTM();

let data = [
    {input: 'Дай мне расписание', output: 'расписание'},
    {input: 'Расписание дай мне', output: 'расписание'},
    {input: 'покажи расписание', output: 'расписание'},
    {input: 'Расписание', output: 'расписание'},
    {input: 'Расписание на сегодня', output: 'расписание'},
    {input: 'распис', output: 'расписание'},
    {input: 'Дай мне баллы', output: 'баллы'},
    {input: 'Баллы дай мне', output: 'баллы'},
    {input: 'покажи Баллы', output: 'баллы'},
    {input: 'Баллы', output: 'баллы'},
    {input: 'баллы', output: 'баллы'},
];

if (fs.existsSync(process.cwd() + '/models/model.json')) {
    const model = fs.readFileSync(process.cwd() + '/models/model.json')
    net.fromJSON(JSON.parse(model))
} else {
    net.train(data, {
        iterations: 1000,
    });

    const model = net.toJSON()
    fs.writeFileSync(process.cwd() + '/models/model.json', JSON.stringify(model))
}

export default net;