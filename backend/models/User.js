const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, 
  googleId: { type: String, default: null },
  picture: { type: String, default: null },
  authProvider: { type: String, enum: ["local", "google"], default: "local" },

  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }]
}, { timestamps: true });

UserSchema.index({ googleId: 1});

UserSchema.pre('save', function (next) {
  if (this.authProvider === 'local' && !this.password) {
    return next(new Error('Password is required for local users'));
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);