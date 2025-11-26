import Card from "./card.model.js";

export const createCard = async (data) => {
  const card = new Card(data);
  const savedCard = await  card.save();
  return savedCard;
};

export const getCard = async (condition) => {
  return await Card.findOne(condition).select("-list");
};

export const getDeleteCard = async (condition) => {
  return await Card.findOne(condition).select("-attachments -color -status -priority -checkLists -attachments -list");
};

export const updateCard = async (condition,data) => {
  return await Card.updateOne(condition,{$set:data});
};

export const deleteCard = async (condition) => {
  return await Card.deleteOne(condition);
};