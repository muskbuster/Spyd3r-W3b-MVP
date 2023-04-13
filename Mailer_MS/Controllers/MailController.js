// Here we set up kafka consumer for the topic stake and test-topic and console log
// we need to export this as a module and import it in the index.js of the other microservices
const { Kafka } = require("kafkajs");
const nodemailer = require("nodemailer");
const { Receipt } = require("../Models/RecieptModel");
const{config} = require('../DB_config/config.js');
require("dotenv").config();

const kafka = new Kafka({
    clientId: "StakeListener",
    brokers: ["localhost:9092"],
});

const messenger = async () => {
    const consumer = kafka.consumer({ groupId: "test-group" });
    await consumer.connect();
    await consumer.subscribe({ topic: "stake", fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                value: message.value.toString(),
            });
            var address = message.value.toString().split(" ")[3];
            var amount = message.value.toString().split(" ")[6];
            console.log(address);
            console.log(amount);

            //send email
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "catnipkong5@gmail.com",
                    pass: "yjhvhikgrgsxwdye"
                },
            });

            const mailOptions = {
                from: process.env.EMAIL,
                to:"sudeepkamat79@gmail.com",
                subject: "Stake Confirmation",
                text: `your vulnerable contract was called by ` + address + ` with amount ` + amount,
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email sent: " + info.response);
                }
            }
            );

            //store in db
            const receipt = new Receipt({
                address: address,
                amount: amount,
                mailID: mailOptions,
                mailSent: true,
            });
            



        }





    });
}
    module.exports = {messenger};