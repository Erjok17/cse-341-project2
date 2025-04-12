// routes/users.js (updated)
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const isAuthenticated = require('../middleware/authenticate');

// Remove '/users' prefix from all routes since it's added in server.js
router.get('/', usersController.getAll); // Now matches /users
router.get('/:id', usersController.getSingle); // Now matches /users/:id
router.post('/', isAuthenticated, usersController.createUser);
router.put('/:id', isAuthenticated, usersController.updateUser);
router.delete('/:id', isAuthenticated, usersController.deleteUser);

module.exports = router;

