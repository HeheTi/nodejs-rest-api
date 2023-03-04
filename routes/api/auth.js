const express = require("express");
const ctrl = require("../../controllers/auth");
const { validateBody, authentication, upload } = require("../../middlewares");
const {
  authSchema,
  changeSubscriptionSchema,
  refreshSchema,
  resendVerifySchema,
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

router.get("/verify/:verificationCode", ctrl.verifyController);

router.post(
  "/resend-verify-email",
  validateBody(resendVerifySchema),
  ctrl.resendVerifyEmailController
);

module.exports = router;
