// Here we set up kafka consumer for the topic stake and test-topic and console log
// we need to export this as a module and import it in the index.js of the other microservices
const { Kafka } = require("kafkajs");
const nodemailer = require("nodemailer");
const { Receipt } = require("../Models/RecieptModel");
require("dotenv").config();


const messenger = async () => {
    const kafka = new Kafka({
        clientId: "StakeListener",
        brokers: ["localhost:9092"],
    });
    const consumer = kafka.consumer({ groupId: "test-group" });
    await consumer.connect();
    await consumer.subscribe({ topic: "stake", fromBeginning: true });
    await consumer.subscribe({ topic: "test-topic", fromBeginning: true });
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                value: message.value.toString(),
            });
            //assing 2nd and 3rd values to variables address and amount
             var address = message.value.toString().split(" ")[3];
            var amount = message.value.toString().split(" ")[6];
            console.log(address);
            console.log(amount);
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                  user: process.env.user,
                  pass: process.env.passw,
                },
              });
                const mailOptions = {
                from: process.env.user,
                to: process.env.user,
                subject: "Stake Confirmation",
                text: `There has been a call to vulnerable  function in your contract by ${address} for ${amount} ETH`,
                };
                transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email sent: " + info.response);
                }
                }
                );
                //save the transaction to the database
                const receipt = new Receipt({
                    address: address,
                    amount: amount,
                    mailID: info.response,
                    mailSent: true,
                });
                await receipt.save();
                console.log("receipt saved");

        }
    });

    }
    module.exports = {messenger};