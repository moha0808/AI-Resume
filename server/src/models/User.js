const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format'],
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  photo: {
    type: String,
    default: '',
  },
  college: String,
  degree: String,
  graduationYear: Number,
  skills: [String],
  github: String,
  linkedin: String,
  phone: String,
  location: String,
  bio: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  refreshToken: String,
  googleId: String,
  profileCompletion: {
    type: Number,
    default: 0,
  },
  lastLogin: Date,
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Calculate profile completion
userSchema.methods.calculateProfileCompletion = function () {
  const fields = ['name', 'email', 'photo', 'college', 'degree', 'skills', 'github', 'linkedin', 'bio'];
  const filled = fields.filter(f => {
    const val = this[f];
    return val && (Array.isArray(val) ? val.length > 0 : val !== '');
  });
  this.profileCompletion = Math.round((filled.length / fields.length) * 100);
};

module.exports = mongoose.model('User', userSchema);
