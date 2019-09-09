const {FileModel, UserModel} = require('core-model');
const {responseError} = require('./response');
const {getBody} = require('./request');
const utilities = require('../helpers/utilities')
const path = require('path')

const escapeRegex = (string) => {
    return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

exports.create = (req, res, next) => {
    UserModel.findById(req.payload.id).then(function (user) {
        if (!user) {
            return res.sendStatus(401);
        }
        let instance = new FileModel()
        instance.user = user
        instance.title = req.file.originalname
        instance.path = utilities.removeFirstPath(req.file.path.replace(utilities.removeLastPath(path.dirname(require.main.filename)), ''))
        instance.save().then(function () {
            return res.json(instance);
        }).catch(error => {
            let message = error && error.message ? error.message : 'Error';
            return responseError(res, message, {messageCode: 'error_get_user'});
        });
    }).catch(next);

};

exports.list = async (req, res, next) => {
    const pageSize = req.query.pageSize || 9;
    const page = req.query.page || 1;
    try {
        const searchQuery = req.query.search || ''
        const regex = new RegExp(escapeRegex(searchQuery), 'gi');
        const results = await FileModel.find({title: regex})
            .skip((pageSize * page) - pageSize)
            .limit(pageSize);
        const total = await FileModel.count();
        res.json({
            results: results,
            currentPage: page,
            numPage: Math.ceil(total / pageSize),
            total: total
        });
    } catch (err) {
        return next(err)
    }
};

exports.retrieve = async (req, res) => {
    return res.json(req.instance);
};

exports.update = (req, res) => {
    let data = getBody(req, ['title', 'destination']);
    for (let field of Object.keys(data)) {
        if (typeof data[field] !== 'undefined') {
            req.instance[field] = data[field];
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

