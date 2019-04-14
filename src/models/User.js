const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
      minlength: 5,
      maxlength: 255,
    },
    name: {
      type: String,
      trim: true,
      minlength: 5,
      maxlength: 50,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  /* gives us "createdAt" and "updatedAt" fields automatically */
  { timestamps: true },
);

// The MongoDBErrorHandler plugin gives us a better 'unique' error
userSchema.plugin(mongodbErrorHandler);

userSchema.methods.generateAuthToken = function(res, days = 60) {
  const token = jwt.sign({ id: this._id }, process.env.APP_SECRET, { expiresIn: `${days}d` });
  res.cookie(process.env.COOKIE_KEY, token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * days,
  });
};

const User = mongoose.model('User', userSchema);

exports.User = User;
