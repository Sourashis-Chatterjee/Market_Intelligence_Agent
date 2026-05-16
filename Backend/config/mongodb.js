const mongoose = require("mongoose");

const connectDB = async () => {
    mongoose.connection.on('connected', () => console.log("Database Connected"));
    await mongoose.connect(`${process.env.MONGODB_URL}MarketIntelligenceAgent`)
    .then(() => {
    console.log("Mongo connected");

    // console.log(mongoose.connection.host);
    // console.log(mongoose.connection.name);
})
.catch(err => console.log(err));;
};

module.exports = connectDB;
