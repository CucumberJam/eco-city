const router = require('express').Router();
const {authentication, restrictTo} = require('../controllers/authController');
const {getWastes, createWaste,
    getWasteTypesByWasteId, createWasteType,
    getWasteTypes} = require("../controllers/wasteController");

router.route('/')
    .get(getWastes)
    .post(authentication, restrictTo('ADMIN'), createWaste);

router.route('/types/:wasteId').get(getWasteTypesByWasteId);
router.route('/types/').get(getWasteTypes).post(authentication, restrictTo('ADMIN'), createWasteType);


module.exports = router;