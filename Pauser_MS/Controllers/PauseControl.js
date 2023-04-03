// this uses private key of deployer to pause the contract
//  this is a consumer to topic-test topic from kafka

 const { Kafka } = require("kafkajs");
    const { MUMBAI_80001, GOERLIETH } = require("./providers");
    const { ethers } = require("ethers");
    require("dotenv").config();
    const kafka = new Kafka({
        clientId: "PendingTransactionTracker",
        brokers: ["localhost:9092"],
    });
    // subscribe to topic
    const consumer = kafka.consumer({ groupId: "test-group" });
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
      const Signer = new ethers.Wallet(process.env.PRIVATE_KEY, MUMBAI_80001);



    const run = async () => {
        // Consuming
        //establish connection to ethers

        await consumer.connect();
        await consumer.subscribe({ topic: "topic-test", fromBeginning: true });
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log({
                    value: message.value.toString(),
                });
                //assing 2nd and 3rd values to variables address and amount
                var address = message.value.toString().split(" ")[3];
                var amount = message.value.toString().split(" ")[6];
                //call pause function
                contract.connect(Signer).pause();
                console.log("Contract Paused");
            },
        });
    };
    run().catch(console.error);

    exports.run = run;