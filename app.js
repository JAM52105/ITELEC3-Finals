const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');

const sanitizeNoSql = (obj) => {
  if (!obj || typeof obj !== 'object') return;
  Object.keys(obj).forEach((key) => {
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
    } else if (typeof obj[key] === 'object') {
      sanitizeNoSql(obj[key]);
    }
  });
};

// Custom XSS sanitizer - works in-place to support Express v5
const xssClean = (req, res, next) => {
  const sanitize = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].replace(/<[^>]*>/g, '');
      } else if (typeof obj[key] === 'object') {
        sanitize(obj[key]);
      }
    });
  };
  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  next();
};
const productController = require('./controllers/productControllerMongo');
const productRouter = require('./routes/productRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use((req, res, next) => {
  console.log('SANITIZE MIDDLEWARE: body=', req.body ? true : false, 'query=', req.query ? true : false, 'params=', req.params ? true : false);
  sanitizeNoSql(req.body);
  sanitizeNoSql(req.params);
  sanitizeNoSql(req.query);
  next();
});

// Data sanitization against XSS
app.use(xssClean);

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'price',
      'ratingsQuantity',
      'ratingsAverage',
      'stock',
    ],
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app
  .route('/')
  .get(productController.getHomePage);

app
  .route('/overview')
  .get(productController.getOverviewPage);

app
  .route('/item')
  .get(productController.getItemPage);

app.use('/api/v1/products', (req, res, next) => {
  console.log('Request to /api/v1/products:', req.method, req.url);
  next();
}, productRouter);

// User routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/v1/users', userRoutes);

app
  .route('/api')
  .get(productController.getAPIData);

app
  .route('/add-product')
  .get(productController.getAddProductPage)
  .post(productController.createProductForm);

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
