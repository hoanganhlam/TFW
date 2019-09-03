const {ScriptModel} = require('core-model');
const {responseError} = require('./response');
const {getBody} = require('./request');

exports.create = (req, res) => {
    let data = getBody(req, ['title', 'jobs', 'options']);
    let instance = new ScriptModel(data)
    instance.save().then(function () {
        return res.json(instance);
    }).catch(error => {
        let message = error && error.message ? error.message : 'Error when get users';
        return responseError(res, message, {messageCode: 'error_get_user'});
    });
};

exports.list = async (req, res, next) => {
    const pageSize = Number.parseInt(req.query.pageSize) || 9;
    const page = req.query.page || 1;
    try {
        const results = await ScriptModel.find({})
        const display = await ScriptModel.find({})
            .skip((pageSize * page) - pageSize)
            .limit(pageSize)
        res.json({
            results: display,
            currentPage: page,
            numPage: Math.ceil(results.length / pageSize),
            total: results.length
        });
    } catch (err) {
        return next(err)
    }
};

exports.retrieve = (req, res) => {
    return res.json(req.instance);
};

exports.update = (req, res) => {
    let data = getBody(req, ['title', 'jobs', 'options']);
    for (let field in data) {
        if (typeof data[field] !== 'undefined') {
            req.instance[field] = data[field];
        }
    }
    req.instance.save().then(function (instance) {
        return res.json(instance);
    }).catch(error => {
        let message = error && error.message ? error.message : 'Error when get all users';
        return responseError(res, message, {messageCode: 'error_get_all_user'});
    });
};

exports.delete = (req, res) => {
    return req.instance.remove().then(function () {
        return res.sendStatus(204);
    });
};
