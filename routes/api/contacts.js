const express = require("express");
const router = express.Router();
const Joi = require("joi");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts");
const { HttpError } = require("../../helpers");

const addContactShema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

router.get("/", async (req, res, next) => {
  try {
    const books = await listContacts();
    res.json(books);
  } catch (err) {
    next(err);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (!contact) {
      throw HttpError(404, `Book with ${contactId} not found`);
    }

    res.json(contact);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    if (!Object.keys(req.body).length) {
      throw HttpError(400, "missing required name field");
    }

    const { error } = addContactShema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const newContact = await addContact(req.body);
    res.status(201).json(newContact);
  } catch (err) {
    next(err);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await removeContact(contactId);

    if (!result) {
      throw HttpError(404);
    }

    res.json({ message: "contact deleted" });
  } catch (err) {
    next(err);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    if (!Object.keys(req.body).length) {
      throw HttpError(400, "missing fields");
    }

    const { error } = addContactShema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const { contactId } = req.params;
    const result = await updateContact(contactId, req.body);
    if (!result) {
      throw HttpError(404);
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
