// scripts/index.js

const Box = artifacts.require("Box");

module.exports = async function main(callback) {
  try {
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
      const box = await Box.deployed()
      box.store(42)
      console.log("Box content", (await box.retrieve()).toString());
    callback(0);
  } catch (error) {
    console.error(error);
    callback(1);
  }
};
