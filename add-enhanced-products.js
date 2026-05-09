const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE;

mongoose.connect(DB)
  .then(() => {
    console.log('DB connected successfully!');
    
    // Add sample products with new schema fields
    const sampleProducts = [
      {
        name: "Gaming Laptop Pro",
        price: 45000,
        category: "Electronics",
        description: "High-performance gaming laptop with RTX 4080 and 32GB RAM",
        seller: "TechStore",
        ratingsAverage: 4.8,
        ratingsQuantity: 25,
        stock: 5
      },
      {
        name: "Node.js Complete Guide",
        price: 1200,
        category: "Books",
        description: "Complete Node.js development guide for beginners and advanced developers",
        seller: "BookWorld",
        ratingsAverage: 4.5,
        ratingsQuantity: 15,
        stock: 20
      },
      {
        name: "Wireless Headphones",
        price: 2500,
        category: "Electronics",
        description: "Premium noise-cancelling wireless headphones with 30-hour battery",
        seller: "AudioGear",
        ratingsAverage: 4.6,
        ratingsQuantity: 30,
        stock: 12
      },
      {
        name: "Yoga Mat Premium",
        price: 890,
        category: "Sports",
        description: "Non-slip yoga mat with carrying strap and alignment markers",
        seller: "FitnessPro",
        ratingsAverage: 4.3,
        ratingsQuantity: 18,
        stock: 25
      },
      {
        name: "Coffee Maker Deluxe",
        price: 2200,
        category: "Home Appliances",
        description: "Automatic coffee maker with built-in grinder and milk frother",
        seller: "KitchenStore",
        ratingsAverage: 4.7,
        ratingsQuantity: 22,
        stock: 8
      },
      {
        name: "Designer Backpack",
        price: 1800,
        category: "Fashion",
        description: "Stylish leather backpack with laptop compartment and USB charging",
        seller: "FashionHub",
        ratingsAverage: 4.4,
        ratingsQuantity: 12,
        stock: 15
      },
      {
        name: "Digital Camera",
        price: 15000,
        category: "Photography",
        description: "Professional DSLR camera with 4K video recording",
        seller: "PhotoShop",
        ratingsAverage: 4.9,
        ratingsQuantity: 8,
        stock: 3
      },
      {
        name: "Smart Watch",
        price: 3500,
        category: "Electronics",
        description: "Fitness tracker with heart rate monitor and GPS",
        seller: "TechStore",
        ratingsAverage: 4.2,
        ratingsQuantity: 35,
        stock: 18
      },
      {
        name: "Running Shoes",
        price: 1200,
        category: "Sports",
        description: "Professional running shoes with advanced cushioning technology",
        seller: "SportsPlus",
        ratingsAverage: 4.5,
        ratingsQuantity: 28,
        stock: 30
      },
      {
        name: "Bluetooth Speaker",
        price: 800,
        category: "Electronics",
        description: "Portable waterproof speaker with 360-degree sound",
        seller: "AudioGear",
        ratingsAverage: 4.1,
        ratingsQuantity: 20,
        stock: 22
      },
      {
        name: "Winter Jacket",
        price: 2800,
        category: "Clothing",
        description: "Warm waterproof jacket with removable hood",
        seller: "FashionHub",
        ratingsAverage: 4.6,
        ratingsQuantity: 16,
        stock: 10
      },
      {
        name: "Desk Lamp",
        price: 450,
        category: "Home Appliances",
        description: "LED desk lamp with adjustable brightness and color temperature",
        seller: "HomeDecor",
        ratingsAverage: 4.0,
        ratingsQuantity: 14,
        stock: 35
      }
    ];
    
    console.log(`Adding ${sampleProducts.length} products to MongoDB...`);
    
    Product.insertMany(sampleProducts)
      .then(() => {
        console.log('Sample products added successfully!');
        process.exit(0);
      })
      .catch(err => {
        console.log('Error adding products:', err);
        process.exit(1);
      });
  })
  .catch(err => {
    console.log('DB connection error:', err);
    process.exit(1);
  });
