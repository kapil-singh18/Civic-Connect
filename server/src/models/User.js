import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, 'Invalid email address']
    },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ['citizen', 'admin'], default: 'citizen' },
    city: { type: String, default: 'Bhopal', trim: true },
    area: { type: String, default: '', trim: true },
    points: { type: Number, default: 0 },
    reportsSubmitted: { type: Number, default: 0 },
    refreshTokenHash: { type: String, select: false }
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', userSchema);
