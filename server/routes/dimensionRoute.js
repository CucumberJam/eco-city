const router = require('express').Router();
const {authentication, restrictTo} = require('../controllers/authController');
const {getDimensions, createDimension} = require("../controllers/dimensionController");

router.route('/')
    .get(getDimensions)
    .post(authentication, restrictTo('ADMIN'),createDimension);

module.exports = router;