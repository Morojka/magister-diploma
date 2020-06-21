import net from "./ai";

const fs = require('fs');
const axios = require('axios').default;
import {createConnection, getRepository} from "typeorm"
import {Group} from "./entity/Group"

class Scratcher {
    https = require('https');
    cheerio = require('cheerio')

    institutes = [
        // {
        //     'name': 'ИМИТ',
        //     'groups': []
        // },
        {
            'name': 'ИЕН',
            'groups': []
        },
        // {
        //     'name': 'ИПТ',
        //     'groups': []
        // },
        // {
        //     'name': 'ИМЭИФ',
        //     'groups': []
        // },
        // {
        //     'name': 'ИУРЭ',
        //     'groups': []
        // },
        // {
        //     'name': 'ИИМОСТ',
        //     'groups': []
        // },
        // {
        //     'name': 'ИП',
        //     'groups': []
        // },
        // {
        //     'name': 'ИФиМКК',
        //     'groups': []
        // },
        // {
        //     'name': 'СПО',
        //     'groups': []
        // },
    ]

    saveInstituteGroups = () => {
        this.institutes.map((institute) => {
            axios.get(`https://volsu.ru/rating/test.php`, {
                params: {
                    id: institute.name,
                    l: 2
                }
            }).then((response) => {
                const $ = this.cheerio.load(response.data)

                $('option').each((index, element) => {
                    let napravlenie = element.attribs.value

                    if (napravlenie) {
                        axios.get(`https://volsu.ru/rating/test.php?id=${napravlenie}`, {
                            params: {
                                institut: institute.name,
                                l: 3,
                            }
                        }).then((res) => {
                            const $ = this.cheerio.load(res.data)
                            let groups = []

                            $('option').each((index, element) => {
                                let groupCode = element.attribs.value

                                if (groupCode) {
                                    groups.push(groupCode)
                                }
                            });

                            let writeData = []
                            if (fs.existsSync(process.cwd() + `/texts/${institute.name}.json`)) {
                                writeData = JSON.parse(fs.readFileSync(process.cwd() + `/texts/${institute.name}.json`))
                            }

                            writeData.push(groups)
                            fs.writeFileSync(process.cwd() + `/texts/${institute.name}.json`, JSON.stringify(writeData))
                        })
                    }
                });
            })
        })
    }

    saveGroupsInDb = () => {
        createConnection().then((conn) => {
            let napravs = []
            let createGroups = []

            if (fs.existsSync(process.cwd() + `/texts/${this.institutes[0].name}.json`)) {
                napravs = JSON.parse(fs.readFileSync(process.cwd() + `/texts/${this.institutes[0].name}.json`))
            }

            napravs.map((groups) => {
                createGroups = groups.map((group) => {
                    // let findGroup = await conn.manager.findOne(Group, {where: {name: group.split('volsu')[0]}})
                    // if(!findGroup) {
                        let newGroup = new Group()

                        newGroup.semester = 1
                        newGroup.code = group.split('volsu')[1]
                        newGroup.name = group.split('volsu')[0]

                    return newGroup
                    // }
                })
                console.log(createGroups);
                conn.manager.save(Group, createGroups)
            })

        })

    }
}

export default Scratcher;