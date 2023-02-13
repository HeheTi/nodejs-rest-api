const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/contacts");
const validateBody = require("../../middlewares/validateBody");
const schemas = require("../../schemas/contacts");

router.get("/", ctrl.getAllContatcts);

router.get("/:contactId", ctrl.getContactById);

router.post("/", validateBody(schemas.addContactShema), ctrl.addContact);

router.delete("/:contactId", ctrl.deleteContact);

router.put(
  "/:contactId",
  validateBody(schemas.addContactShema),
  ctrl.changeContact
);

module.exports = router;
