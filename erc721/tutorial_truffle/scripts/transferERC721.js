const fs = require('fs');
const contractABI = JSON.parse(fs.readFileSync('./build/contracts/MyERC721.json')).abi;
var Web3 = require('web3');
require('dotenv').config()

//truffle migrate를 해서 나온 contract address
const contractAddress = process.env.ERC721;
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC_URL));
const contract = new web3.eth.Contract(contractABI, contractAddress);

async function transferERC20(_to, _tokenID) {
  const singedTx = await web3.eth.accounts.signTransaction({
    from: process.env.PUBLIC_KEY,
    to: contractAddress,
    gas: 1000000,
    data: contract.methods.transferFrom(process.env.PUBLIC_KEY,_to, _tokenID.toString()).encodeABI() 
  }, process.env.PRIVATE_KEY)
  
  console.log("singedTx >>", singedTx.rawTransaction)
  await web3.eth.sendSignedTransaction(singedTx.rawTransaction.toString('hex'))
  .on('receipt', console.log);
}

transferERC20(process.env.TEST_PUBLIC_KEY, 1)