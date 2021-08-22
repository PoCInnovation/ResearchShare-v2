const Editor = artifacts.require("Journal");
const Paper = artifacts.require("Paper");

const State = {
    "Pending": 0,
    "RequestChanges": 1,
    "Approved": 2,
    "Rejected": 3
};
const {
  BN, // Big Number support
  constants, // Common constants, like the zero address and largest integers
  expectEvent, // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require("@openzeppelin/test-helpers");

const ipfsHash = "0000";
const reviewTime = 100000;

contract("Journal", async accounts => {
    beforeEach(async function () {

        this.Editor = await Editor.new();
        this.newPaper = await Paper.new(ipfsHash, ["Physics"], "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1", reviewTime);
        await this.Editor.addPaper(ipfsHash, this.newPaper.address);
        await this.Editor.primaryPaperChecking(ipfsHash);
      }
    );
    it("addFeedback", async function() {
      await this.newPaper.addReviewer(accounts[0]);
      await this.newPaper.addFeedback("The paper is correct.");

      // valid case
      expect(this.newPaper.feedbacks[0]).to.be.equal("The paper is correct.");

      // invalid case
      await this.newPaper.removeReviewer(await Editor.owner());
      expectRevert(await this.newPaper.addFeedback("The paper is just rubbish."), "You are not part of the reviewer's list. \
          Therefore, you can't perform this operation.");

    });
    it("validateFeedback", async function() {
      await this.newPaper.addReviewer(await Editor.owner());
      await this.newPaper.addFeedback("The paper is correct.");
    
      // valid case
      await this.newPaper.validateFeedback(0);
      expect(this.newPaper.feedbacks[0].feedbackState).to.be.bignumber.equal(new BN (State["Approved"]));

      // invalid case

    });
    it("deleteFeedback", async function() {
      await this.newPaper.addReviewer(await Editor.owner());
      await this.newPaper.addFeedback("The paper is correct.");
    
      // valid case
      await this.newPaper.validateFeedback(0);
      expect(this.newPaper.feedbacks[0].feedbackState).to.be.bignumber.equal(new BN (State["Rejected"]));

      // invalid case  

    });
    it("addReviewState_validCase", async function() {
      await this.newPaper.addReviewer(await Editor.owner());
      // valid case

      expect(this.newPaper.paperState).to.be.bignumber.equal(new BN (State["Pending"]));
      await this.newPaper.addReviewState(new BN (State["Approved"]));
      const reviewStates = await this.newPaper.reviewStates;
      expect(reviewStates[await this.Editor.owner()]).to.be.bignumber.equal(new BN (State["Approved"]));
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
      expect(this.newPaper.author).to.be.equal(accounts[1]);
      await this.newPaper.addReviewer(await this.Editor.owner());
      await this.newPaper.claimAuthority(this.Editor.owner());
      expect(this.newPaper.author).to.be.equal(this.Editor.owner());

    });
});