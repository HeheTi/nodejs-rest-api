const Contact = require("../models/contact");

const { HttpError, ctrlWrapper } = require("../helpers");

const getAllContatcts = async (req, res) => {
  const result = await Contact.find();
  res.json(result);
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);
  if (!contact) {
    throw HttpError(404, `Book with ${contactId} not found`);
  }
  res.json(contact);
};

const addContact = async (req, res) => {
  if (!Object.keys(req.body).length) {
    throw HttpError(400, "missing required name field");
  }
  const newContact = await Contact.create(req.body);
  res.status(201).json(newContact);
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndRemove(contactId);
  if (!result) {
    throw HttpError(404);
  }
  res.json({ message: "contact deleted" });
};

const changeContact = async (req, res) => {
  if (!Object.keys(req.body).length) {
    throw HttpError(400, "missing fields");
  }
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

const updateContactFavorive = async (req, res) => {
  if (!Object.keys(req.body).length) {
    throw HttpError(400, "missing field favorite");
  }
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

module.exports = {
  getAllContatcts: ctrlWrapper(getAllContatcts),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  deleteContact: ctrlWrapper(deleteContact),
  changeContact: ctrlWrapper(changeContact),
  updateContactFavorive: ctrlWrapper(updateContactFavorive),
};
