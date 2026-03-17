import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String },
    provider: { type: String, enum: ['local', 'google'], default: 'local' },
    providerId: { type: String },
    avatar: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);

