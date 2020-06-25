import app from './app';
import net from "./ai";

// import Scratcher from './scratcher';
// let scr = new Scratcher();
// scr.saveInstituteGroups();
// scr.saveGroupsInDb();

var mimir = require('./bow'),
    bow = mimir.bow,
    dict = mimir.dict;

const texts = [
        'Дай мне на расписание выдай распис расп покажи распорядок моё мое сегодня пары',
        'баллы баллов балл б оценку оценки оценок рейтинг',
    ],
    voc = dict(texts);

app.listen(process.env.PORT, function () {
    // console.log(`Example app listening on port ${process.env.PORT}!`);
    //
    const output = net.run(bow('распиши оценки семестра', voc));
    const answer = output.indexOf(Math.max(...output))
    let dict = {
        0: 'баллы',
        1: 'расписание',
    }
    console.log(dict[answer]);



});