/*
const router = require('express').Router();
const {authentication, restrictTo} = require('../controllers/authController');
const {getCities, createCity} = require("../controllers/cityController");
*/
import Router from 'express';
import {getCities, createCity} from "../controllers/cityController.js"
import {authentication, restrictTo} from '../controllers/authController.js';
const router = Router();

router.route('/').get(getCities);

router.route('/').post(authentication, restrictTo('ADMIN'), createCity);


export default router;
//module.exports = router;