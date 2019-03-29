const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
// const Joi = require('joi');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      minlength: 5,
      maxlength: 50,
    },
  },
  /* gives us "createdAt" and "updatedAt" fields automatically */
  { timestamps: true },
);

// The MongoDBErrorHandler plugin gives us a better 'unique' error
taskSchema.plugin(mongodbErrorHandler);

const Task = mongoose.model('Task', taskSchema);

// function validateTask(user) {
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

exports.Task = Task;
exports.taskSchema = taskSchema;
// exports.validate = validateUser;
