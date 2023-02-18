const { HttpError, ctrlWrapper } = require("../helpers");
const {
  getAllContatcts,
  getContactById,
  addContact,
  deleteContact,
  changeContact,
  updateContactFavorive,
} = require("../services/contactsService");

const getAllContatctsController = async (req, res) => {
  const contacts = await getAllContatcts();
  res.json(contacts);
};

const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (!contact) {
    throw HttpError(404, `Book with ${contactId} not found`);
  }
  res.json(contact);
};

const addContactController = async (req, res) => {
  if (!Object.keys(req.body).length) {
    throw HttpError(400, "missing required name field");
  }
  const newContact = await addContact(req.body);
  res.status(201).json(newContact);
};

const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const removedContact = await deleteContact(contactId);
  if (!removedContact) {
    throw HttpError(404);
  }
  res.json({ message: "contact deleted" });
};

const changeContactController = async (req, res) => {
  if (!Object.keys(req.body).length) {
    throw HttpError(400, "missing fields");
  }
  const { contactId } = req.params;
  const removedContact = await changeContact(contactId, req.body);
  if (!removedContact) {
    throw HttpError(404);
  }
  res.json(removedContact);
};

const updateContactFavoriveController = async (req, res) => {
  if (!Object.keys(req.body).length) {
    throw HttpError(400, "missing field favorite");
  }
  const { contactId } = req.params;
  const updatedFavorive = await updateContactFavorive(contactId, req.body);
  if (!updatedFavorive) {
    throw HttpError(404);
  }
  res.json(updatedFavorive);
};

module.exports = {
  getAllContatctsController: ctrlWrapper(getAllContatctsController),
  getContactByIdController: ctrlWrapper(getContactByIdController),
  addContactController: ctrlWrapper(addContactController),
  deleteContactController: ctrlWrapper(deleteContactController),
  changeContactController: ctrlWrapper(changeContactController),
  updateContactFavoriveController: ctrlWrapper(updateContactFavoriveController),
};
