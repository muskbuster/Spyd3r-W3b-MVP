// here we track pending transactionss in our contract mempool if the transaction is not mined within 10 blocks we will send a message
// through kafka as producer which is later picked by our pauser service and the transaction is paused

const ethers = require("ethers");
const { Kafka } = require("kafkajs");
const { MUMBAI_80001, GOERLIETH,QuickNode} = require("./providers");
var url = "wss://purple-lively-moon.matic-testnet.discover.quiknode.pro/0d97882d0b726da5b7a929a3e8c5efe837f1dd78/";
const trackTransactions = async () => {
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
      const contract = new ethers.Contract(contractAddress, abi,MUMBAI_80001 );
    //we should check that the transaction is confirmed within 10 blocks
    QuickNode.on("pending", async (txHash) => {
      try {
        console.log("pending txHash: ",txHash);
        // Wait for the transaction to be mined
        const receipt = await provider.waitForTransaction(txHash);

        // Get the current block number
        const currentBlockNumber = await provider.getBlockNumber();

        // Check if the transaction was confirmed within 10 blocks
        if (receipt.blockNumber + 10 < currentBlockNumber) {
          Console.log("Transaction was not confirmed within 10 blocks,TxHash: ",txHash);
          // // Transaction was not confirmed within 10 blocks, send message through Kafka
          // const kafka = new Kafka({
          //   clientId: 'my-app',
          //   brokers: ['kafka1:9092', 'kafka2:9092']
          // });

          // const producer = kafka.producer();
          // await producer.connect();
          // await producer.send({
          //   topic: 'pending-transactions',
          //   messages: [{ value: txHash }]
          // });
          // await producer.disconnect();
        }
      } catch (err) {
        console.error(`Error handling pending transaction ${txHash}:`, err);
      }
    });
    }
    //export this module
    module.exports = {
      trackTransactions
    };