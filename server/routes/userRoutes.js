const express = require('express');
const { createUser, getUser, updateUser, deleteUser } = require('../controller/userController');

const router = express.Router();

router.route('/').post(createUser).get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;