const router = require('express').Router();
const {authentication, restrictTo} = require("../controllers/authController");
const {getResponsesByAdvertId,
    getResponsesByUserId,
    createResponse,
    updateResponseByAdvertId,
    deleteResponse,
} = require("../controllers/responseController");

router.route('/')
    .get(authentication,
    restrictTo('ADMIN', 'RECYCLER', 'RECEIVER'),
    getResponsesByUserId) // получить только свои отклики
    .post(authentication,
    restrictTo('ADMIN', 'RECYCLER', 'RECEIVER'),
    createResponse); // публиковать отклики на заявки других участников

router.route('/:responseId').delete(authentication,
    restrictTo('ADMIN', 'RECYCLER', 'RECEIVER'),
    deleteResponse); // только владелец отклика

router.route('/:advertId')
    .get(authentication, restrictTo('ADMIN', 'PRODUCER', 'RECEIVER'),
    getResponsesByAdvertId) // получить отклики других участников по id своего объявления
    .put(authentication,
    restrictTo('ADMIN', 'PRODUCER', 'RECEIVER'),
    updateResponseByAdvertId); // изменить отклик только владелец объявления

module.exports = router;