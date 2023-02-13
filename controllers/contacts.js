const contacts = require("../models/contacts");
const { HttpError, ctrlWrapper } = require("../helpers");

const getAllContatcts = async (req, res) => {
  const result = await contacts.listContacts();
  res.json(result);
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await contacts.getContactById(contactId);
  if (!contact) {
    throw HttpError(404, `Book with ${contactId} not found`);
  }
  res.json(contact);
};

const addContact = async (req, res) => {
  if (!Object.keys(req.body).length) {
    throw HttpError(400, "missing required name field");
  }
  const newContact = await contacts.addContact(req.body);
  res.status(201).json(newContact);
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await contacts.removeContact(contactId);
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
  const result = await contacts.updateContact(contactId, req.body);
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
};
