const router = require('express').Router();
const {authentication, restrictTo} = require('../controllers/authController');
const {getDialogs,
    createDialog,
    getDialogById,
    updateDialogById} = require('../controllers/dialogController')

router.route('/')
    .get(authentication,
        restrictTo('ADMIN', 'PRODUCER', 'RECEIVER', 'RECYCLER'),
        getDialogs)
    .post(authentication,
        restrictTo('ADMIN', 'PRODUCER', 'RECEIVER'),
        createDialog);

router.route('/:dialogId')
    .get(authentication,
        restrictTo('ADMIN', 'PRODUCER', 'RECEIVER', 'RECYCLER'),
        getDialogById)
    .put(authentication,
        restrictTo('ADMIN', 'PRODUCER', 'RECEIVER', 'RECYCLER'),
        updateDialogById)

module.exports = router;