const hre = require("hardhat");

async function main() {
  const DecentralizedVoting = await hre.ethers.getContractFactory("DecentralizedVoting");
  const voting = await DecentralizedVoting.deploy();

  await voting.deployed();

  console.log("DecentralizedVoting deployed to:", voting.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });