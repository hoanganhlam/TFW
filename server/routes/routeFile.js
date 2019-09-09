const express = require('express');
const router = express.Router();
const fileCtrl = require('../controllers/fileCtrl');
const {FileModel} = require('core-model');
const upload = require('../helpers/upload');
var auth = require('./auth');

router.param('file', function (req, res, next, id) {
    FileModel.findById(id)
        .then(function (instance) {
            if (!instance) {
                return res.sendStatus(404);
            }
            req.instance = instance;
            return next();
        }).catch(next);
});

/* GET home page. */
router.get('/', fileCtrl.list);
router.post('/', auth.required, upload.single('file'), fileCtrl.create);
router.get('/:file', fileCtrl.retrieve);
router.put('/:file', fileCtrl.update);
router.delete('/:file', fileCtrl.delete);

module.exports = router;
