const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/contacts");
const { isValidId, validateBody } = require("../../middlewares");
const schemas = require("../../schemas/contacts");

router.get("/", ctrl.getAllContatcts);

router.get("/:contactId", isValidId, ctrl.getContactById);

router.post("/", validateBody(schemas.addContactSchema), ctrl.addContact);

router.delete("/:contactId", isValidId, ctrl.deleteContact);

router.put(
  "/:contactId",
  isValidId,
  validateBody(schemas.addContactSchema),
  ctrl.changeContact
);

router.patch(
  "/:contactId/favorite",
  isValidId,
  validateBody(schemas.updateContactFavoriteSchema),
  ctrl.updateContactFavorive
);

module.exports = router;
