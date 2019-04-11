const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const Joi = require('joi');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      minlength: 1,
      maxlength: 50,
    },
    notes: {
      type: {}, // Setting String in here throws an error... This is a JSON string.
    },
  },
  /* gives us "createdAt" and "updatedAt" fields automatically */
  { timestamps: true },
);

// The MongoDBErrorHandler plugin gives us a better 'unique' error
taskSchema.plugin(mongodbErrorHandler);

const Task = mongoose.model('Task', taskSchema);

function validateTask(task) {
  const schema = {
    title: Joi.string()
      .min(1)
      .max(50)
      .required(),
    notes: Joi.string().allow(''),
  };

  return Joi.validate(task, schema);
}

exports.Task = Task;
exports.taskSchema = taskSchema;
exports.validate = validateTask;
