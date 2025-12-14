const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  totalPages: { type: Number, required: true },
  currentPage: { type: Number, default: 0 },
  genre: { 
    type: String, 
    required: true,
    enum: ['Fiction', 'Sci-Fi', 'Fantasy', 'Romance', 'Mystery', 'History', 'Biography', 'Self-Help'] 
  },
  status: { 
    type: String, 
    default: 'to-read',
    enum: ['reading', 'to-read', 'finished', 'dnf']
  },
  rating: { type: Number, default: null },
  coverUrl: { type: String },
  dateAdded: { type: Date, default: Date.now },
  dateFinished: { type: Date },
  review: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

// При відправці JSON перетворюємо _id (mongo) в id (твоя програма)
BookSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

module.exports = mongoose.model('Book', BookSchema);