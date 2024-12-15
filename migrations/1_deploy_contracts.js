const EventManager = artifacts.require("BetManager");

module.exports = async function (deployer) {
  // Deploy EventManager
  deployer.deploy(EventManager);
};