const PokeToken = artifacts.require("PokeToken");

module.exports = function (deployer) {
  deployer.deploy(PokeToken, "PokeToken", "POKE");
};
