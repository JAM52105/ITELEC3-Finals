const fs = require('fs');
const path = require('path');
const replaceTemplate = require('../modules/replaceTemplate');
const Product = require('../models/productModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const tempOverview = fs.readFileSync(`${__dirname}/../public/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/../public/template-card.html`, 'utf-8');
const tempItem = fs.readFileSync(`${__dirname}/../public/template-item.html`, 'utf-8');

exports.checkID = (req, res, next, val) => {
  console.log(`Product id is: ${val}`);
  if (req.params.id * 1 > products.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price'
    });
  }
  next();
};

exports.getHomePage = (req, res) => {
  res.status(200).sendFile(`${__dirname}/../public/index.html`);
};

exports.getOverviewPage = catchAsync(async (req, res) => {
  const products = await Product.find();
  const cardsHtml = products.map(el => replaceTemplate(tempCard, el)).join('');
  const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
  res.status(200).set('Content-Type', 'text/html').send(output);
});

exports.getItemPage = catchAsync(async (req, res) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }
  
  // Check if format=json is requested
  if (req.query.format === 'json') {
    return res.status(200).json({
      status: 'success',
      data: {
        product
      }
    });
  }
  
  // Otherwise return HTML page
  const output = replaceTemplate(tempItem, product);
  res.status(200).set('Content-Type', 'text/html').send(output);
});

exports.getAPIData = catchAsync(async (req, res) => {
  // Use APIFeatures to handle query parameters like limit, sort, etc.
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  
  const products = await features.query;

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products
    }
  });
});

exports.aliasTopProducts = (req, res, next) => {
  req.query.limit = '3';
  req.query.sort = 'price,ratingsAverage';
  req.query.fields = 'name,price,ratingsAverage,category,seller';
  next();
};

exports.getAllProducts = catchAsync(async (req, res) => {
  // EXECUTE QUERY
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  
  const products = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products
    }
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});

exports.createProduct = catchAsync(async (req, res) => {
  const newProduct = await Product.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      product: newProduct
    }
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  console.log('deleteProduct called for ID:', req.params.id);
  
  const product = await Product.findByIdAndDelete(req.params.id);
  
  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }
  
  console.log('Product deleted:', product.name);
  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getAddProductPage = (req, res) => {
  const filePath = path.join(__dirname, '..', 'public', 'add-product.html');
  res.status(200).sendFile(filePath);
};

exports.createProductForm = catchAsync(async (req, res) => {
  console.log('createProductForm called');
  console.log('req.body:', req.body);
  
  const newProduct = await Product.create(req.body);
  console.log('Product created:', newProduct);
  
  res.redirect('/overview');
});

exports.getProductCategoryStats = catchAsync(async (req, res) => {
  const stats = await Product.aggregate([
    {
      $match: { price: { $lt: 1000 } }
    },
    {
      $group: {
        _id: { $toUpper: '$category' },
        numProducts: { $sum: 1 },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
  ]);
  
  res.status(200).json({
    status: "success",
    data: {
      stats
    }
  });
});
