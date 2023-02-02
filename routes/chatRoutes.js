const express = require('express');
const { createChat, getChat, updateChat, deleteChat } = require('../controller/chatController');

const router = express.Router();

router.route('/').post(createChat).get(getChat).put(updateChat).delete(deleteChat);

module.exports = router;