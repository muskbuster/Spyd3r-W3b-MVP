// here we track pending transactionss in our contract mempool
// and we run it in our ethereum vm using ethereumjs-vm and run the transaction and check if it is having too low gas attached to it and token transfer is unusually high

const ethers = require("ethers");
const { Kafka } = require("kafkajs");
const {Address}=require('@ethereumjs/util');
const {defaultAbiCoder}=require('@ethersproject/abi');
const{Chain,Common,Hardfork}=require('@ethereumjs/common');
const {Transaction} = require('@ethereumjs/tx');
const{VM}=require('@ethereumjs/vm');
const { fromWei } = require('@ethereumjs/vm');
const abi = require ('./abi.json');
require("dotenv").config()
//setup network type for ethereumjs-vm mumabi testnet


const { MUMBAI_80001, GOERLIETH,QuickNode} = require("./providers");
var url = "wss://purple-lively-moon.matic-testnet.discover.quiknode.pro/0d97882d0b726da5b7a929a3e8c5efe837f1dd78/";

const trackTransactions = async () => {

      //should establish connection now
      const contract = new ethers.Contract(abi.address,abi.abi,QuickNode )
      const Signer = new ethers.Wallet(process.env.PRIVATE_KEY, MUMBAI_80001);
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
          console.log("txDatafrom : ",txData.from);
          console.log("txDatato : ",txData.to);
          console.log("txDatadata : ",txData.data);

          //To check gas fee needed then check if it the gas sent is lower than the gas needed and broadcast as kafka producer as topic-test
          const gasNeeded = await QuickNode.estimateGas(txData);
          console.log("gasNeeded: ",gasNeeded);
          const gasSent = tx.gasLimit;
          console.log("gasSent: ",gasSent);
          if (gasSent < gasNeeded) {
            console.log("gasSent is less than gasNeeded");
            //call pause function to pause the contract
            const pause = await contract.connect(Signer).pause();
          }
else if (receipt.to !== contractAddress){
 //we ignore the transaction
 console.log("");
}
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