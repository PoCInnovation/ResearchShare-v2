const Journal = artifacts.require("Journal");
const Paper = artifacts.require("Paper")

const State = {
  Pending: 0,
  RequestChanges: 1,
  Approved: 2,
  Rejected: 3,
};

const ipfsHash = "0000";
const reviewTime = 100000;

const getPaper = async () =>
  Paper.at( await (await Journal.deployed()).getPaper(ipfsHash));

contract("Paper", async (accounts) => {
  before(async () => {
    const journal = await Journal.deployed();
    journal.addPaper(ipfsHash, reviewTime);
  });


  it("addFeedback", async function () {
    const paper = await getPaper();
    await paper.addReviewer(accounts[0]);
    await paper.addFeedback("The paper is correct.");

    // valid case
    expect(paper.feedbacks[0]).to.be.equal("The paper is correct.");

    // invalid case
    await paper.removeReviewer(await Journal.owner());
    expectRevert(
      await paper.addFeedback("The paper is just rubbish."),
      "You are not part of the reviewer's list. \
          Therefore, you can't perform this operation."
    );
  });
  it("validateFeedback", async function () {
    const paper = await getPaper();
    await paper.addReviewer(await Journal.owner());
    await paper.addFeedback("The paper is correct.");

    // valid case
    await paper.validateFeedback(0);
    expect(paper.feedbacks[0].feedbackState).to.be.bignumber.equal(
      new BN(State["Approved"])
    );

    // invalid case
  });
  it("deleteFeedback", async function () {
    const paper = await getPaper();
    await paper.addReviewer(await Journal.owner());
    await paper.addFeedback("The paper is correct.");

    // valid case
    await paper.validateFeedback(0);
    expect(paper.feedbacks[0].feedbackState).to.be.bignumber.equal(
      new BN(State["Rejected"])
    );

    // invalid case
  });
  it("addReviewState_validCase", async function () {
    const paper = await getPaper();
    // valid case

    expect(paper.paperState).to.be.bignumber.equal(new BN(State["Pending"]));
    await paper.addReviewState(new BN(State["Approved"]));
    const reviewStates = await paper.reviewStates;
    expect(reviewStates[await this.Journal.owner()]).to.be.bignumber.equal(
      new BN(State["Approved"])
    );
    expect(paper.paperState).to.be.bignumber.equal(new BN(State["Approved"]));
  });
  it("addReviewState_invalidCase", async function () {
    const paper = await getPaper();
    expectRevert(
      await paper.addReviewState("The paper is just rubbish."),
      "You are not part of the reviewer's list. \
          Therefore, you can't perform this operation."
    );
  });
  it("claimAuthority", async function () {
    const paper = await getPaper();

    // invalid case
    expectRevert(
      await paper.claimAuthority(),
      "This paper review is still ongoing."
    );

    // valid case
    expect(paper.author).to.be.equal(accounts[1]);
    await paper.addReviewer(await this.Journal.owner());
    await paper.claimAuthority(this.Journal.owner());
    expect(paper.author).to.be.equal(this.Journal.owner());
  });
});
