const { expect } = require("chai");
const { accounts, contract } = require("@openzeppelin/test-environment");
const {
  BN, // Big Number support
  constants, // Common constants, like the zero address and largest integers
  expectEvent, // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require("@openzeppelin/test-helpers");

const Box = contract.fromArtifact("Box");

// Start test block
describe("Box", function () {
  const [owner, nonOwner] = accounts;

  beforeEach(async function () {
    // Deploy a new Box contract for each test
    this.contract = await Box.new({ from: owner });
  });

  // Test case
  it("retrieve returns a value previously stored", async function () {
    // Store a value - recall that only the owner account can do this!
    await this.contract.store(42, { from: owner });

    // Test if the returned value is the same one
    // Note that we need to use strings to compare the 256 bit integers
    expect((await this.contract.retrieve()).toString()).to.equal("42");
  });

  it("prevents non-owners from storing a value", async function () {
    await this.contract.store(42, { from: owner });
    await expectRevert(this.contract.store(69, { from: nonOwner }), "Ownable");
    expect((await this.contract.retrieve()).toString()).to.equal("42");
  });
});
