const express = require('express');
const router = express.Router();
const request = require('request');
const cheerio = require('cheerio');
const axios = require('axios')
const {FactModel, UserModel, TaxonomyModel} = require('core-model');
const moment = require('moment')
const xpath = require('xpath')
const dom = require('xmldom').DOMParser
const slug = require('slug');

router.get('/scrape', function (req, res, next) {
    if (req.query.url) {
        request(req.query.url, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                const $ = cheerio.load(body);
                const title = $("title").text();
                const description = $('meta[name=description]').attr("content");
                res.send({
                    title: title,
                    metaDescription: description
                });
            }
        });
    }
});

router.get('/description', async function (req, res, next) {
    const search = req.query.search
    const language = req.query.lang || 'vi'
    const instance = axios.create()
    let response = await instance.get(`https://${language}.wikipedia.org/w/api.php?action=opensearch&format=json&formatversion=2&namespace=0&suggest=true`, {
        params: {
            search: search,
            limit: req.query.limit || 10
        },
        headers: {
            'Content-Type': 'text/html; charset=UTF-8',
        }
    })

    try {
        return res.json({
            results: response['data']
        })
    } catch (err) {
        return next(err)
    }
})

router.get('/onthisday', async function (req, res, next) {
    const search = req.query.search
    try {
        return res.json(
            await onthisday(search)
        )
    } catch (err) {
        return next(err)
    }
})

async function onthisday(date) {
    let data = await axios.get('https://en.wikipedia.org/wiki/' + date)
    let doc = new dom().parseFromString(data['data'])
    let result1 = xpath.evaluate("//*[@id=\"mw-content-text\"]/div/ul[1]/li", doc, null, xpath.XPathResult.ANY_TYPE, null)
    let result2 = xpath.evaluate("//*[@id=\"mw-content-text\"]/div/ul[2]/li", doc, null, xpath.XPathResult.ANY_TYPE, null)
    let result3 = xpath.evaluate("//*[@id=\"mw-content-text\"]/div/ul[3]/li", doc, null, xpath.XPathResult.ANY_TYPE, null)
    extract(result1, date, 'event')
    extract(result2, date, 'birth')
    extract(result3, date, 'death')
    return {}
}

function extract(result, dates, title) {
    let out = []
    let node = result.iterateNext();
    while (node) {
        const $ = cheerio.load(node.toString());
        out.push($.text())
        node = result.iterateNext();
    }

    return out.map(async x => {
        let arr = x.split(" – ")
        let temp = arr[0].trim() + '-' + dates
        let date = new moment(temp, 'YYYY-MMM_DD')
        let contentShort = ''
        let tag = 'Event'
        switch (title) {
            case 'event':
                contentShort = 'in ' + date.format('MMMM Do YYYY') + ', ' + arr[1]
                break
            case 'birth':
                tag = 'Birth'
                contentShort = arr[1] + ', born in ' + date.format('MMMM Do YYYY') + '.'
                break
            case 'death':
                tag = 'Death'
                contentShort = arr[1] + ', died in ' + date.format('MMMM Do YYYY') + '.'
                break
        }
        let user = await UserModel.find({username: 'lam'});
        let taxonomy = null
        let taxonomies = await TaxonomyModel.find({'title': tag})
        if (taxonomies.length) {
            taxonomy = taxonomies[0]._id
        } else {
            let new_tag = await TaxonomyModel.create({
                title: tag,
            })
            taxonomy = new_tag._id
        }
        if (date.isValid()) {
            let test = await FactModel.countDocuments({contentShort: contentShort})
            if (test === 0) {
                FactModel.create({
                    number: {
                        day: date.format('DD'),
                        month: date.format('MM'),
                        year: date.format('YYYY'),
                    },
                    contentShort: contentShort,
                    user: user[0],
                    taxonomies: [taxonomy]
                })
            }
        }

        return {
            date,
            contentShort
        }
    })
}

module.exports = router;
