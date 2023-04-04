const ethers = require("ethers")
const { Kafka } = require("kafkajs");
const {
    MUMBAI_80001,
    GOERLIETH,

  } = require("./providers");

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

  const abi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "Paused",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "liquidityProvider",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "Stake",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "Unpaused",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "liquidityProvider",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "Unstake",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "StakerLiquidity",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "pause",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "paused",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "stake",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "unpause",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "unstake",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]

  const contractAddress = "0xB18Cf81F113CF2188f9dBA38466Ce35A9fa6Da59";
  //should establish connection now
  const contract = new ethers.Contract(contractAddress, abi, MUMBAI_80001);
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
        { value: "Stake called by " + liquidityProvider + " with amount " + amount },
        { value: liquidityProvider},
        { value: amount.toString() }
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
        { value: "Unstake called by " + liquidityProvider + "with amount " + amount },
        { value: liquidityProvider},
        { value: amount.toString() }
      ],
    });


  }
  );
}

//export as listener
module.exports = {
  listener
};