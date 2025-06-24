const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  count: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

counterSchema.statics.incrementCounter = async function(counterName) {
  const counter = await this.findOneAndUpdate(
    { name: counterName },
    { $inc: { count: 1 } },
    { upsert: true, new: true }
  );
  return counter.count;
};

counterSchema.statics.getCount = async function(counterName) {
  const counter = await this.findOne({ name: counterName });
  return counter ? counter.count : 0;
};

module.exports = mongoose.model('Counter', counterSchema);
