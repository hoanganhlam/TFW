const express = require('express');
const router = express.Router();
const controller = require('../controllers/taxonomyCtrl');
const {TaxonomyModel} = require('core-model');
var auth = require('./auth');

router.param('taxonomy', async function (req, res, next, id) {
    let instance = await TaxonomyModel.findOne({slug: id})
        .populate({path: 'facts', populate: {path: 'photo', model: 'File'}})
        .catch(next);
    if (!instance) {
        instance = await TaxonomyModel.findOne({_id: id})
            .populate({path: 'facts', populate: {path: 'photo', model: 'File'}})
            .catch(next);
        if (!instance) {
            return res.sendStatus(404);
        }
    }
    req.instance = instance;
    return next();
});

/* GET home page. */
router.get('/', auth.optional, controller.list);
router.post('/', auth.required, controller.create);
router.get('/:taxonomy', auth.optional, controller.retrieve);
router.put('/:taxonomy', auth.required, controller.update);
router.delete('/:taxonomy', auth.required, controller.delete);

module.exports = router;
