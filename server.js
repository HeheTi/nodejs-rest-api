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
