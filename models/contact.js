const { Schema, model } = require("mongoose");
const { mongooseHandleError } = require("../helpers");
const { EMAIL_REG_EXP } = require("../helpers/constants");

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      match: EMAIL_REG_EXP,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    versionKey: false,
  }
);

contactSchema.post("save", mongooseHandleError);

const Contact = model("contact", contactSchema);

module.exports = Contact;
