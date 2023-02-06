const fs = require("fs").promises;
const path = require("path");
const { nanoid } = require("nanoid");

const pathContacts = path.join(__dirname, "contacts.json");

const updateContacts = async (contacts) =>
  await fs.writeFile(pathContacts, JSON.stringify(contacts, null, 2));

const listContacts = async () => {
  const contacts = await fs.readFile(pathContacts, "utf8");
  return JSON.parse(contacts);
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const contactById = contacts.find((el) => el.id === contactId);
  return contactById || null;
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const idx = contacts.findIndex((el) => el.id === contactId);
  if (idx === -1) return null;
  const deletedBook = contacts.splice(idx, 1);
  await updateContacts(contacts);
  return deletedBook;
};

const addContact = async ({ name, email, phone }) => {
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  contacts.push(newContact);
  await updateContacts(contacts);
  return newContact;
};

const updateContact = async (id, { name, email, phone }) => {
  const contacts = await listContacts();
  const idx = contacts.findIndex((el) => el.id === id);
  if (idx === -1) return null;
  contacts[idx] = { id, name, email, phone };
  await updateContacts(contacts);
  return contacts[idx];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
