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

router.route('/').get(authentication, restrictTo('ADMIN', 'RECYCLER', 'RECEIVER'), getAdverts) // получить  заявки других участников
router.route('/').post(authentication, restrictTo('ADMIN', 'PRODUCER', 'RECEIVER'), createAdvert);

router.route('/:userId').get(authentication, restrictTo('ADMIN', 'PRODUCER', 'RECEIVER'), getAdvertsByUserId); // получить только свои заявки
router.route('/:advertId').post(authentication, restrictTo('ADMIN', 'PRODUCER', 'RECEIVER'), updateAdvertById);
router.route('/:advertId').delete(authentication, restrictTo('ADMIN', 'PRODUCER', 'RECEIVER'), deleteAdvertById);

router.route('/advert/:advertId').get(authentication, restrictTo('ADMIN', 'PRODUCER', 'RECEIVER'), getAdvertById);

module.exports = router;