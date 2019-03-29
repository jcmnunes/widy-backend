const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const Joi = require('joi');
const { sectionSchema } = require('./Section');

const daySchema = new mongoose.Schema(
  {
    day: {
      type: String,
      unique: true,
      required: true,
    },
    sections: [sectionSchema],
    belongsTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  /* gives us "createdAt" and "updatedAt" fields automatically */
  { timestamps: true },
);

// The MongoDBErrorHandler plugin gives us a better 'unique' error
daySchema.plugin(mongodbErrorHandler);

const Day = mongoose.model('Day', daySchema);

function validateDay(dayData) {
  const schema = {
    day: Joi.date().iso(),
  };

  return Joi.validate(dayData, schema);
}

exports.Day = Day;
exports.validate = validateDay;
