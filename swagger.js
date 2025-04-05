const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Users & Products API',
    version: '1.0.0'
  },
  host: 'localhost:3000',
  schemes: ['http', 'https'],
  tags: [
    { name: 'Users', description: 'User operations' },
    { name: 'Products', description: 'Product operations' }
  ],
  paths: {
    // Users endpoints
    '/users': {
      get: { tags: ['Users'], summary: 'Get all users' },
      post: { tags: ['Users'], summary: 'Create user' }
    },
    '/users/{id}': {
      get: { tags: ['Users'], summary: 'Get single user' },
      put: { tags: ['Users'], summary: 'Update user' },
      delete: { tags: ['Users'], summary: 'Delete user' }
    },
    // Products endpoints
    '/products': {
      get: { tags: ['Products'], summary: 'Get all products' },
      post: { tags: ['Products'], summary: 'Create product' }
    },
    '/products/{id}': {
      get: { tags: ['Products'], summary: 'Get single product' },
      put: { tags: ['Products'], summary: 'Update product' },
      delete: { tags: ['Products'], summary: 'Delete product' }
    }
  }
};

const outputFile = './swagger.json';
const endpointsFiles = [
  './routes/users.js',
  './routes/products.js'
];

swaggerAutogen(outputFile, endpointsFiles, doc);