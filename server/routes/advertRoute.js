const router = require('express').Router();
const {authentication, restrictTo} = require('../controllers/authController');
const {
    getAdvertsByUserId,
    getAdverts,
    createAdvert,
    updateAdvertById,
    getAdvertById,
    deleteAdvertById
} = require("../controllers/advertController");

router.route('/')
    .get(authentication,
        restrictTo('ADMIN', 'RECYCLER', 'RECEIVER'),
        getAdverts)
router.route('/')
    .post(authentication,
        restrictTo('ADMIN', 'PRODUCER', 'RECEIVER'),
        createAdvert);
router.route('/:userId')
    .get(authentication,
        restrictTo('ADMIN', 'PRODUCER', 'RECEIVER'),
        getAdvertsByUserId);
router.route('/:advertId')
    .patch(authentication,
        restrictTo('ADMIN', 'PRODUCER', 'RECEIVER'),
        updateAdvertById);
router.route('/:advertId')
    .delete(authentication,
        restrictTo('ADMIN', 'PRODUCER', 'RECEIVER'),
        deleteAdvertById);
router.route('/advert/:advertId')
    .get(authentication,
        restrictTo('ADMIN', 'PRODUCER', 'RECEIVER'),
        getAdvertById);

module.exports = router;