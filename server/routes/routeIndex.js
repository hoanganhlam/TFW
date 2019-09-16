const express = require('express');
const router = express.Router();
const {TaxonomyModel, UserModel, FactModel} = require('core-model');
const auth = require('./auth');

async function popular(user) {
    const total = await FactModel.countDocuments({})
    const display = await FactModel.find({})
        .populate('user')
        .populate('photo')
        .sort({point: -1})
        .limit(3)
        .catch(err => {
            console.log(err);
        })
    return {
        results: display.map(x => x.toJSONFor(user)),
        currentPage: 1,
        total: total
    }
}

async function this_day(user, query) {
    let total
    let display
    if (query['number.month'] && query['number.day']) {
        total = await FactModel.countDocuments(query)
        display = await FactModel.find(query)
            .populate({
                path: 'taxonomies',
                populate: {
                    path: 'facts', populate: {path: 'photo', model: 'File'}
                }
            })
            .limit(5)
            .catch(err => {
                console.log(err);
            })
    } else {
        total = 0
        display = []
    }
    return {
        results: display,
        currentPage: 1,
        total: total
    }
}

async function recent(user, page, pageSize) {
    const total = await FactModel.countDocuments({})
    const display = await FactModel.find({})
        .populate('user')
        .populate('photo')
        .populate('taxonomies')
        .sort({createdAt: -1})
        .skip(pageSize * (page - 1))
        .limit(pageSize)
        .catch(err => {
            console.log(err);
        })
    return {
        results: display.map(x => x.toJSONFor(user)),
        currentPage: 1,
        total: total
    }
}

async function taxonomies() {
    let query = {}
    const results_count = await TaxonomyModel.countDocuments(query)
    const display = await TaxonomyModel.find(query)
        .populate({path: 'facts', populate: {path: 'photo', model: 'File'}})
        .limit(5)
        .catch(err => {
            console.log(err);
        })
    return {
        results: display.map(x => x.toJsonFor()),
        currentPage: 1,
        total: results_count
    }
}

async function hashtag() {
    let query = {
        isObject: false
    }
    const results_count = await TaxonomyModel.countDocuments(query)
    const display = await TaxonomyModel.find(query)
        .populate({path: 'facts', populate: {path: 'photo', model: 'File'}})
        .limit(5)
        .catch(err => {
            console.log(err);
        })
    return {
        results: display.map(x => x.toJsonFor()),
        currentPage: 1,
        total: results_count
    }
}

async function random() {
    let count = await FactModel.countDocuments({})
    let rand = Math.floor(Math.random() * count);
    return await FactModel.findOne()
        .populate('user')
        .populate({
            path: 'taxonomies',
            populate: {
                path: 'facts', populate: {path: 'photo', model: 'File'}
            }
        })
        .populate('photo')
        .skip(rand);
}

/* GET home page. */
router.get('/', auth.optional, async (req, res, next) => {
    const page = Number.parseInt(req.query.page) || 1
    const pageSize = Number.parseInt(req.query.page_size) || 10
    let query = {}
    if (req.query.day) {
        query['number.day'] = req.query.day.length === 1 ? "0" + req.query.day : req.query.day
    }

    if (req.query.month) {
        query['number.month'] = req.query.month.length === 1 ? "0" + req.query.month : req.query.month
    }

    if (req.query.year) {
        query['number.year'] = req.query.year
    }

    let user = await UserModel.findById(req.payload ? req.payload.id : null).catch(next);
    let n = await recent(user, page, pageSize)
    let p = await popular(user)
    let t = await taxonomies()
    let h = await hashtag()
    let d = await this_day(user, query)
    let r = await random()

    return res.json({
        n, p, t, d, r: r ? r.toJSONFor(user) : null, h
    })
});

router.post('/', auth.required, (req, res, next) => {

});

module.exports = router;
