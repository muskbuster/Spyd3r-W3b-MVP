// here we track pending transactionss in our contract mempool
// and we run it in our ethereum vm using ethereumjs-vm and run the transaction and check if it is having too low gas attached to it and token transfer is unusually high

const ethers = require("ethers");
const { Kafka } = require("kafkajs");
const {Address}=require('@ethereumjs/util');
const {defaultAbiCoder}=require('@ethersproject/abi');
const{Chain,Common,Hardfork}=require('@ethereumjs/common');
const {Transaction} = require('@ethereumjs/tx');
const{VM}=require('@ethereumjs/vm');

//setup network type for ethereumjs-vm mumabi testnet
const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London });

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
      const contract = new ethers.Contract(contractAddress, abi,QuickNode );
    //we should check that the transaction is confirmed within 10 blocks
    QuickNode.on("pending", async (txHash) => {
      try {
        //console.log("pending txHash: ",txHash);
        // Wait for the transaction to be mined
        const receipt = await QuickNode.getTransaction(txHash);
        //filter out the transactions that are not related to our contract
        if (receipt.to === contractAddress) {
          console.log("receipt: ",receipt);
          //check if the transaction is a stake or unstake
          const tx = await QuickNode.getTransaction(txHash);
          const data = tx.data;
          console.log("data: ",data);
// now we run the transaction through ethereumjs-vm with decoded data with function name and amount
          const txData = { from: tx.from, to: tx.to, data: data };
          console.log("txData: ",txData);
          const vm = new VM();
          const result = await vm.runTx({ tx: txData });
          console.log("result: ",result);


}
else{
 //we ignore the transaction
 console.log("");
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