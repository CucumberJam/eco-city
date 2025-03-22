/*const router = require('express').Router();
const {authentication, restrictTo} = require('../controllers/authController');
const {getDialogs,
    createDialog,
    getDialogById,
    updateDialogById} = require('../controllers/dialogController');*/

import Router from "express";
import {authentication, restrictTo} from "../controllers/authController.js";
import {getDialogs,
    createDialog,
    getDialogById,
    updateDialogById} from '../controllers/dialogController.js';

//const router = route.Router();
const router = Router();

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
    .post(authentication,
        restrictTo('ADMIN', 'PRODUCER', 'RECEIVER', 'RECYCLER'),
        updateDialogById)

export default router;
//module.exports = router;