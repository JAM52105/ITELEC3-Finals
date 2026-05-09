const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Product = require('./models/productModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE;

mongoose.connect(DB)
  .then(() => {
    console.log('DB connected successfully!');
    
    // Read existing products from JSON file
    const products = JSON.parse(
      fs.readFileSync(`${__dirname}/data/products.json`, 'utf-8')
    );
    
    // Remove the 'id' field since MongoDB will autogenerate '_id'
    const productsForMongo = products.map(({ id, ...product }) => product);
    
    console.log(`Importing ${productsForMongo.length} products to MongoDB...`);
    
    Product.insertMany(productsForMongo)
      .then(() => {
        console.log('Products imported successfully!');
        process.exit(0);
      })
      .catch(err => {
        console.log('Error importing products:', err);
        process.exit(1);
      });
  })
  .catch(err => {
    console.log('DB connection error:', err);
    process.exit(1);
  });
