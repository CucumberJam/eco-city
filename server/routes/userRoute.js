const router = require('express').Router();
const {authentication, restrictTo} = require('../controllers/authController');
const {getAllUsers,
    getUsersByReceiver, getUsersByProducer,
    getUsersByRecycler,
    getAllAdmins, getUserById, getUserByEmailOrOGRN} = require("../controllers/userController");


router.route('/').get(getAllUsers);
router.route('/').post(getUserByEmailOrOGRN);
router.route('/admins').get(authentication, restrictTo('ADMIN'), getAllAdmins);

router.route('/receiver')
    .get(authentication,
    restrictTo('ADMIN', 'RECEIVER'),
    getUsersByReceiver);

router.route('/recycler')
    .get(authentication,
        restrictTo('ADMIN', 'RECYCLER'),
        getUsersByRecycler);

router.route('/producer')
    .get(authentication,
        restrictTo('ADMIN', 'PRODUCER'),
        getUsersByProducer);

router.route('/:id').get(getUserById);


module.exports = router;