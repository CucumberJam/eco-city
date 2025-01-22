const router = require('express').Router();
const {authentication, restrictTo} = require('../controllers/authController');
const {getAllUsers,
    getReceivers, getProviders, getProducers,
    getAllAdmins, getUserById, getUserByEmailOrOGRN} = require("../controllers/userController");


router.route('/').get(getAllUsers);
router.route('/').post(getUserByEmailOrOGRN);
router.route('/admins').get(authentication, restrictTo('ADMIN'), getAllAdmins);
router.route('/providers').get(getProviders);
router.route('/producers').get(getProducers);
router.route('/receivers').get(getReceivers);
router.route('/:id').get(getUserById);


module.exports = router;