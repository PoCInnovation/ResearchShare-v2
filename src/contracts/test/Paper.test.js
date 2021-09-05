const { expect } = require("chai");
const { accounts, contract } = require("@openzeppelin/test-environment");
const {
  BN, // Big Number support
  constants, // Common constants, like the zero address and largest integers
  expectEvent, // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require("@openzeppelin/test-helpers");

const Papers = contract.fromArtifact("Paper");
const PaperState = {
    "onReview": 0,
    "Approved": 1,
    "Rejected": 2
};


describe("Paper", function () {
    beforeEach(async function () {
        this.contract = await Papers.new();
      }
    );
    it("store fields", async function () {
        this.newPaper = await this.contract.addPaper("1234", ["Physics", "Idk"]);
        expect(await this.contract.getFields("1234")).to.be.deep.equal(["Physics", "Idk"]);
    });
    it("check updateState cases", async function () {
        await this.contract.updatePaperState("1234", "2");
        expect(await this.contract.getPaperState("1234")).to.be.bignumber.equal(new BN (PaperState["Rejected"]));
    });
  }
);
