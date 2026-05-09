const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A product must have a name'],
    trim: true,
    maxlength: [100, 'A product name must have less than or equal to 100 characters'],
    minlength: [3, 'A product name must have at least 3 characters']
  },
  price: {
    type: Number,
    required: [true, 'A product must have a price'],
    min: [0, 'Price must be above 0'],
    max: [1000000, 'Price must be below 1,000,000']
  },
  category: {
    type: String,
    required: [true, 'A product must have a category'],
    enum: {
      values: ['Electronics', 'Books', 'Clothing', 'Sports', 'Home Appliances', 'Accessories', 'Fashion', 'Photography', 'Other'],
      message: 'Category must be one of: Electronics, Books, Clothing, Sports, Home Appliances, Accessories, Fashion, Photography, Other'
    }
  },
  description: {
    type: String,
    trim: true,
    maxlength: [50, 'Description must have less than or equal to 50 characters'],
    default: 'No description available'
  },
  seller: {
    type: String,
    required: [true, 'A product must have a seller'],
    trim: true,
    maxlength: [50, 'Seller name must have less than or equal to 50 characters'],
    minlength: [2, 'Seller name must have at least 2 characters']
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
    set: val => Math.round(val * 10) / 10 // Round to 1 decimal place
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  stock: {
    type: Number,
    required: [true, 'A product must have stock quantity'],
    min: [0, 'Stock must be above 0'],
    default: 1
  },
  productSlug: {
    type: String,
    unique: true
  },
  postedDate: {
    type: Date,
    default: Date.now
  },
  premiumProducts: {
    type: Boolean,
    default: false
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function(val) {
        return val < this.price;
      },
      message: 'Discount price {{VALUE}} should be below regular price'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for price with currency
productSchema.virtual('priceCurrency').get(function() {
  return `₱${this.price.toLocaleString()}`;
});

// Virtual for days posted
productSchema.virtual('daysPosted').get(function() {
  const currentDate = new Date();
  const postedDate = new Date(this.postedDate);
  const diffTime = Math.abs(currentDate - postedDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Index for better query performance
productSchema.index({ price: 1, ratingsAverage: -1 });
productSchema.index({ category: 1 });
productSchema.index({ seller: 1 });

// Document Middleware
productSchema.pre('save', function() {
  // Generate consistent slug for duplicate testing
  if (!this.productSlug) {
    this.productSlug = slugify(this.name, { upper: true });
  }
});

productSchema.post('save', function(doc) {
  console.log(doc);
});

// Query Middleware
// productSchema.pre(/^find/, function(next) {
//   this.find({ premiumProducts: { $ne: true } });
//   this.start = Date.now();
//   next();
// });

// productSchema.post(/^find/, function(docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds!`);
//   next();
// });

// Aggregate Middleware
// productSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({ $match: { premiumProducts: { $ne: true } } });
//   next();
// });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
