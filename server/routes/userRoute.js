/*const router = require('express').Router();
const {authentication, restrictTo} = require('../controllers/authController');
const {getUsers, updateUser, deleteUser,
    getAdmins, getUserById,
    getUserByEmailOrOGRN} = require("../controllers/userController");*/

import Router from "express";
import {authentication, restrictTo} from "../controllers/authController.js";
import {getUsers, updateUser, deleteUser,
    getAdmins, getUserById,
    getUserByEmailOrOGRN} from "../controllers/userController.js";

//const router = route.Router();
const router = Router();

router.route('/')
    .get(getUsers);

router.route('/user')
    .get(getUserByEmailOrOGRN);

router.route('/:id')
    .get(authentication, getUserById);

router.route('/user')
    .delete(authentication, deleteUser);

router.route('/user')
    .post(authentication, updateUser);

router.route('/admins')
    .get(authentication,
        restrictTo('ADMIN'),
        getAdmins);

export default router;
//module.exports = router;