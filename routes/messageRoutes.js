const express = require('express');
const { createMessage, getMessage, updateMessage, deleteMessage } = require('../controller/messageController');

const router = express.Router();

router.route('/').post(createMessage).get(getMessage).put(updateMessage).delete(deleteMessage);

module.exports = router;