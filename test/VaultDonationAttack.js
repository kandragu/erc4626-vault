const { expect } = require("chai");

const DECIMAL = 18;

describe("VaultDonationAttack", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployVaultDonationAttack() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const oceanToken = await ethers.deployContract("OceanToken");

    const Vault = await ethers.getContractFactory("VaultDonationAttack");
    const vault = await Vault.deploy(oceanToken);

    return { vault, oceanToken };
  }

  describe("Deployment", function () {
    it("Should have the asset set to oceanToken", async function () {
      const { vault, oceanToken } = await deployVaultDonationAttack();
      const asset = await vault.asset();

      expect(asset).to.equal(oceanToken);
    });
  });

  // // bob deposits 10 tokens and receives 10 shares
  // describe("Deposit", function () {
  //   it("Should deposit 10 tokens and receive 10 shares", async function () {
  //     const { vault, oceanToken } = await deployVaultDonationAttack();

  //     const [owner, bob] = await ethers.getSigners();

  //     await oceanToken.transfer(bob, 10);
  //     await oceanToken.connect(bob).approve(vault, 10);

  //     await vault.connect(bob).deposit(10, bob);

  //     const bobShares = await vault.balanceOf(bob);
  //     expect(bobShares).to.equal(10);

  //     console.log("vault total supply", await vault.totalSupply());
  //     console.log("oceanToken totalSupply", await oceanToken.totalSupply());
  //   });
  // });

  describe("Deposit from two users", function () {
    it("Both Bob and Alice receive share propition to the deposit", async function () {
      const { vault, oceanToken } = await deployVaultDonationAttack();

      const [owner, bob, alice] = await ethers.getSigners();

      // Bob
      await oceanToken.transfer(bob, 10);
      await oceanToken.connect(bob).approve(vault, 10);
      await vault.connect(bob).deposit(10, bob);

      // Alice
      await oceanToken.transfer(alice, 100);
      await oceanToken.connect(alice).approve(vault, 1000);
      await vault.connect(alice).deposit(100, alice);

      const bobShares = await vault.balanceOf(bob);
      expect(bobShares).to.equal(10);

      const aliceShares = await vault.balanceOf(alice);

      expect(aliceShares).to.equal(100);

      console.log("vault total supply", await vault.totalSupply());
      console.log("oceanToken totalSupply", await oceanToken.totalSupply());
    });
  });

  describe("Deposit from two users", function () {
    it("Both Bob will do inflaction attack", async function () {
      const { vault, oceanToken } = await deployVaultDonationAttack();

      const [owner, bob, alice] = await ethers.getSigners();

      // Bob
      await oceanToken.transfer(bob, 2001);
      await oceanToken.connect(bob).approve(vault, 1000);
      await vault.connect(bob).deposit(1000, bob);
      //donation
      await oceanToken.transfer(vault, 100);

      // Alice
      await oceanToken.transfer(alice, 100);
      await oceanToken.connect(alice).approve(vault, 100);
      await vault.connect(alice).deposit(100, alice);

      const bobShares = await vault.balanceOf(bob);
      // expect(bobShares).to.equal(1);

      const aliceShares = await vault.balanceOf(alice);

      // expect(aliceShares).to.equal(100 * 10 ** DECIMAL);

      console.log("bob asset before", await oceanToken.balanceOf(bob));
      console.log("bob Shares", bobShares);
      console.log("alice shares", aliceShares);
      console.log("vault total supply", await vault.totalSupply());
      console.log("vault assert ", await oceanToken.balanceOf(vault));
      console.log("bob underlying token", await vault.previewRedeem(bobShares));
      console.log(
        "(totalAssets()",
        await vault.totalAssets(),
        await vault.totalSupply()
      );

      const redeemAsset = await vault.connect(bob).redeem(bobShares, bob, bob);

      console.log("bob asset", await oceanToken.balanceOf(bob));
    });
  });
});
