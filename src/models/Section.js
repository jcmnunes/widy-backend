const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
// const Joi = require('joi');
const { taskSchema } = require('./Task');

const sectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    tasks: [taskSchema],
  },
  /* gives us "createdAt" and "updatedAt" fields automatically */
  { timestamps: true },
);

// The MongoDBErrorHandler plugin gives us a better 'unique' error
sectionSchema.plugin(mongodbErrorHandler);

const Section = mongoose.model('Section', sectionSchema);

// function validateUser(user) {
//   const schema = {
//     name: Joi.string()
//       .min(5)
//       .max(50)
//       .required(),
//     email: Joi.string()
//       .min(5)
//       .max(255)
//       .required()
//       .email(),
//     password: Joi.string()
//       .min(5)
//       .max(255)
//       .required(),
//   };

//   return Joi.validate(user, schema);
// }

exports.Section = Section;
exports.sectionSchema = sectionSchema;
// exports.validate = validateUser;
