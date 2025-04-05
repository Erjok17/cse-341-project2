const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

// Full paths including /products prefix
router.get('/products', productsController.getAll);
router.post('/products', productsController.createProduct);
router.get('/products/:id', productsController.getSingle);
router.put('/products/:id', productsController.updateProduct);
router.delete('/products/:id', productsController.deleteProduct);

module.exports = router;