const Journal = artifacts.require("Journal");

module.exports = async function (deployer) {
  deployer.deploy(Journal);
} as Truffle.Migration;

// export {}