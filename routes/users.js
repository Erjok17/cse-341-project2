const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// Full paths including /users prefix
router.get('/users', usersController.getAll);
router.post('/users', usersController.createUser);
router.get('/users/:id', usersController.getSingle);
router.put('/users/:id', usersController.updateUser);
router.delete('/users/:id', usersController.deleteUser);

module.exports = router;


