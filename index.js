const app = require("./src/utils/app.js");
const dotenv = require("dotenv");
const connectDb = require("./src/dataBase/connection.js");
const PORT = process.env.PORT || 5005;
console.log(PORT);

// Load environment variables from .env file
dotenv.config();

// Connect to the database and start the server
connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server is running on port", PORT);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit the process on connection failure
  });
