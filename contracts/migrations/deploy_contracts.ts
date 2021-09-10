const Journal = artifacts.require("Journal");
const Paper = artifacts.require("Paper");

const ipfsHash = "QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4"; // cid
const fields = ["Reddit", "Screenshot"];
const reviewTime = 3600; // in seconds

async function paper(deployer: Truffle.Deployer, _: string, [owner]: string[]) {
  await deployer.deploy(Paper, ipfsHash, fields, owner, reviewTime, {from: owner});
}

async function journal(deployer: Truffle.Deployer, _: string, [owner]: string[]) {
  await deployer.deploy(Journal, {from: owner});
  const paper = await Paper.deployed();
  const journal = await Journal.deployed();
  
  await journal.addPaper(ipfsHash, paper.address, {from: owner});
}

module.exports = {
  paper,
  journal
};