const mongoose = require("mongoose");
const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DBURI, {
      ssl: true,
      tlsAllowInvalidCertificates: false,
    });
    console.log("Database Established");
  } catch (err) {
    console.error(err);
  }
};
module.exports = dbConnection;  
