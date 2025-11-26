import List from "./list.model.js";

export const createList = async (data) => {
  const list = new List(data);
  const savedList = await  list.save();

  return savedList;
};

export const getList = async (condition) => {
  return await List.findOne(condition).select("-board").populate({path:"cards",select:"-color -status -priority -checkLists -attachments -list"});
};

export const getDeleteList = async (condition) => {
  return await List.findOne(condition).select("-board").populate({path:"cards",select:"-attachments -color -status -priority -checkLists -attachments -list"});
};

export const getDeletePermanentList = async (condition) => {
  return await List.findOne(condition).populate("cards");
};

export const updateList = async (condition,data) => {
  return await List.updateOne(condition,{$set:data});
};