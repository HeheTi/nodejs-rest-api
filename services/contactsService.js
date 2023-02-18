const Contact = require("../models/contact");

const getAllContatcts = async () => {
  const result = await Contact.find();
  return result;
};

const getContactById = async (id) => {
  const contact = await Contact.findById(id);
  return contact;
};

const addContact = async (data) => {
  const newContact = await Contact.create(data);
  return newContact;
};

const deleteContact = async (id) => {
  const removedContact = await Contact.findByIdAndRemove(id);
  return removedContact;
};

const changeContact = async (id, data) => {
  const updatedContact = await Contact.findByIdAndUpdate(id, data, {
    new: true,
  });
  return updatedContact;
};

const updateContactFavorive = async (id, data) => {
  const updatedFavorive = await Contact.findByIdAndUpdate(id, data, {
    new: true,
  });
  return updatedFavorive;
};

module.exports = {
  getAllContatcts,
  getContactById,
  addContact,
  deleteContact,
  changeContact,
  updateContactFavorive,
};
