const mongoose = require('mongoose');
const Product = require('./models/productModel');
require('dotenv').config({ path: './config.env' });

const DB = process.env.DATABASE;

mongoose.connect(DB)
  .then(() => {
    console.log('DB connection successful!');
    
    // Clear any existing products with this slug first
    Product.deleteMany({ productSlug: 'test-duplicate-slug' })
      .then(() => {
        console.log('Cleared existing products with test slug');
        
        // Create first product with manually set slug
        const testProduct1 = {
          name: "Test Duplicate Product",
          price: 100,
          category: "Electronics",
          description: "Test product 1",
          seller: "Test User",
          productSlug: "test-duplicate-slug"  // Manually set slug
        };

        return Product.create(testProduct1);
      })
      .then(product => {
        console.log('First product created successfully');
        
        // Try to create second product with EXACT same slug (should fail)
        const testProduct2 = {
          name: "Test Duplicate Product 2",
          price: 200,
          category: "Electronics", 
          description: "Test product 2",
          seller: "Test User 2",
          productSlug: "test-duplicate-slug"  // EXACT same slug
        };
        
        // Use collection.insertOne to bypass pre-save middleware
        return Product.collection.insertOne(testProduct2);
      })
      .then(() => {
        console.log('ERROR: Duplicate creation succeeded when it should have failed!');
      })
      .catch(err => {
        console.log('Duplicate error caught:');
        console.log('Error code:', err.code);
        console.log('Error name:', err.name);
        console.log('Error message:', err.message);
        
        if (err.code === 11000) {
          console.log('SUCCESS: Duplicate field error (11000) handled correctly!');
        }
      })
      .finally(() => {
        mongoose.connection.close();
        process.exit(0);
      });
  })
  .catch(err => {
    console.log('DB connection error:', err);
    process.exit(1);
  });
