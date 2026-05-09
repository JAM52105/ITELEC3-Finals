const mongoose = require('mongoose');
const Product = require('./models/productModel');
require('dotenv').config({ path: './config.env' });

const DB = process.env.DATABASE;

mongoose.connect(DB)
  .then(async () => {
    console.log('DB connection successful!');
    
    try {
      // Check the actual collection indexes
      const indexes = await Product.collection.getIndexes();
      console.log('\n📋 Current indexes on products collection:');
      if (Array.isArray(indexes)) {
        indexes.forEach((index, i) => {
          console.log(`${i + 1}. Name: ${index.name}`);
          console.log(`   Key: ${JSON.stringify(index.key)}`);
          console.log(`   Unique: ${index.unique}`);
        });
      } else {
        console.log('Indexes result:', indexes);
      }
      
      // Test with a simple duplicate
      console.log('\n🧪 Testing simple duplicate...');
      
      // Clear any existing test documents
      await Product.deleteMany({ name: 'Test Duplicate Product' });
      
      // Create first document
      const doc1 = await Product.create({
        name: 'Test Duplicate Product',
        price: 100,
        category: 'Electronics',
        description: 'Test 1',
        seller: 'Test User'
      });
      
      console.log('First document created with _id:', doc1._id);
      
      // Try to create exact same document
      try {
        const doc2 = await Product.create({
          name: 'Test Duplicate Product',
          price: 200,
          category: 'Electronics',
          description: 'Test 2',
          seller: 'Test User 2'
        });
        console.log('ERROR: Second document created (should have failed)');
      } catch (err) {
        console.log('✅ SUCCESS: Duplicate error caught!');
        console.log('Error code:', err.code);
        console.log('Error message:', err.message);
      }
      
    } catch (err) {
      console.log('Error checking indexes:', err);
    }
    
    await mongoose.connection.close();
    process.exit(0);
  })
  .catch(err => {
    console.log('DB connection error:', err);
    process.exit(1);
  });
