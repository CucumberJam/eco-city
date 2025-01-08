const router = require('express').Router();
const {authentication, restrictTo} = require('../controllers/authController');
const {getDialogs, createDialog} = require('../controllers/dialogController')

router.route('/')
    .get(authentication, getDialogs)
    .post(authentication,
    restrictTo('ADMIN', 'PRODUCER', 'RECEIVER'),
    createDialog);

module.exports = router;