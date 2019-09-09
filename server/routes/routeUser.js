const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userCtrl');
const {UserModel} = require('core-model');
var auth = require('./auth');

router.param('username', async function (req, res, next, id) {
    let instance = await UserModel.find({username: id}).populate({path: 'avatar', model: 'File'})
        .catch(next);
    if (!instance) {
        return res.sendStatus(404);
    }
    req.instance = instance[0];
    return next();
});

/* GET home page. */
router.get('/dkmvkl', userCtrl.fakerr);
router.get('/', userCtrl.list);
router.post('/', userCtrl.create);
router.get('/me', auth.required, userCtrl.me);
router.get('/:username', userCtrl.retrieve);
router.put('/:username', userCtrl.update);
router.delete('/:username', userCtrl.delete);
router.post('/login', userCtrl.login);

module.exports = router;
