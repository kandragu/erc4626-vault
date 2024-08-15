const { expect } = require("chai");

describe("Vault", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployVault() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    // const OceanToken = await ethers.getContractFactory("OceanToken");
    // const oceanToken = await OceanToken.deploy();

    const oceanToken = await ethers.deployContract("OceanToken");

    const Vault = await ethers.getContractFactory("Vault");
    const vault = await Vault.deploy(oceanToken);

    return { vault, oceanToken };
  }

  describe("Deployment", function () {
    it("Should have the asset set to oceanToken", async function () {
      const { vault, oceanToken } = await deployVault();
      const asset = await vault.asset();

      expect(asset).to.equal(oceanToken);
    });
  });

  // bob deposits 10 tokens and receives 10 shares
  describe("Deposit", function () {
    it("Should deposit 10 tokens and receive 10 shares", async function () {
      const { vault, oceanToken } = await deployVault();

      const [owner, bob] = await ethers.getSigners();

      await oceanToken.transfer(bob, 10);
      await oceanToken.connect(bob).approve(vault, 10);

      await vault.connect(bob).deposit(10, bob);

      const bobShares = await vault.balanceOf(bob);
      expect(bobShares).to.equal(10);
    });
  });
});
