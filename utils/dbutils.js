const mongoose = require("mongoose");

let dbConnection = null;

async function createConnection() {
    var mongoDBUri = "mongodb+srv://thomas_alein:e@bigdatacourse.o3hoqbj.mongodb.net/sirene";
    dbConnection = await mongoose.connect(mongoDBUri, { useNewUrlParser: true, useUnifiedTopology: true, minPoolSize: 5, maxPoolSize: 100 });
    console.log("connected");
}

async function closeConnection() {
    await dbConnection.disconnect();
    console.log("disconnected");
}

module.exports = {
    createConnection,
    closeConnection
}