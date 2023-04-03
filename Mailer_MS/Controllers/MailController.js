// Here we set up kafka consumer for the topic stake and test-topic and console log
// we need to export this as a module and import it in the index.js of the other microservices
const { Kafka } = require("kafkajs");


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

        }
    });

    }
    module.exports = {messenger};