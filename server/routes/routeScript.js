const express = require('express');
const router = express.Router();
const ctrlScript = require('../controllers/ctrlScript');
const {ScriptModel} = require('core-model');

router.param('id', function (req, res, next, id) {
    ScriptModel.findById(id)
        .then(function (instance) {
            if (!instance) {
                return res.sendStatus(404);
            }
            req.instance = instance;
            return next();
        }).catch(next);
});

/* GET home page. */
router.get('/', ctrlScript.list);
router.post('/', ctrlScript.create);
router.get('/:id', ctrlScript.retrieve);
router.put('/:id', ctrlScript.update);
router.delete('/:id', ctrlScript.delete);

module.exports = router;
