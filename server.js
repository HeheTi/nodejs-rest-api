const app = require("./app");
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const { DB_HOST, PORT = 3000 } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() => console.log("Database connection successful"))
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`Server running. Use our API on port: http://localhost:${PORT}`);
});

// const sgMail = require("@sendgrid/mail");
// require("dotenv").config();

// const { SENDGRID_API_KEY } = process.env;

// sgMail.setApiKey(SENDGRID_API_KEY);

// const email = {
//   to: "tatiana.nv96@gmail.com",
//   from: "tro_lo_lo@meta.ua",
//   subject: "Verify email",
//   html: "<p><strong>Verify email</strong></p>",
// };

// sgMail
//   .send(email)
//   .then((e) => console.log("Email send success", e))
//   .catch((error) => console.log(error.message));
