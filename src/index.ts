import app from './app';
import net from "./ai";

import Scratcher from './scratcher';

// let scr = new Scratcher();

// scr.saveInstituteGroups();

// scr.saveGroupsInDb();

app.listen(process.env.PORT, function () {
    console.log(`Example app listening on port ${process.env.PORT}!`);

    var output = net.run('баллы');
    console.log(output);
});