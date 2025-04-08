const { default: mongoose } = require('mongoose');
const Tour = require('./tourModel');

const reviewScema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty'],
      trim: true,
      minLength: [2, 'Should contain minimum 2 characters'],
      maxLength: [1000, 'Review is too big'],
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belog to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belog to a user'],
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    id: false,
  },
);

reviewScema.index({ tour: 1, user: 1 }, { unique: true });

reviewScema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'user',
  //   select: 'name photo',
  // }).populate({
  //   path: 'tour',
  //   select: 'name',
  // });

  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

reviewScema.statics.calcAverageRatings = async function (tourId) {
  console.log('tourId', tourId);
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].nRating,
    });
  } else {
    // If no reviews exist, set to default values
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 0,
      ratingsQuantity: 4.5,
    });
  }
};

reviewScema.post('save', function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.tour);
});

// Fix the middleware for findOneAndUpdate and findOneAndDelete
reviewScema.pre(/^findOneAnd/, async function (next) {
  // Store the query conditions to use later
  const review = await this.model.findOne(this.getQuery());
  this.tourId = review.tour;
  next();
});

reviewScema.post(/^findOneAnd/, async function () {
  if (this.tourId) {
    await this.model.calcAverageRatings(this.tourId);
  }
});

const Review = mongoose.model('Review', reviewScema);

module.exports = Review;
