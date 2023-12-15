const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: { value: true, message: 'Поле является обязвтельным' },
    minlength: [2, 'Минимальная длинна 2 символа'],
    maxlength: [30, 'Минимальная длинна 30 символов'],
  },

  link: {
    type: String,
    required: { value: true, message: 'Поле является обязвтельным' },
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },

  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      default: [],
      ref: 'user',
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
