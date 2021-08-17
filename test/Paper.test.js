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
const State = {
    "Pending": 0,
    "RequestChanges": 1,
    "Approved": 2,
    "Rejected": 3
};

const ipfsHash = "0000";
const authorAddress = 3333333;
const reviewTime = 100000;


describe("Paper valid cases, with Journal its only editor", function () {
    beforeEach(async function () {
        this.contract = await Journal.new();
        this.newPaper = await Paper.new(ipfsHash, ["Physics"], authorAddress, reviewTime);
        await this.contract.addPaper(this.newPaper);
        await this.contract.primaryPaperChecking(ipfsHash);
      }
    );
    it("addFeedback", async function() {
      await this.newPaper.addReviewer(await this.contract.owner());
      await this.newPaper.addFeedback("The paper is correct.");

      // valid case
      expect(this.newPaper.feedbacks[0]).to.be.equal("The paper is correct.");

      // invalid case
      await this.newPaper.removeReviewer(await this.contract.owner());
      expectRevert(await this.newPaper.addFeedback("The paper is just rubbish."), "You are not part of the reviewer's list. \
          Therefore, you can't perform this operation.");

    });
    it("validateFeedback", async function() {
      await this.newPaper.addReviewer(await this.contract.owner());
      await this.newPaper.addFeedback("The paper is correct.");
    
      // valid case
      await this.newPaper.validateFeedback(0);
      expect(this.newPaper.feedbacks[0].feedbackState).to.be.bignumber.equal(new BN (State["Approved"]));

      // invalid case

    });
    it("deleteFeedback", async function() {
      await this.newPaper.addReviewer(await this.contract.owner());
      await this.newPaper.addFeedback("The paper is correct.");
    
      // valid case
      await this.newPaper.validateFeedback(0);
      expect(this.newPaper.feedbacks[0].feedbackState).to.be.bignumber.equal(new BN (State["Rejected"]));

      // invalid case  

    });
    it("addReviewState_validCase", async function() {
      await this.newPaper.addReviewer(await this.contract.owner());
      // valid case

      expect(this.newPaper.paperState).to.be.bignumber.equal(new BN (State["Pending"]));
      await this.newPaper.addReviewState(new BN (State["Approved"]));
      const reviewStates = await this.newPaper.reviewStates;
      expect(reviewStates[await this.contract.owner()]).to.be.bignumber.equal(new BN (State["Approved"]));
      expect(this.newPaper.paperState).to.be.bignumber.equal(new BN (State["Approved"]));

    });
    it("addReviewState_invalidCase", async function() {
      expectRevert(await this.newPaper.addReviewState("The paper is just rubbish."), "You are not part of the reviewer's list. \
          Therefore, you can't perform this operation.");
    });
    it("claimAuthority", async function() {

      // invalid case
      expectRevert(await this.newPaper.claimAuthority(), "This paper review is still ongoing.");

      // valid case
      expect(this.newPaper.author).to.be.equal(authorAddress);
      await this.newPaper.addReviewer(await this.contract.owner());
      await this.newPaper.claimAuthority(this.contract.owner());
      expect(this.newPaper.author).to.be.equal(this.contract.owner());

    });
  }
);
