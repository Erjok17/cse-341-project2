const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const getAll = async (req, res) => {
  try {
    const db = mongodb.getDb();
    const products = await db.collection('products').find().toArray();
    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ 
      error: 'Server error',
      details: err.message 
    });
  }
};


const getSingle = async (req, res) => {
  try {
    const db = mongodb.getDb();
    const productId = new ObjectId(req.params.id);
    const product = await db.collection('products').findOne({ _id: productId });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ 
      error: 'Server error',
      details: err.message 
    });
  }
};

/**
 * @swagger
 * /products:
 *   post:
 *     tags: [Products]
 *     summary: Create a new product
 *     description: Creates a new product with required fields
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 * 
 * components:
 *   schemas:
 *     ProductInput:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - category
 *       properties:
 *         name:
 *           type: string
 *           example: Wireless Earbuds
 *         price:
 *           type: number
 *           minimum: 0
 *           example: 59.99
 *         category:
 *           type: string
 *           enum: [electronics, clothing, food]
 *           example: electronics
 *         description:
 *           type: string
 *           example: Noise-cancelling wireless earbuds
 *         inStock:
 *           type: boolean
 *           default: true
 */
const createProduct = async (req, res) => {
  try {
    const db = mongodb.getDb();
    const product = {
      name: req.body.name,
      price: parseFloat(req.body.price),
      category: req.body.category,
      description: req.body.description || '',
      inStock: req.body.inStock !== false, // Default true
      createdAt: new Date()
    };

    // Input validation (complements your middleware)
    if (product.price < 0) {
      return res.status(400).json({ error: 'Price must be positive' });
    }

    const response = await db.collection('products').insertOne(product);

    if (response.acknowledged) {
      res.status(201).json({
        _id: response.insertedId,
        ...product,
        createdAt: product.createdAt.toISOString()
      });
    } else {
      res.status(500).json({ error: 'Failed to create product' });
    }
  } catch (err) {
    res.status(500).json({ 
      error: 'Server error',
      details: err.message 
    });
  }
};

// Adding similar swagger docs for getProduct, updateProduct, deleteProduct

// update product 
/**
 * @swagger
 * /products/{id}:
 *   put:
 *     tags: [Products]
 *     summary: Update a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 */
const updateProduct = async (req, res) => {
  try {
    const productId = new ObjectId(req.params.id);
    const product = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      description: req.body.description
    };

    const response = await mongodb.getDb().collection('products')
      .updateOne({ _id: productId }, { $set: product });

    if (response.modifiedCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//delete product 

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Delete a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */
const deleteProduct = async (req, res) => {
  try {
    const productId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().collection('products')
      .deleteOne({ _id: productId });

    if (response.deletedCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createProduct,
  updateProduct,
  deleteProduct,
};
