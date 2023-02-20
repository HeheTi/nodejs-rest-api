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
  const { _id: owner } = req.user;
  let { page = 1, limit = 20, favorite = null } = req.query;
  limit = limit > 100 ? 100 : limit;
  const skip = (+page - 1) * +limit;

  let dataByFind = { owner };

  if (favorite !== null) {
    dataByFind = { ...dataByFind, favorite };
  }

  const contacts = await getAllContatcts(dataByFind, skip, limit);
  res.json({ contacts, page, limit });
};

const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const contact = await getContactById(contactId, owner);
  if (!contact) {
    throw HttpError(404, `Book with ${contactId} not found`);
  }
  res.json(contact);
};

const addContactController = async (req, res) => {
  const { _id: owner } = req.user;
  const newContact = await addContact({ ...req.body, owner });
  res.status(201).json(newContact);
};

const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;

  const removedContact = await deleteContact(contactId, owner);
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
  const { _id: owner } = req.user;
  const updatedContact = await changeContact(contactId, owner, req.body);
  if (!updatedContact) {
    throw HttpError(404);
  }
  res.json(updatedContact);
};

const updateContactFavoriveController = async (req, res) => {
  if (!Object.keys(req.body).length) {
    throw HttpError(400, "missing field favorite");
  }
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const updatedFavorive = await updateContactFavorive(
    contactId,
    owner,
    req.body
  );
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
