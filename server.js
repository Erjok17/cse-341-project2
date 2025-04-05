require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const port = process.env.PORT || 3000;

// Enhanced Middleware
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods', 
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

// Swagger Documentation (Must come before routes)
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    explorer: true,
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'method'
    }
  })
);

// Database and Server Initialization
mongodb.initDb((err) => {
  if (err) {
    console.error("Database initialization failed:", err);
    process.exit(1);
  } else {
    console.log("Connected to MongoDB successfully");
    
    // Routes (using index.js routing)
    app.use('/', require('./routes'));
    app.use( require('./routes/users'));
    app.use(require('./routes/products'));
    
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server is running on port ${port}`);
      console.log(`API Docs: http://localhost:${port}/api-docs`);
    });
  }
});