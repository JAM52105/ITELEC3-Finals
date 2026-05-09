const fs = require('fs');
const path = require('path');
const replaceTemplate = require('./modules/replaceTemplate');
const Product = require('./models/productModel');

const tempOverview = fs.readFileSync(`${__dirname}/public/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/public/template-card.html`, 'utf-8');

exports.importData = async () => {
  try {
    const products = JSON.parse(
      fs.readFileSync(`${__dirname}/data/products.json`)
    );
    
    await Product.insertMany(products);
    console.log('Data successfully imported to MongoDB!');
  } catch (err) {
    console.log('Error importing data:', err);
  }
};

exports.deleteData = async () => {
  try {
    await Product.deleteMany();
    console.log('Data successfully deleted from MongoDB!');
  } catch (err) {
    console.log('Error deleting data:', err);
  }
};
