const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const isAuthenticated = require('../middleware/authenticate');

// Public GET routes (no auth needed)
router.get('/', productsController.getAll);          // GET /products
router.get('/:id', productsController.getSingle);   // GET /products/:id

// Protected write operations (require auth)
router.post('/', isAuthenticated, productsController.createProduct);        // POST /products
router.put('/:id', isAuthenticated, productsController.updateProduct);     // PUT /products/:id
router.delete('/:id', isAuthenticated, productsController.deleteProduct);   // DELETE /products/:id

module.exports = router;