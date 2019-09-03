const {Api} = require('./api')
const {Request} = require('./request')
const {Headless} = require('./headless')
/**
 * function script
 * @script Kịch bản script được lưu vào Database
 * Hàm này sẽ lấy kịch bản và map với lại structure
 */

exports.crawler = async (crl, campaign, io, test) => {
    switch (crl.script.options['cType']) {
        case 'HEADLESS': {
            let crawler = new Headless(campaign, crl, test, io)
            await crawler.init()
            crawler.start(crl.script.jobs, null).then(() => {
                crawler.end()
            })
            break;
        }
        case 'REQUEST': {
            let crawler = new Request(campaign, crl, test, io)
            await crawler.start(crl.script.jobs, null)
            break;
        }
        case 'API': {
            let crawler = new Api(campaign, crl, test, io)
            await crawler.start(crl.script.jobs, null)
            break;
        }
        default:
            break;
    }
}
