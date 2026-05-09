const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(() => console.log('DB connection successful!'));

const sampleProducts = [
  {
    name: "Basic T-Shirt",
    price: 299,
    category: "Clothing",
    description: "Comfortable cotton t-shirt",
    seller: "Fashion Store",
    ratingsAverage: 4.2,
    ratingsQuantity: 15,
    stock: 50,
    premiumProducts: false,
    postedDate: new Date('2024-01-15'),
    priceDiscount: 250
  },
  {
    name: "Wireless Mouse",
    price: 450,
    category: "Electronics",
    description: "Ergonomic wireless mouse",
    seller: "Tech Hub",
    ratingsAverage: 4.5,
    ratingsQuantity: 23,
    stock: 30,
    premiumProducts: false,
    postedDate: new Date('2024-01-20'),
    priceDiscount: 399
  },
  {
    name: "JavaScript Guide",
    price: 850,
    category: "Books",
    description: "Complete JavaScript guide",
    seller: "Book World",
    ratingsAverage: 4.8,
    ratingsQuantity: 42,
    stock: 25,
    premiumProducts: false,
    postedDate: new Date('2024-02-01'),
    priceDiscount: 750
  },
  {
    name: "Yoga Mat",
    price: 650,
    category: "Sports",
    description: "Non-slip yoga mat",
    seller: "Sports Plus",
    ratingsAverage: 4.3,
    ratingsQuantity: 18,
    stock: 40,
    premiumProducts: false,
    postedDate: new Date('2024-02-10'),
    priceDiscount: 550
  },
  {
    name: "Coffee Maker",
    price: 950,
    category: "Home Appliances",
    description: "Automatic coffee maker",
    seller: "Home Store",
    ratingsAverage: 4.6,
    ratingsQuantity: 31,
    stock: 15,
    premiumProducts: false,
    postedDate: new Date('2024-02-15'),
    priceDiscount: 850
  },
  {
    name: "Denim Jeans",
    price: 799,
    category: "Fashion",
    description: "Classic denim jeans",
    seller: "Fashion Store",
    ratingsAverage: 4.4,
    ratingsQuantity: 27,
    stock: 35,
    premiumProducts: false,
    postedDate: new Date('2024-02-20'),
    priceDiscount: 699
  },
  {
    name: "Smartphone Case",
    price: 150,
    category: "Accessories",
    description: "Protective phone case",
    seller: "Tech Hub",
    ratingsAverage: 4.1,
    ratingsQuantity: 12,
    stock: 60,
    premiumProducts: false,
    postedDate: new Date('2024-03-01'),
    priceDiscount: 120
  },
  {
    name: "Camera Lens",
    price: 1200,
    category: "Photography",
    description: "Professional camera lens",
    seller: "Photo Pro",
    ratingsAverage: 4.9,
    ratingsQuantity: 8,
    stock: 10,
    premiumProducts: true,
    postedDate: new Date('2024-03-05')
  },
  {
    name: "Running Shoes",
    price: 899,
    category: "Sports",
    description: "Professional running shoes",
    seller: "Sports Plus",
    ratingsAverage: 4.7,
    ratingsQuantity: 35,
    stock: 20,
    premiumProducts: false,
    postedDate: new Date('2024-03-10'),
    priceDiscount: 799
  },
  {
    name: "Laptop Stand",
    price: 550,
    category: "Electronics",
    description: "Adjustable laptop stand",
    seller: "Tech Hub",
    ratingsAverage: 4.3,
    ratingsQuantity: 19,
    stock: 25,
    premiumProducts: false,
    postedDate: new Date('2024-03-15'),
    priceDiscount: 450
  }
];

const importData = async () => {
  try {
    await Product.create(sampleProducts);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Product.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
