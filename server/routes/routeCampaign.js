const express = require('express');
const router = express.Router();
const taskCtrl = require('../controllers/ctrlCampaign');
const {CampaignModel} = require('core-model');
const auth = require('./auth');

router.param('id', function (req, res, next, id) {
    CampaignModel.findById(id)
        .then(function (instance) {
            if (!instance) {
                return res.sendStatus(404);
            }
            req.instance = instance;
            return next();
        }).catch(next);
});

/* GET home page. */
router.get('/', auth.optional, taskCtrl.list);
router.post('/', auth.required, taskCtrl.create);
router.get('/:id', auth.optional, taskCtrl.retrieve);
router.put('/:id', auth.required, taskCtrl.update);
router.delete('/:id', auth.required, taskCtrl.delete);
router.post('/:id/data/', auth.required, taskCtrl.addData);
router.post('/:id/crawlers/', auth.required, taskCtrl.addCrawler);
router.put('/:id/data/:dId', auth.required, taskCtrl.updateData);
router.put('/:id/crawlers/:crawler', auth.required, taskCtrl.updateCrawler);
router.delete('/:id/data/', auth.required, taskCtrl.deleteData);
router.delete('/:id/crawlers/:crawler', auth.required, taskCtrl.deleteCrawler);
module.exports = router;
