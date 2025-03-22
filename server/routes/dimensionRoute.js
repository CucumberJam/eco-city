/*
const router = require('express').Router();
const {authentication, restrictTo} = require('../controllers/authController');
const {getDimensions, createDimension} = require("../controllers/dimensionController");
*/

import Router from "express";
import {authentication, restrictTo} from "../controllers/authController.js";
import {getDimensions, createDimension} from "../controllers/dimensionController.js";

//const router = route.Router();
const router = Router();

router.route('/')
    .get(getDimensions)
    .post(authentication, restrictTo('ADMIN'),createDimension);

export default router;
//module.exports = router;