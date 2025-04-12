const express = require('express');
const router = express.Router();
const passport = require('passport');
const isAuthenticated = require('../middleware/authenticate');

// Existing routes
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
  res.json({ 
    message: 'Users & Products API is running',
    status: req.session.user ? 'authenticated' : 'unauthenticated',
    endpoints: {
      login: '/auth/github',
      logout: '/logout',
      users: '/users',
      products: '/products'
    }
  });
});

/**
 * @swagger
 * /auth/github:
 *   get:
 *     tags: [Authentication]
 *     summary: Initiate GitHub OAuth login
 *     description: Redirects to GitHub for authentication
 *     responses:
 *       302:
 *         description: Redirect to GitHub
 */
router.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

/**
 * @swagger
 * /auth/github/callback:
 *   get:
 *     tags: [Authentication]
 *     summary: GitHub OAuth callback
 *     description: Handles the GitHub OAuth callback
 *     responses:
 *       302:
 *         description: Redirect to home page
 *       401:
 *         description: Authentication failed
 */
router.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    req.session.user = {
      id: req.user.id,
      username: req.user.username,
      displayName: req.user.displayName,
      profileUrl: req.user.profileUrl
    };
    res.redirect('/');
  }
);

/**
 * @swagger
 * /logout:
 *   get:
 *     tags: [Authentication]
 *     summary: Log out current user
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Successfully logged out' });
  });
});


/**
 * @swagger
 * /login:
 *   get:
 *     tags: [Authentication]
 *     summary: Redirect to GitHub login
 *     responses:
 *       302:
 *         description: Redirects to GitHub OAuth
 */
router.get('/login', (req, res) => {
  res.redirect('/auth/github');
});

// Add these routes
router.get('/login', (req, res) => res.redirect('/auth/github'));

router.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/auth/github/callback',
  passport.authenticate('github', { 
    failureRedirect: '/api-docs',
    session: true 
  }),
  (req, res) => {
    // Successful authentication
    res.redirect('/');
  }
);

module.exports = router;