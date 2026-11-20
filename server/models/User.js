const mongoose = require('mongoose');

const USER_ROLES = ['student', 'instructor', 'admin'];

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    minlength: 3,
    maxlength: 80
  },
  displayName: {
    type: String,
    trim: true,
    maxlength: 120,
    default: ''
  },
  passwordHash: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: String,
    enum: USER_ROLES,
    default: 'student',
    required: true
  }
}, { timestamps: true });

userSchema.set('toJSON', {
  transform(document, result) {
    delete result.passwordHash;
    delete result.__v;
    return result;
  }
});

userSchema.statics.roles = USER_ROLES;

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
