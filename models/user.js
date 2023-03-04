const { Schema, model } = require("mongoose");
const { mongooseHandleError } = require("../helpers");
const { EMAIL_REG_EXP } = require("../helpers/constants");

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: EMAIL_REG_EXP,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    accessToken: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      default: "",
    },
  },
  {
    versionKey: false,
  }
);

userSchema.post("save", mongooseHandleError);

const User = model("user", userSchema);

module.exports = User;
