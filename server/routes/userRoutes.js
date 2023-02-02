const express = require('express');
const { createUser, getUser, updateUser, deleteUser, loginUser } = require('../controller/userController');

const router = express.Router();

router.route('/').post(createUser).get(getUser).put(updateUser).delete(deleteUser);
router.route('/login').post(loginUser);

module.exports = router;