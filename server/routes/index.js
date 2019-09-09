var router = require('express').Router();

router.use('/users', require('./routeUser'));
router.use('/facts', require('./routeFact'));
router.use('/files', require('./routeFile'));
router.use('/taxonomies', require('./routeTaxonomy'));
router.use('/utilities', require('./routeUtility'));
router.use('/home', require('./routeIndex'));

module.exports = router;
