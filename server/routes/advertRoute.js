/*const router = require('express').Router();
const {authentication, restrictTo} = require('../controllers/authController');
const {
    getAdvertsByUserId,
    getAdverts,
    createAdvert,
    updateAdvertById,
    getAdvertById,
    deleteAdvertById
} = require("../controllers/advertController");*/

import Router from 'express';
import {authentication, restrictTo} from '../controllers/authController.js';
import {
    getAdvertsByUserId,
    getAdverts,
    createAdvert,
    updateAdvertById,
    getAdvertById,
    deleteAdvertById
} from "../controllers/advertController.js";

//const router = route.Router();
const router = Router();

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
export default router;
//.exports = router;