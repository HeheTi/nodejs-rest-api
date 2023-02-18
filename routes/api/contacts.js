const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/contacts");
const { isValidId, validateBody } = require("../../middlewares");
const schemas = require("../../schemas/contacts");

router.get("/", ctrl.getAllContatctsController);

router.get("/:contactId", isValidId, ctrl.getContactByIdController);

router.post(
  "/",
  validateBody(schemas.addContactSchema),
  ctrl.addContactController
);

router.delete("/:contactId", isValidId, ctrl.deleteContactController);

router.put(
  "/:contactId",
  isValidId,
  validateBody(schemas.addContactSchema),
  ctrl.changeContactController
);

router.patch(
  "/:contactId/favorite",
  isValidId,
  validateBody(schemas.updateContactFavoriteSchema),
  ctrl.updateContactFavoriveController
);

module.exports = router;
