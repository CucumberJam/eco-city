const router = require('express').Router();
const {authentication} = require('../controllers/authController');
const {getMessages, postMessage, updateMessage} = require('../controllers/messageController')

router.route('/').post(authentication, postMessage);
router.route('/:dialogId').get(authentication, getMessages);
router.route('/:messageId').put(authentication, updateMessage); // body = {isRead, dialogId } || {test: 'eregre...'}

module.exports = router;