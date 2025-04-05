const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const getAll = async (req, res) => {
  try {
    const db = mongodb.getDb();
    const result = await db.collection('users').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSingle = async (req, res) => {
  try {
    const db = mongodb.getDb();
    const userId = new ObjectId(req.params.id);
    const result = await db.collection('users').findOne({ _id: userId });

    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Similar createUser, updateUser, deleteUser functions
// create user
/**
 * @swagger
 * /users:
 *   post:
 *     tags: [Users]
 *     summary: Create a new user
 *     description: Creates a new user with required fields
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 default: user
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The auto-generated ID of the user
 *                   example: 507f1f77bcf86cd799439011
 *       400:
 *         description: Validation error (missing/invalid fields)
 *       500:
 *         description: Server error
 */
const createUser = async (req, res) => {
  try {
    const db = mongodb.getDb();
    const user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      role: req.body.role || 'user',
      createdAt: new Date()
    };

    // Check for duplicate email
    const existingUser = await db.collection('users').findOne({ email: user.email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const response = await db.collection('users').insertOne(user);
    
    if (response.acknowledged) {
      res.status(201).json({
        _id: response.insertedId,
        message: 'User created successfully'
      });
    } else {
      res.status(500).json({ error: 'Failed to create user' });
    }
  } catch (err) {
    res.status(500).json({ 
      error: 'Server error',
      details: err.message 
    });
  }
};

//update users 
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update a user
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
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: User updated
 *       404:
 *         description: User not found
 *       412:
 *         description: Validation failed
 */
const updateUser = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      role: req.body.role || 'user'
    };

    const response = await mongodb.getDb().collection('users')
      .replaceOne({ _id: userId }, user);

    if (response.modifiedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// delete user 

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete a user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
const deleteUser = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().collection('users')
      .deleteOne({ _id: userId });

    if (response.deletedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createUser,
  updateUser,
  deleteUser,
};
