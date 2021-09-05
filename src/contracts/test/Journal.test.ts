/*const { expect } = require("chai");
const { accounts, contract } = require("@openzeppelin/test-environment");
const {
  BN, // Big Number support
  constants, // Common constants, like the zero address and largest integers
  expectEvent, // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require("@openzeppelin/test-helpers");

const Journal = contract.fromArtifact("Journal");
const Paper = contract.fromArtifact('Paper');
const State = {
    "Pending": 0,
    "RequestChanges": 1,
    "Approved": 2,
    "Rejected": 3
};

const ipfsHash = "0000";
const authorAddress = 3333333;
const reviewTime = 100000;


describe("Journal allowed operations", function () {
    beforeEach(async function () {
        this.contract = await Journal.new();
        this.newPaper = await Paper.new(ipfsHash, ["Physics"], authorAddress, reviewTime);
      }
    );
    it("validateFeedback", async function() {

    });
    it("deleteFeedback", async function() {

    });
    it("addPaper", async function() {
      await this.contract.addPaper(this.newPaper);
      expect(await this.newPaper.owner()).to.be.equal(await this.contract.owner());
      expect(this.contract.allPapers[ipfsHash]).to.be.equal(this.newPaper);

    });
    it("getPaper", async function() {
      await this.contract.addPaper(this.newPaper);
      expect(this.newPaper.ipfsHash).to.be.equal(await ipfsHash);

    }); 
    it("publishPaper", async function() {

    });
  }
);
*/