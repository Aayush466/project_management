import User from "./user.model.js";

export const createUser = async (data) => {
  const user = new User(data);
  const savedUser = await user.save();

  // Remove confidential fields before returning
  const {
    password,
    refreshToken,
    resetExpiresAt,
    __v,
    reset,
    expiresOtpAt,
    hashedCode,
    ...safeUser
  } = savedUser.toObject();

  return safeUser;
};

export const getAllUsers = async () => {
  return await User.find()
    .select(
      "-password -refreshToken -resetExpiresAt -__v -reset -expiresOtpAt -hashedCode"
    )
    .populate({
      path: "myUsers.user",
      select:
        "-password -refreshToken -resetExpiresAt -__v -reset -expiresOtpAt -hashedCode",
    })
    .populate({
      path: "rejectedUsers.user",
      select:
        "-password -refreshToken -resetExpiresAt -__v -reset -expiresOtpAt -hashedCode",
    })
    .populate({
      path: "rejectedAdmins.admin",
      select:
        "-password -refreshToken -resetExpiresAt -__v -reset -expiresOtpAt -hashedCode",
    })
    .populate({
      path: "invitedUsers.user",
      select:
        "-password -refreshToken -resetExpiresAt -__v -reset -expiresOtpAt -hashedCode",
    })
    .populate({
      path: "invitations.admin",
      select:
        "-password -refreshToken -resetExpiresAt -__v -reset -expiresOtpAt -hashedCode",
    })
    .populate("myBoards");
};

export const getUser = async (id) => {
  return await User.findOne({ _id: id })
    .select(
      "-reset -password -access -hashedCode -__v -expiresOtpAt -refreshToken -verified"
    )
    .populate({path:"myBoards",select:"-lists -createdBy -trashCards -trashLists"})
    .populate({path:"trashBoards",select:"-lists -createdBy -trashCards -trashLists"});
};

export const deleteUser = async (data) => {
  return await User.deleteOne(data);
};
