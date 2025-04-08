const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

exports.setTourAndUserIds = (req, res, next) => {
  if (!req.body.tour && req.params?.tourId) req.body.tour = req.params.tourId;
  if (!req.body.user && req.user?.id) req.body.user = req.user.id;
  if (req.params?.tourId) {
    req.query.tour = req.params.tourId;
  }

  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.createReview = factory.createOne(Review); // 'review', 'rating'
exports.getReview = factory.getOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
