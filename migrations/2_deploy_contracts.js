const Targets = artifacts.require("Targets");
const KDNP = artifacts.require("KDNP");
const RewardPool = artifacts.require("RewardPool");
const Market = artifacts.require("Market");

require('dotenv').config();
const StableCoin = process.env.STABLECOIN;
const TeamSplitter = process.env.TEAM_SPLITTER;
const Minter = process.env.MINTER;

module.exports = deployer => {
  deployer.then(async () => {
    await deployer.deploy(Targets, "TARGET", "TRGT");
    const TargetsInstance = await Targets.deployed();
    console.log(`Kidnap: Targets deployed at ${Targets.address}.`);
    
    await deployer.deploy(KDNP, "");
    const KDNPInstance = await KDNP.deployed();
    console.log(`Kidnap: KDNP deployed at ${KDNP.address}.`);

    await deployer.deploy(RewardPool, StableCoin, KDNP.address);
    console.log(`Kidnap: RewardPool deployed at ${RewardPool.address}.`);

    await deployer.deploy(Market, StableCoin, Targets.address, KDNP.address, RewardPool.address, TeamSplitter);
    console.log(`Kidnap: Market deployed at ${Market.address}.`);

    await TargetsInstance.setMarketPlace(Market.address);
    await TargetsInstance.setMinter(Minter);
    await KDNPInstance.setMarketPlace(Market.address);
    console.log(`Kidnap: Migration completed!`);
  });
};