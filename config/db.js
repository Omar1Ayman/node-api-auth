const mongoose = require("mongoose");
const ConnectDB = () => {
  mongoose.connect(process.env.DB_URL).then((conn) => {
    console.log(`Connected to DB on host: ${conn.connection.host}`);
  });
};
ConnectDB();
