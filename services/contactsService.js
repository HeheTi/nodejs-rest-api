const Contact = require("../models/contact");

const getAllContatcts = async (dataByFind, skip, limit) => {
  const result = await Contact.find(dataByFind)
    .skip(skip)
    .limit(limit)
    .populate("owner", "email subscription -_id");
  return result;
};

const getContactById = async (contactId, owner) => {
  const contact = await Contact.findOne({ _id: contactId, owner });
  return contact;
};

const addContact = async (data) => {
  const newContact = await Contact.create(data);
  return newContact;
};

const deleteContact = async (contactId, owner) => {
  const removedContact = await Contact.findOneAndRemove({
    _id: contactId,
    owner,
  });
  return removedContact;
};

const changeContact = async (contactId, owner, data) => {
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: contactId, owner },
    data,
    {
      new: true,
    }
  );
  return updatedContact;
};

const updateContactFavorive = async (contactId, owner, data) => {
  const updatedFavorive = await Contact.findOneAndUpdate(
    { _id: contactId, owner },
    data,
    {
      new: true,
    }
  );
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
