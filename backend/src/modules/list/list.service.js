import List from "./list.model.js";

export const createList = async (data) => {
  const list = new List(data);
  const savedList = await  list.save();

  return savedList;
};

export const getList = async (condition) => {
  return await List.findOne(condition).populate('board').populate("cards");
};

export const updateList = async (condition,data) => {
  return await List.updateOne(condition,{$set:data});
};