const puppeteer = require('puppeteer');
const {makeNestedObjWithArrayItemsAsKeys, deepFind, sleep, fieldParse, getTarget, addData} = require('./unity');
const cheerio = require('cheerio');
const blockResources = ['image', 'stylesheet', 'media', 'font', 'texttrack', 'object', 'beacon', 'csp_report', 'imageset'];
const skippedResources = ['quantserve', 'adzerk', 'doubleclick', 'adition', 'exelator', 'sharethrough', 'cdn.api.twitter', 'google-analytics', 'googletagmanager', 'google', 'fontawesome', 'facebook', 'analytics', 'optimizely', 'clicktale', 'mixpanel', 'zedo', 'clicksor', 'tiqcdn',];
const isOptimized = process.env.OPT || false;

async function optimized(browser, check) {
    let page = await browser.newPage()
    if (check) {
        await page.setRequestInterception(true);
        page.on('request', request => {
            const requestUrl = request._url.split('?')[0].split('#')[0];
            if (
                blockResources.indexOf(request.resourceType()) !== -1 ||
                skippedResources.some(resource => requestUrl.indexOf(resource) !== -1)
            ) {
                request.abort();
            } else {
                request.continue();
            }
        });
    }
    return page
}

class Headless {
    constructor(campaign, crawler, flag, io) {
        this.memories = {};
        this.campaign = campaign
        this.crawler = crawler
        this.flag = flag
        this.io = io
    }

    async init() {
        this.browser = await puppeteer.launch({
            headless: isOptimized,
            defaultViewport: null,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu',
                '--window-size=1920,1080'
            ]
        })
    }

    end() {
        this.browser.close()
    }

    async start(JOBS, traveler) {
        if (typeof traveler === 'undefined' || traveler === null) {
            this.traveler = {}
        }
        for (let i = 0; i < JOBS.length; i++) {
            await this.starting(JOBS[i])
        }
    }

    async starting(JOB) {
        if (JOB.loop) {
            await this.handleLoop(JOB)
        } else if (JOB.action) {
            await this.handleAction(JOB)
        }
    }

    async handleLoop(JOB) {
        let maxPage = JOB['options']['max'] || 0
        let page = 0
        let starting = true
        switch (JOB.loop) {
            case 'ARRAY':
                let urls = JOB.urls;
                for (let i = 0; i < urls.length; i++) {
                    JOB['url'] = urls[i]
                    await this.handleAction(JOB)
                }
                break
            case 'PAGING':
                this.memories['paging_path'] = JOB['options']['target']
                while (starting || page < maxPage) {
                    if (!starting) {
                        let page = this.traveler[JOB.key]
                        await page.waitForSelector(this.memories['paging_path']);
                        if (JOB.action === 'GOTO') {
                            let html = await page.content();
                            let target = getTarget(html, 'css', {path: this.memories['paging_path'], position: 'href'})
                            if (target) {
                                JOB['url'] = target
                            } else {
                                break
                            }
                        } else if (JOB.action === 'CLICK') {
                            JOB['options']['target'] = this.memories['paging_path']
                        }
                    }
                    starting = false
                    await this.handleAction(JOB)
                    page++
                    // await sleep(30000)
                }
                break
            case 'LAZY':
                break
            case 'BASIC':
                while (starting || page < maxPage) {
                    let page = this.traveler[JOB['options']['key']]
                    await page.waitForSelector(JOB['options']['target']);
                    let html = await page.content();
                    let $ = cheerio.load(html);
                    if ($(JOB['options']['target']).length) {
                        await this.handleAction(JOB)
                    } else {
                        break
                    }
                    page++
                }
                break
        }
    }

    async handleAction(JOB) {
        let previous_page = this.traveler[JOB['options']['key']]
        switch (JOB.action) {
            case 'GOTO':
                let expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
                if (!JOB['url'].match(expression)) {
                    JOB['urlAbs'] = JOB['url']
                }
                if (JOB['urlAbs']) {
                    JOB['url'] = deepFind(this.data, JOB['urlAbs'])
                }

                if (typeof this.traveler[JOB['key']] === 'undefined') {
                    this.traveler[JOB['key']] = await optimized(this.browser, isOptimized);
                }
                await this.traveler[JOB['key']].goto(JOB['url'], {
                    waitUntil: 'networkidle2',
                    timeout: 300000
                });
                if (JOB['children']) {
                    await this.start(JOB['children'], this.traveler)
                }
                if (JOB['urlAbs']) {
                    JOB['url'] = JOB['urlAbs']
                }
                break
            case 'CLICK':
                if (previous_page) {
                    await previous_page.waitForSelector(JOB['options']['target']);
                    const $ = cheerio.load(await previous_page.content());
                    let url = $(JOB['options']['target']).attr('href')
                    if (url) {
                        await previous_page.goto(url, {
                            waitUntil: 'networkidle2'
                        });
                    } else {
                        await previous_page.click(JOB['options']['target']);
                    }
                }
                if (JOB.children) {
                    await this.start(JOB.children, this.traveler)
                }
                break
            case 'BACK':
                if (previous_page) {
                    await previous_page.back()
                }
                break
            case 'INPUT':
                if (previous_page) {
                    await previous_page.waitForSelector(JOB['options']['target']);
                    await previous_page.type(JOB['options']['target'], JOB['options']['value']);
                }
                break
            case 'EXTRACT':
                if (previous_page) {
                    // await previous_page.waitForSelector(JOB['memories']['actionTarget'], {
                    //     timeout: 30000
                    // });
                    const html = await previous_page.content();
                    await this.extract(JOB, html)
                }
                break
            default:
                break
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
                    addData(this.campaign, this.crawler, this.data)
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
    Headless
}
