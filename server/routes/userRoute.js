const router = require('express').Router();
const {authentication, restrictTo} = require('../controllers/authController');
const {getUsers,
    getAdmins, getUserById, getUserByEmailOrOGRN} = require("../controllers/userController");

router.route('/')
    .get(getUsers);

router.route('/:id')
    .get(authentication, getUserById);

router.route('/user')
    .get(getUserByEmailOrOGRN);

router.route('/admins')
    .get(authentication,
        restrictTo('ADMIN'),
        getAdmins);

module.exports = router;