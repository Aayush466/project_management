import Card from "./card.model.js";

export const createCard = async (data) => {
  const card = new Card(data);
  const savedCard = await  card.save();
  return savedCard;
};

export const getCard = async (condition) => {
  return await Card.findOne(condition).populate('list');
};

export const updateCard = async (condition,data) => {
  return await Card.updateOne(condition,{$set:data});
};

export const deleteCard = async (condition) => {
  return await Card.deleteOne(condition);
};