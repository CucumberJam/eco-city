/*const router = require('express').Router();
const {authentication, restrictTo} = require('../controllers/authController');
const {getWastes, createWaste,
    getWasteTypesByWasteId, createWasteType,
    getWasteTypes} = require("../controllers/wasteController");*/

import Router from "express";
import {authentication, restrictTo} from "../controllers/authController.js";
import {getWastes, createWaste,
    getWasteTypesByWasteId, createWasteType,
    getWasteTypes} from "../controllers/wasteController.js";


//const router = route.Router();
const router = Router();

router.route('/')
    .get(getWastes)
    .post(authentication, restrictTo('ADMIN'), createWaste);

router.route('/types/:wasteId').get(getWasteTypesByWasteId);
router.route('/types/').get(getWasteTypes).post(authentication, restrictTo('ADMIN'), createWasteType);


export default router;
//module.exports = router;