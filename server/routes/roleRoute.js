const router = require('express').Router();
const {authentication, restrictTo} = require('../controllers/authController');
const {getRoles, createRole} = require("../controllers/roleController");

router.route('/')
    .get(getRoles)
    .post(authentication, restrictTo('ADMIN'), createRole);

module.exports = router;