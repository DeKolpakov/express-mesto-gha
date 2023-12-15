const Card = require('../models/card');
const {
  CreatedStatus,
  BadRequestStatus,
  NotFoundStatus,
  InternalServerStatus,
} = require('../utils/ErrorStatus');

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (error) {
    return res.status(InternalServerStatus).send({ message: 'Ошибка сервера' });
  }
};

module.exports.createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    return res.status(CreatedStatus).json(card);
  } catch (error) {
    switch (error.name) {
      case 'ValidationError':
        return res.status(BadRequestStatus).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
      default:
        return res
          .status(InternalServerStatus)
          .send({ message: 'Ошибка сервера' });
    }
  }
};

module.exports.deleteCard = async (req, res) => {
  try {
    const deletedCard = await Card.findByIdAndDelete(req.params.cardId);
    if (deletedCard) {
      return res.send({ message: 'Карточка успешно удалена.' });
    }
    return res
      .status(NotFoundStatus)
      .send({ message: 'Карточка с указанным _id не найдена.' });
  } catch (error) {
    switch (error.name) {
      case 'CastError':
        return res.status(BadRequestStatus).send({
          message: 'Переданы некорректные данные при удалении карточки.',
        });
      default:
        return res
          .status(InternalServerStatus)
          .send({ message: 'Ошибка сервера' });
    }
  }
};

module.exports.likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (card) {
      return res.send({ message: 'Лайк добавлен' });
    }
    return res
      .status(NotFoundStatus)
      .send({ message: 'Передан несуществующий _id карточки.' });
  } catch (error) {
    switch (error.name) {
      case 'CastError':
        return res.status(BadRequestStatus).send({
          message: 'Переданы некорректные данные для постановки лайка.',
        });
      default:
        return res
          .status(InternalServerStatus)
          .send({ message: 'Ошибка сервера' });
    }
  }
};

module.exports.dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (card) {
      return res.send({ message: 'Лайк удален' });
    }
    return res
      .status(NotFoundStatus)
      .send({ message: 'Передан несуществующий _id карточки.' });
  } catch (error) {
    switch (error.name) {
      case 'CastError':
        return res.status(BadRequestStatus).send({
          message: 'Переданы некорректные данные для постановки лайка.',
        });
      default:
        return res
          .status(InternalServerStatus)
          .send({ message: 'Ошибка сервера' });
    }
  }
};
