const app = require("./app");
const connectDB = require("./src/config/db");

connectDB()
  .then(() => {
    app.listen(process.env.PORT, (err) => {
      if (err) {
        console.log("Error while starting the server");
        process.exit(1);
      }
      console.log(`Sever is Running on Port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error while connecting the database", err);
    process.exit(1);
  });
