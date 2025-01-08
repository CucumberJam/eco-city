const router = require('express').Router();
const {authentication, restrictTo} = require('../controllers/authController');
const {getCities, createCity} = require("../controllers/cityController");

router.route('/')
    .get(getCities)
    .post(authentication, restrictTo('ADMIN'), createCity);

module.exports = router;