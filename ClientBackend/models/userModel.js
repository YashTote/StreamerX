const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const callSchema = new Schema({
  userId: {type: String},
  key: {type: String},
  start: { type: Date},
  end: { type: Date},
});

const CallDetail = mongoose.model('callDetail',callSchema);
module.exports = CallDetail;