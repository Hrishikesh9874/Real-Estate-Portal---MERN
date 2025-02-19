const express = require('express');
const {test, getUser, updateUser, deleteUser, getUserListings} = require('../controllers/user.controller');
const verifyToken = require('../utils/verifyUser');

const router = express.Router();

router.get('/test', test);
router.post('/update/:id', verifyToken,  updateUser)
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/listings/:id', verifyToken, getUserListings)
router.get('/:id', verifyToken, getUser);

module.exports = router;