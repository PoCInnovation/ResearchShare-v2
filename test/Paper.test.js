const { expect } = require("chai");
const { accounts, contract } = require("@openzeppelin/test-environment");
const {
  BN, // Big Number support
  constants, // Common constants, like the zero address and largest integers
  expectEvent, // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require("@openzeppelin/test-helpers");

const Journal = contract.fromArtifact("Journal");
const Paper = contract.fromArtifact('Paper');
const PaperState = {
    "onReview": 0,
    "Approved": 1,
    "Rejected": 2
};


describe("Journal", function () {
    beforeEach(async function () {
        this.contract = await Journal.new();
        this.newPaper = await Paper.new("0000", ["Physics"], 3333333, 1000);
        await this.contract.addPaper(this.newPaper);
      }
    );
    it("addFeedback", async function() {

      // valid case

      // invalid case

    });
    it("validateFeedback", async function() {

      // valid case

      // invalid case

    });
    it("deleteFeedback", async function() {

      // valid case

      // invalid case

    });
    it("addReviewState", async function() {

      // valid case

      // invalid case

    });
    it("claimAuthority", async function() {

      // valid case

      // invalid case

    });
  }
);
