var router = require('express').Router();

router.use('/users', require('./routeUser'));
router.use('/scripts', require('./routeScript'));
router.use('/campaigns', require('./routeCampaign'));
router.use('/dataset', require('./routeData'));
module.exports = router;
