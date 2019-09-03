const axios = require('axios');
const {makeNestedObjWithArrayItemsAsKeys, deepFind, addData} = require('./unity');

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function sleep() {
    await timeout(3000);
}

class Api {
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
                let urls = job.urls;
                for (let i = 0; i < urls.length; i++) {
                    job['url'] = urls[i]
                    await this.handleAction(job)
                }
                break
            case 'PAGING':
                let page = 0
                let start = true
                this.memories['paging_query'] = job['options']['target']
                this.memories['paging_path'] = job['options']['value']
                while (start || (this.memories['paging_token'] && page < job['options']['max'])) {
                    await this.handleAction(job)
                    start = false
                    page++
                    await sleep(30000)
                }
                break
        }
    }

    async handleAction(job) {
        switch (job.action) {
            case 'GOTO':
                if (this.memories['paging_token']) {
                    job['options']['params'][this.memories['paging_query']] = this.memories['paging_token']
                } else {
                    delete job['options']['params'][this.memories['paging_query']]
                }
                this.traveler.res = await axios.get(job['url'], {
                    params: job['options']['params']
                })
                break
            case 'EXTRACT':
                let results = deepFind(this.traveler.res, job['options']['target'])
                this.memories['paging_token'] = deepFind(this.traveler.res, this.memories['paging_path']) || null
                if (Array.isArray(results)) {
                    for (let i = 0; i < results.length; i++) {
                        await this.extract(job, results[i])
                    }
                } else {
                    await this.extract(job, results)
                }
                break
            default:
                break
        }
        if (job.children) {
            await this.start(job.children, this.traveler)
        }
    }

    async extract(script, instance) {
        let saveFields = script['options']['field'] ? script['options']['field'].split('.') : []
        let traveler = {}
        for (let field of script['fields']) {
            traveler[field.field] = deepFind(instance, field.path)
        }
        this.data = {
            ...this.data,
            ...makeNestedObjWithArrayItemsAsKeys(saveFields, traveler)
        }
        if (typeof script.children === 'undefined' || script.children.length === 0) {
            if (!this.flag) {
                await addData(this.campaign, this.crawler, this.data)
            } else {
                if (this.io) {
                    this.io.emit('data', this.data)
                }
            }
            this.data = {}
        }
    }

}

module.exports = {
    Api
}
