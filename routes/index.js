const express = require('express');
const router = express.Router();

router.use('/', require('./swagger'));
router.use('/users', require('./users'));
router.use('/products', require('./products'));

/**
 * @swagger
 * /:
 *   get:
 *     tags: [Root]
 *     summary: API Status
 *     responses:
 *       200:
 *         description: API is running
 */
router.get('/', (req, res) => {
  res.send('Users & Products API is running');
});

module.exports = router;