const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const fs = require("fs").promises;
const path = require("path");
const { ctrlWrapper, HttpError } = require("../helpers");
const {
  findUser,
  singUpUser,
  loginUser,
  logoutUser,
  updateSubscriptionUser,
  updateAvatar,
} = require("../services/usersService");

const { SECRET_KEY } = process.env;
const avatarDir = path.join(__dirname, "../", "public", "avatars");

const singUpController = async (req, res) => {
  const { email, password } = req.body;
  const user = await findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email, { s: "250" });

  const result = await singUpUser({ email, password: hashPassword, avatarURL });

  res.status(201).json({
    user: { email: result.email, subscription: result.subscription },
  });
};

const loginController = async (req, res) => {
  const { email, password } = req.body;
  const user = await findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const comparePass = await bcrypt.compare(password, user.password);
  if (!comparePass) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

  const loginedUser = await loginUser(user._id, token);

  res.json({
    token,
    user: {
      email: loginedUser.email,
      subscription: loginedUser.subscription,
      avatarURL: loginedUser.avatarURL,
    },
  });
};

const logoutController = async (req, res) => {
  await logoutUser(req.user._id);
  res.status(204);
};

const currentController = async (req, res) => {
  const { email, subscription, avatarURL } = req.user;

  res.json({
    user: {
      email,
      subscription,
      avatarURL,
    },
  });
};

const updateSubscriptionController = async (req, res) => {
  const { _id } = req.user;
  const { sub } = req.body;

  const { email, subscription } = await updateSubscriptionUser(_id, sub);

  res.json({
    user: {
      email,
      subscription,
      avatarURL,
    },
  });
};
const updateAvatarController = async (req, res) => {
  if (!req.file) {
    throw HttpError(400, "avatar must be exist");
  }

  const { path: tmpUpload, originalname } = req.file;
  const { _id } = req.user;

  const img = await Jimp.read(tmpUpload);
  await img.resize(250, 250);
  await img.writeAsync(tmpUpload);

  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarDir, filename);

  await fs.rename(tmpUpload, resultUpload);

  const avatarURL = path.join("avatars", filename);
  await updateAvatar(_id, avatarURL);

  res.json({
    avatarURL,
  });
};

module.exports = {
  singUpController: ctrlWrapper(singUpController),
  loginController: ctrlWrapper(loginController),
  logoutController: ctrlWrapper(logoutController),
  currentController: ctrlWrapper(currentController),
  updateSubscriptionController: ctrlWrapper(updateSubscriptionController),
  updateAvatarController: ctrlWrapper(updateAvatarController),
};
