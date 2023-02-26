const User = require("../models/user");

const findUser = async (dataByFind) => {
  const user = await User.findOne(dataByFind);
  return user;
};

const singUpUser = async (data) => {
  const createdUser = await User.create(data);
  return createdUser;
};

const loginUser = async (id, token) => {
  const loginedUser = await User.findByIdAndUpdate(id, {
    $set: { token },
  });
  return loginedUser;
};

const logoutUser = async (id) => {
  await User.findByIdAndUpdate(id, { $set: { token: null } });
};

const updateSubscriptionUser = async (id, subscription) => {
  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      $set: { subscription },
    },
    {
      new: true,
    }
  );
  return updatedUser;
};

const updateAvatar = async (id, avatarURL) => {
  await User.findByIdAndUpdate(
    id,
    {
      $set: { avatarURL },
    },
    {
      new: true,
    }
  );
};

module.exports = {
  findUser,
  singUpUser,
  loginUser,
  logoutUser,
  updateSubscriptionUser,
  updateAvatar,
};
