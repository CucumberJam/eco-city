const router = require('express').Router();
const {authentication, restrictTo} = require('../controllers/authController');
const {getDialogs, createDialog, getDialogById} = require('../controllers/dialogController')

router.route('/')
    .get(authentication, getDialogs)
    .post(authentication,
    restrictTo('ADMIN', 'PRODUCER', 'RECEIVER'),
    createDialog);

router.route('/:dialogId')
    .get(authentication, getDialogById)

module.exports = router;