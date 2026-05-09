const mongoose = require('mongoose');
const Product = require('./models/productModel');
require('dotenv').config({ path: './config.env' });

const DB = process.env.DATABASE;

mongoose.connect(DB)
  .then(async () => {
    console.log('DB connection successful!');
    
    try {
      // First, clear any existing test products
      await Product.deleteMany({ productSlug: { $regex: 'test-duplicate' } });
      console.log('Cleared existing test products');
      
      // Create first product with explicit slug
      const product1 = new Product({
        name: "Test Duplicate Product",
        price: 100,
        category: "Electronics",
        description: "Test product 1",
        seller: "Test User",
        productSlug: "test-duplicate-slug"  // Explicit slug
      });
      
      const saved1 = await product1.save();
      console.log('First product saved with slug:', saved1.productSlug);
      
      // Create second product with EXACT same slug
      const product2 = new Product({
        name: "Test Duplicate Product 2",
        price: 200,
        category: "Electronics",
        description: "Test product 2", 
        seller: "Test User 2",
        productSlug: "test-duplicate-slug"  // EXACT same slug
      });
      
      const saved2 = await product2.save();
      console.log('Second product saved with slug:', saved2.productSlug);
      console.log('ERROR: This should have failed but succeeded!');
      
    } catch (err) {
      console.log('Duplicate error caught:');
      console.log('Error code:', err.code);
      console.log('Error name:', err.name);
      console.log('Error message:', err.message);
      
      if (err.code === 11000) {
        console.log('✅ SUCCESS: Duplicate field error (11000) handled correctly!');
      } else {
        console.log('❌ FAILED: Different error than expected');
      }
    }
    
    await mongoose.connection.close();
    process.exit(0);
  })
  .catch(err => {
    console.log('DB connection error:', err);
    process.exit(1);
  });
