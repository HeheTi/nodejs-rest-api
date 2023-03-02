const express = require("express");
const ctrl = require("../../controllers/auth");
const { validateBody, authentication, upload } = require("../../middlewares");
const {
  authSchema,
  changeSubscriptionSchema,
  refreshSchema,
} = require("../../schemas/authSchemas");

const router = express.Router();

router.post("/signup", validateBody(authSchema), ctrl.singUpController);
router.post("/login", validateBody(authSchema), ctrl.loginController);
router.post("/logout", authentication, ctrl.logoutController);
router.get("/current", authentication, ctrl.currentController);
router.patch(
  "/",
  authentication,
  validateBody(changeSubscriptionSchema),
  ctrl.updateSubscriptionController
);
router.patch(
  "/avatars",
  authentication,
  upload.single("avatar"),
  ctrl.updateAvatarController
);

router.post("/refresh", validateBody(refreshSchema), ctrl.refreshController);

module.exports = router;
