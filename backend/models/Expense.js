const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  teamId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title:    String,
  amount:   Number,
  category: String,
  invoice: {
    url:          String,          
    publicId:     String,         
    resourceType: String,          
    originalName: String,
  },
  createdAt: { type: Date, default: Date.now },
});

ExpenseSchema.index({ teamId: 1, createdAt: -1 });

module.exports = mongoose.model('Expense', ExpenseSchema);

