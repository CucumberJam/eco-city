/*const router = require('express').Router();
const {authentication, restrictTo} = require('../controllers/authController');
const {getRoles, createRole} = require("../controllers/roleController");*/

import Router from "express";
import {authentication, restrictTo} from "../controllers/authController.js";
import {getRoles, createRole} from "../controllers/roleController.js";

//const router = route.Router();
const router = Router();

router.route('/')
    .get(getRoles)
    .post(authentication, restrictTo('ADMIN'), createRole);

export default router;
//module.exports = router;