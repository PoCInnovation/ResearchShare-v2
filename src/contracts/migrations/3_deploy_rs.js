const Papers = artifacts.require("Papers");

module.exports = async function (deployer) {
  await deployer.deploy(Papers);
};
