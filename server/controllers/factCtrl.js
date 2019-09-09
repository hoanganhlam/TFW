const {FactModel, UserModel, TaxonomyModel} = require('core-model');
const {responseError} = require('./response');
const {getBody} = require('./request');
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
const slug = require('slug');

const escapeRegex = (string) => {
    return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

exports.create = async (req, res, next) => {
    let user = await UserModel.findById(req.payload.id).catch(next);
    if (!user) {
        return res.sendStatus(401);
    }
    let data = getBody(req, [
        'title', 'contentLong', 'taxSlugs', 'photo', 'taxTexts',
        'contentShort', 'source', 'taxonomies', 'date', 'createdAt']);
    try {
        let instance = await FactModel.findOne({contentShort: data.contentShort}).catch(next);
        if (!instance) {
            instance = new FactModel(data)
        }

        if (data.taxTexts && data.taxTexts.length) {
            let taxonomies = []
            for (let i = 0; i < data.taxTexts.length; i++) {
                let taxonomy = await TaxonomyModel.findOne({'slug': slug(data.taxTexts[i])})
                if (!taxonomy) {
                    taxonomy = await TaxonomyModel.create({
                        title: data.taxTexts[i],
                        slug: slug(data.taxTexts[i])
                    })
                }
                taxonomies.push(taxonomy._id)
            }
            instance.taxonomies = taxonomies
        } else if (data.taxSlugs && data.taxSlugs.length) {
            let taxonomies = await TaxonomyModel.find({'slug': {$in: data.taxSlugs}})
            instance.taxonomies = instance.taxonomies.concat(taxonomies.map(x => x._id))
        } else if (data.taxonomies.length) {
            instance.taxonomies = data.taxonomies
        }

        if (user.email === 'lam@trip.vn') {
            let count = await UserModel.count()
            let rand = Math.floor(Math.random() * count);
            instance.user = await UserModel.findOne().skip(rand).catch(next);
        } else {
            instance.user = user
        }
        if (user.email === 'lam@trip.vn' || typeof instance._id === 'undefined') {
            await instance.save()
            return res.json(instance)
        }
        return res.json(instance)

    } catch (error) {
        let message = error && error.message ? error.message : 'Error';
        console.log(message);
        return responseError(res, message, {messageCode: 'error_get_user'});
    }
};

exports.list = async (req, res, next) => {
    let user = await UserModel.findById(req.payload ? req.payload.id : null).catch(next);
    const pageSize = Number.parseInt(req.query.pageSize) || 10;
    const page = req.query.page || 1;

    const searchQuery = req.query.search || ''
    const regex = new RegExp(escapeRegex(searchQuery), 'gi');

    let query = {$or: [{title: regex}, {contentLong: regex}, {contentShort: regex}]}

    if (req.query.day) {
        query['time.day'] = req.query.day.length === 1 ? "0" + req.query.day : req.query.day
    }

    if (req.query.month) {
        query['time.month'] = req.query.month.length === 1 ? "0" + req.query.month : req.query.month
    }

    if (req.query.year) {
        query['time.year'] = req.query.year
    }

    if (req.query.user) {
        query['user.username'] = req.query.user
    }

    if (user === null || (user && user.email !== 'lam@trip.vn')) {
        query['createdAt'] = {$lt: new Date()}
    }

    if (req.query.taxonomy) {
        query['taxonomies'] = {$all: [ObjectId(req.query.taxonomy)]}
    }

    if (req.query.action) {
        let actions = req.query.action.split(',')
        query['votes.value'] = {$in: actions}
    }

    const total = await FactModel.countDocuments(query)
    const display = await FactModel.find(query)
        .populate('user')
        .populate('photo')
        .sort({point: -1})
        .skip(pageSize * (page - 1))
        .limit(pageSize)
        .catch(err => {
            console.log(err);
        })
    return res.json({
        results: display.map(x => x.toJSONFor(user)),
        currentPage: 1,
        total: total
    })
};

exports.retrieve = async (req, res, next) => {
    let user = await UserModel.findById(req.payload ? req.payload.id : null).catch(next);
    let out = req.instance.toJSONFor(user)
    out.taxonomies = req.taxonomies
    return res.json(out)
};

exports.vote = async (req, res, next) => {
    let user = await UserModel.findById(req.payload.id).catch(next)
    if (user) {
        user.vote(req.instance, req.body.value)
    }
    return res.json(user.isVoted(req.instance))
};

exports.update = (req, res) => {
    let data = getBody(req, ['title', 'contentLong', 'contentShort', 'date', 'photo', 'source', 'taxonomies']);
    for (let field of Object.keys(data)) {
        if (typeof data[field] !== 'undefined') {
            if (field === 'source') {
                if (data[field] && data[field].title) {
                    req.instance[field] = data[field];
                } else {
                    req.instance[field] = null
                }
            } else {
                req.instance[field] = data[field];
            }
        }
    }
    req.instance.save().then(function (instance) {
        return res.json(instance);
    }).catch(error => {
        let message = error && error.message ? error.message : 'Error';
        return responseError(res, message, {messageCode: 'error_get_all_user'});
    });
};

exports.delete = (req, res) => {
    return req.instance.remove().then(function () {
        return res.sendStatus(204);
    });
};

exports.comment = async (req, res, next) => {
    let user = await UserModel.findById(req.payload ? req.payload.id : null).catch(next);
    req.instance.comments.unshift({
        user: user._id,
        content: req.body.content,
        createdAt: new Date()
    })
    await req.instance.save()
    return res.json(req.instance.comments[0])
};

exports.random = async (req, res, next) => {
    let count = await FactModel.count()
    let rand = Math.floor(Math.random() * count);
    let facts = await FactModel.findOne().skip(rand);
    return res.json({
        results: facts
    })
}
