const axios = require('axios');
const {makeNestedObjWithArrayItemsAsKeys, deepFind, sleep, fieldParse, getTarget, addData} = require('./unity');
const cheerio = require('cheerio');

class Request {
    constructor(campaign, crawler, flag, io) {
        this.memories = {};
        this.campaign = campaign
        this.crawler = crawler
        this.flag = flag
        this.io = io
    }

    async start(jobs, traveler) {
        if (typeof traveler === 'undefined' || traveler === null) {
            this.traveler = {}
        }
        for (let i = 0; i < jobs.length; i++) {
            await this.starting(jobs[i])
        }
    }

    async starting(job) {
        if (job.loop) {
            await this.handleLoop(job)
        } else if (job.action) {
            await this.handleAction(job)
        }
    }

    async handleLoop(job) {
        switch (job.loop) {
            case 'ARRAY':
                let urls = job['urls'];
                for (let i = 0; i < urls.length; i++) {
                    job['url'] = urls[i]
                    await this.handleAction(job)
                }
                break
            case 'PAGING':
                let maxPage = job['options']['max'] || 0
                let page = 0
                let starting = true
                this.memories['paging_path'] = job['options']['target']
                while (starting || page < maxPage) {
                    if (!starting) {
                        let target = getTarget(this.traveler[job.key]['data'], this.memories['kind'], {
                            path: this.memories['paging_path'],
                            position: 'href'
                        })
                        if (target && target.length) {
                            job['url'] = target[0]
                        } else {
                            break
                        }
                    }
                    starting = false
                    await this.handleAction(job)
                    page++
                    await sleep(30000)
                }
                break
        }
    }

    async handleAction(job) {
        switch (job.action) {
            case 'GOTO':
                let expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
                if (!job['url'].match(expression)) {
                    job['urlAbs'] = job['url']
                }
                if (job['urlAbs']) {
                    job['url'] = deepFind(this.data, job['urlAbs'])
                }
                this.traveler[job.key] = await axios.get(job['url'], {
                    params: job['options']['params']
                })

                if (job['urlAbs']) {
                    job['url'] = job['urlAbs']
                }
                break
            case 'EXTRACT':
                await this.extract(job, this.traveler[job['options']['key']]['data'])
                break
            default:
                break
        }
        if (job['children'] && job['children'].length) {
            await this.start(job['children'], this.traveler)
        }
    }

    async extract(job, instance) {
        let elms = getTarget(instance, job['options']['kind'], {
            path: job['options']['target'],
            position: null
        }).map(x => cheerio.load(x))
        for (let i = 0; i < elms.length; i++) {
            let saveFields = job.options.field ? job.options.field.split('.') : []
            let traveler = {}
            for (let field of job.fields) {
                if (field.path === '' || field.path === null) {
                    traveler[field.field] = elms[i].text();
                } else {
                    let arrTemp = fieldParse(field, elms[i], field.kind)
                    traveler[field.field] = arrTemp.length === 1 ? arrTemp[0] : arrTemp;
                    if (!Array.isArray(traveler[field.field]) && field.append) {
                        if (field['trim']) {
                            traveler[field.field] = traveler[field.field].trim()
                        }
                        traveler[field.field] = field.append + traveler[field.field]
                    }
                    if (!Array.isArray(traveler[field.field]) && field.field === 'url') {
                        traveler[field.field] = traveler[field.field].split("?")[0]
                    }
                }
            }
            this.data = {
                ...this.data,
                ...makeNestedObjWithArrayItemsAsKeys(saveFields, traveler)
            }
            if (job['children'] && job['children'].length) {
                await this.start(job['children'], this.traveler)
            } else {
                if (!this.flag) {
                    await addData(this.campaign, this.crawler, this.data)
                } else {
                    if (this.io) {
                        this.io.emit('data', this.data)
                    }
                }
            }
        }
    }
}

module.exports = {
    Request
}
