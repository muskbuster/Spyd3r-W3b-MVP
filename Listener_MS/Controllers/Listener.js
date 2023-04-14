const ethers = require("ethers")
const { Kafka } = require("kafkajs");
const {
    MUMBAI_80001,
    GOERLIETH,

  } = require("./providers");
  const  abi  = require("./abi");

const kafka = new Kafka({
  clientId: "StakeListener",
  brokers: ["localhost:9092"],
});
// need to export this listeners to index.js
const listener = async () => {


  //take abi
  //connect to contract address from abi
    //listen for event of stake and unstake
    // send message via kafka that the function was called
    //add to db

  //should establish connection now
  const contract = new ethers.Contract(abi.address, abi.abi, MUMBAI_80001);
  //add event listener for stake and export it

  contract.on("Stake", async (liquidityProvider, amount) => {
    console.log("Stake event triggered");
    console.log("liquidityProvider: ", liquidityProvider);
    console.log("amount: ", amount);
    //here have to use kafkajs to broadcast that the stake function was called
    //and the amount of tokens that were staked

    const producer = kafka.producer();
    await producer.connect();
    await producer.send({
      topic: "stake",
      messages: [
        { value: "Stake called by " + liquidityProvider + " with amount " + amount }
      ],

    });
    producer.disconnect();
    console.log("Stake event triggered");
  }
  );

  contract.on("Unstake", async (liquidityProvider, amount) => {
    console.log("Unstake event triggered");
    console.log("liquidityProvider: ", liquidityProvider);
    console.log("amount: ", amount);
    //here have to use kafkajs to broadcast that the unstake function was called
    //and the amount of tokens that were unstake

    const producer = kafka.producer();
    await producer.connect();
    await producer.send({
      topic: "stake",
      messages: [
        { value: "Unstake called by " + liquidityProvider + " with amount " + amount }
      ],
    });


  }
  );
}

//export as listener
module.exports = {
  listener
};
