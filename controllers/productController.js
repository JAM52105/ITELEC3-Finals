const fs = require('fs');
const path = require('path');
const replaceTemplate = require('../modules/replaceTemplate');

const productsPath = path.join(__dirname, '..', 'data', 'products.json');

const products = JSON.parse(
  fs.readFileSync(productsPath, 'utf-8')
);

const tempOverview = fs.readFileSync(path.join(__dirname, '..', 'public', 'template-overview.html'), 'utf-8');
const tempCard = fs.readFileSync(path.join(__dirname, '..', 'public', 'template-card.html'), 'utf-8');
const tempItem = fs.readFileSync(path.join(__dirname, '..', 'public', 'template-item.html'), 'utf-8');

exports.checkID = (req, res, next, val) => {
  const id = val * 1;
  const product = products.find(el => el.id === id);
  if (!product) {
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
  res.status(200).sendFile(path.join(__dirname, '..', 'public', 'index.html'));
};

exports.getOverviewPage = (req, res) => {
  res.status(200).set('Content-Type', 'text/html');
  const cardsHtml = products.map(el => replaceTemplate(tempCard, el)).join('');
  const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
  res.send(output);
};

exports.getItemPage = (req, res) => {
  const id = req.query.id;
  const format = req.query.format;
  const product = products.find(el => el.id === +id);

  if (!product) {
    if (format === 'json') {
      res.status(404).set('Content-Type', 'application/json');
      res.send(JSON.stringify({ status: 'fail', message: 'Product not found' }));
    } else {
      res.status(404).set('Content-Type', 'text/html');
      res.send('<h1>Product not found</h1>');
    }
    return;
  }

  if (format === 'json') {
    res.status(200).set('Content-Type', 'application/json');
    res.send(JSON.stringify({ status: 'success', data: { product } }));
  } else {
    res.status(200).set('Content-Type', 'text/html');
    const output = replaceTemplate(tempItem, product);
    res.send(output);
  }
};

exports.getAPIData = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products
    }
  });
};

exports.getAllProducts = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products
    }
  });
};

exports.getProduct = (req, res) => {
  const id = req.params.id * 1;
  const product = products.find(el => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
};

exports.createProduct = (req, res) => {
  const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;
  const newProduct = Object.assign({ id: newId }, req.body);

  products.push(newProduct);

  fs.writeFile(
    `${__dirname}/../data/products.json`,
    JSON.stringify(products, null, 2),
    err => {
      res.status(201).json({
        status: 'success',
        data: {
          product: newProduct
        }
      });
    }
  );
};

exports.updateProduct = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};

exports.deleteProduct = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};

exports.getAddProductPage = (req, res) => {
  const filePath = path.join(__dirname, '..', 'public', 'add-product.html');
  res.status(200).sendFile(filePath);
};


exports.createProductForm = (req, res) => {
  const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;
  const newProduct = Object.assign({ id: newId }, req.body);

  products.push(newProduct);

  fs.writeFile(
    productsPath,
    JSON.stringify(products, null, 2),
    err => {
      if (err) {
        return res.status(500).send('Error saving product');
      }
      res.redirect('/overview');
    }
  );
};
