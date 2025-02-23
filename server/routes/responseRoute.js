const router = require('express').Router();
const {authentication, restrictTo} = require("../controllers/authController");
const {getOtherResponses,
    getResponsesByUserId,
    createResponse,
    updateResponseByAdvertId,
    deleteResponse,
    getResponseById,
    getResponsesByAdvertId,
} = require("../controllers/responseController");

router.route('/')
    .get(authentication,
    restrictTo('ADMIN', 'PRODUCER', 'RECEIVER'),
    getOtherResponses) // получить отклики других участников на свои объявления
    .post(authentication,
    restrictTo('ADMIN', 'RECYCLER', 'RECEIVER'),
    createResponse); // публиковать отклики на заявки других участников

router.route('/:responseId').delete(authentication,
    restrictTo('ADMIN', 'RECYCLER', 'RECEIVER'),
    deleteResponse); // только владелец отклика

router.route('/:userId')
    .get(authentication, restrictTo('ADMIN', 'RECYCLER', 'RECEIVER'),
    getResponsesByUserId) // получить только свои отклики

router.route('/:advertId').patch(authentication,
    restrictTo('ADMIN', 'PRODUCER', 'RECEIVER'),
    updateResponseByAdvertId); // изменить отклик только владелец объявления

router.route('/response/:responseId')
    .get(authentication,
        restrictTo('ADMIN', 'PRODUCER', 'RECYCLER', 'RECEIVER'),
        getResponseById);
router.route('/advert/:advertId')
    .get(authentication,
        restrictTo('ADMIN', 'PRODUCER', 'RECEIVER'),
        getResponsesByAdvertId);

module.exports = router;