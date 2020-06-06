import "reflect-metadata";
import {createConnection} from "typeorm"
import {User} from "./User"

createConnection().then(async connection => {
    console.log('DB Started');

    const users = await connection.manager.find(User);
    console.log("Loaded users: ", users);
}).catch(error => console.log(error));