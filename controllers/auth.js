const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { REFRESH_SECRET_KEY, BASE_URL } = process.env;
const gravatar = require("gravatar");
const Jimp = require("jimp");
const fs = require("fs").promises;
const path = require("path");
const {
  ctrlWrapper,
  HttpError,
  createTokens,
  sendEmail,
} = require("../helpers");
const {
  findUser,
  singUpUser,
  loginUser,
  logoutUser,
  updateSubscriptionUser,
  updateAvatar,
  refreshUser,
  verifyUser,
} = require("../services/usersService");
const { nanoid } = require("nanoid");

const avatarDir = path.join(__dirname, "../", "public", "avatars");

const singUpController = async (req, res) => {
  const { email, password } = req.body;
  const user = await findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email, { s: "250" });

  const verificationCode = nanoid();

  const result = await singUpUser({
    email,
    password: hashPassword,
    avatarURL,
    verificationCode,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationCode}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail)
    .then((email) => console.log(email))
    .catch(console.log);

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

  if (!user.verify) {
    throw HttpError(401, "Email not verify");
  }

  const comparePass = await bcrypt.compare(password, user.password);
  if (!comparePass) {
    throw HttpError(401, "Email or password is wrong");
  }

  const tokens = createTokens(user._id);

  const loginedUser = await loginUser(user._id, tokens);

  res.json({
    ...tokens,
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

const refreshController = async (req, res) => {
  const { refreshToken: token } = req.body;
  let tokens = {};
  let userId = null;

  try {
    const { id } = jwt.verify(token, REFRESH_SECRET_KEY);
    const user = await findUser({ _id: id });
    if (!user || user.refreshToken !== token) {
      throw HttpError(403);
    }
    userId = id;
    tokens = createTokens(id);
  } catch (error) {
    throw HttpError(403, error.message);
  }

  await refreshUser(userId, tokens);
  res.json({
    ...tokens,
  });
};

const verifyController = async (req, res) => {
  const { verificationCode } = req.params;

  const user = await findUser({ verificationCode });
  if (!user) {
    throw HttpError(404, "User not found");
  }

  await verifyUser(user._id);

  res.json({
    message: "Verify success",
  });
};

const resendVerifyEmailController = async (req, res) => {
  const { email } = req.body;
  const user = await findUser({ email });
  if (!user) {
    throw HttpError(404, "Email not found");
  }

  if (user.verify) {
    throw HttpError(404, "Email already verify");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationCode}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: "Email send success",
  });
};

module.exports = {
  singUpController: ctrlWrapper(singUpController),
  loginController: ctrlWrapper(loginController),
  logoutController: ctrlWrapper(logoutController),
  currentController: ctrlWrapper(currentController),
  updateSubscriptionController: ctrlWrapper(updateSubscriptionController),
  updateAvatarController: ctrlWrapper(updateAvatarController),
  refreshController: ctrlWrapper(refreshController),
  verifyController: ctrlWrapper(verifyController),
  resendVerifyEmailController: ctrlWrapper(resendVerifyEmailController),
};
