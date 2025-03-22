/*
const router = require('express').Router();
const {authentication} = require('../controllers/authController');
const {getMessages, postMessage, updateMessage} = require('../controllers/messageController')
*/

import Router from "express";
import {authentication} from "../controllers/authController.js";
import {getMessages, postMessage,
    updateMessage} from '../controllers/messageController.js';

//const router = route.Router();
const router = Router();

router.route('/').post(authentication, postMessage);
router.route('/:dialogId').get(authentication, getMessages);
router.route('/:messageId').put(authentication, updateMessage); // body = {isRead, dialogId } || {test: 'eregre...'}

export default router;
//module.exports = router;