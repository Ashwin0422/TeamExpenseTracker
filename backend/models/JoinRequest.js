const mongoose = require('mongoose');
const JoinRequestSchema = new mongoose.Schema({
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
});
module.exports = mongoose.model('JoinRequest', JoinRequestSchema);


JoinRequestSchema.index({ userId: 1});
