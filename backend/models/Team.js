const mongoose = require('mongoose');
const TeamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  leaderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  budget: { type: Number, required: true },
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  teamCode: { type: String, unique: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});
module.exports = mongoose.model('Team', TeamSchema);

TeamSchema.index({ leaderId: 1, startDate: -1 });