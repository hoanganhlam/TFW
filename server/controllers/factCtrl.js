const {FactModel, UserModel, TaxonomyModel} = require('core-model');
const {responseError} = require('./response');
const {getBody} = require('./request');
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
const escapeRegex = (string) => {
    return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


exports.create = async (req, res, next) => {
    let user = await UserModel.findById(req.payload.id).catch(next);
    if (!user) {
        return res.sendStatus(401);
    }
    let data = getBody(req, [
        'title', 'contentLong', 'photo', 'textTaxonomies',
        'contentShort', 'source', 'number', 'createdAt']);
    try {
        let instance = await FactModel.findOne({contentShort: data.contentShort}).catch(next);
        if (!instance) {
            instance = new FactModel(data)
        }

        let taxonomies = []
        if (data['textTaxonomies'] && data['textTaxonomies'].length) {
            for (let i = 0; i < data['textTaxonomies'].length; i++) {
                let check = await TaxonomyModel.find({title: data['textTaxonomies'][i]})
                if (check.length) {
                    taxonomies.push(check[0]._id)
                } else {
                    let tag = await TaxonomyModel.create({title: data['textTaxonomies'][i]})
                    taxonomies.push(tag._id)
                }
            }
        }
        instance.taxonomies = taxonomies

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
    let sort = {point: -1}
    const pageSize = Number.parseInt(req.query.page_size) || 10;
    const page = req.query.page || 1;
    const searchQuery = req.query.search || ''
    const regex = new RegExp(escapeRegex(searchQuery), 'gi');

    let query = {$or: [{title: regex}, {contentLong: regex}, {contentShort: regex}]}

    if (req.query.ordering === 'newest') {
        sort =  {createdAt: -1}
    }

    if (req.query.day) {
        query['number.day'] = req.query.day.length === 1 ? "0" + req.query.day : req.query.day
    }

    if (req.query.month) {
        query['number.month'] = req.query.month.length === 1 ? "0" + req.query.month : req.query.month
    }

    if (req.query.year) {
        query['number.year'] = req.query.year
    }

    if (req.query.trivia) {
        query['number.trivia'] = req.query.trivia
    }

    if (req.query.math) {
        query['number.math'] = req.query.math
    }

    if (req.query.number) {
        query[$or].concat([
            {
                'number.day': req.query.number
            },
            {
                'number.month': req.query.number
            },
            {
                'number.year': req.query.number
            },
            {
                'number.trivia': req.query.number
            },
            {
                'number.math': req.query.number
            }
        ])
    }

    if (req.query.user) {
        query['user'] = ObjectId(req.query.user)
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
        .populate('taxonomies')
        .sort(sort)
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

exports.update = async (req, res, next) => {
    let user = await UserModel.findById(req.payload.id).catch(next);
    let data = getBody(req, ['title', 'contentLong', 'contentShort', 'number', 'photo', 'source', 'textTaxonomies']);
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
    let taxonomies = []
    if (data['textTaxonomies'] && data['textTaxonomies'].length) {
        for (let i = 0; i < data['textTaxonomies'].length; i++) {
            let check = await TaxonomyModel.find({title: data['textTaxonomies'][i]})
            if (check.length) {
                taxonomies.push(check[0]._id)
            } else {
                let tag = await TaxonomyModel.create({title: data['textTaxonomies'][i]})
                taxonomies.push(tag._id)
            }
        }
    }
    req.instance.taxonomies = taxonomies
    req.instance.save().then(function (instance) {
        return res.json(instance.toJSONFor(user));
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
