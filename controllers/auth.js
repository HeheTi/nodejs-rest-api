const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ctrlWrapper, HttpError } = require("../helpers");
const {
  findUser,
  singUpUser,
  loginUser,
  logoutUser,
  updateSubscriptionUser,
} = require("../services/usersService");

const { SECRET_KEY } = process.env;

const singUpController = async (req, res) => {
  const { email, password } = req.body;
  const user = await findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const result = await singUpUser({ email, password: hashPassword });

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
    },
  });
};

const logoutController = async (req, res) => {
  await logoutUser(req.user._id);
  res.status(204);
};

const currentController = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    user: {
      email,
      subscription,
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
    },
  });
};

module.exports = {
  singUpController: ctrlWrapper(singUpController),
  loginController: ctrlWrapper(loginController),
  logoutController: ctrlWrapper(logoutController),
  currentController: ctrlWrapper(currentController),
  updateSubscriptionController: ctrlWrapper(updateSubscriptionController),
};
