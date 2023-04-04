const mongoose = require("mongoose");
require("dotenv").config();

module.exports = async () => {
    try {
        const mongoURI = "mongodb+srv://Tester:Test123@cluster0.leaia6l.mongodb.net/?retryWrites=true&w=majority";
        // console.log(mongoURI);
        const connection = await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        });
        console.log(`MongoDB Connected: ${connection.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
    }
    };