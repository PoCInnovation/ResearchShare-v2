const Journal = artifacts.require("Journal");
const Paper = artifacts.require("Paper");

const ipfsHash = "QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4"; // cid
const fields = ["Reddit", "Screenshot"];
const reviewTime = 3600; // in seconds

module.exports = async function (deployer, _, [owner]) {
  await deployer.deploy(Journal);
  await deployer.deploy(Paper, ipfsHash, fields, owner, reviewTime);

  const journal = await Journal.deployed();
  const paper = await Paper.deployed();
  journal.addPaper(ipfsHash, paper.address);
} as Truffle.Migration;