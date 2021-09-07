import { expectRevert } from '@openzeppelin/test-helpers';
import BN from 'bn.js';
import ChaiBN from 'chai-bn';
import chai from 'chai';

chai.use(ChaiBN(BN));

const Journal = artifacts.require("Journal");
const Paper = artifacts.require("Paper");

const State = {
  Pending: 0,
  RequestChanges: 1,
  Approved: 2,
  Rejected: 3,
};

contract("Paper", async (accounts) => {
  const [owner, reviewer] = accounts; 

  it("addFeedback", async function () {
    const paper = await Paper.deployed();
    await paper.addReviewer(reviewer);
    await paper.addFeedback("The paper is correct.", {from: reviewer});
  
    // valid case
    expect((await paper.feedbacks(0))[0]).to.be.equal("The paper is correct.");

    // invalid case
    await paper.removeReviewer(reviewer);
    await expectRevert(
      paper.addFeedback("The paper is just rubbish.", {from: reviewer}),
      "You are not part of the reviewer's list. \
          Therefore, you can't perform this operation."
    );
  });
  it("validateFeedback", async function () {
    const paper = await Paper.deployed();
    await paper.addReviewer(reviewer);
    await paper.addFeedback("The paper is correct.", {from: reviewer});

    // valid case
    await paper.validateFeedback(0);
    expect((await paper.feedbacks(0))[2]).to.be.bignumber.equal(
      new BN(State["Approved"])
    );

    // invalid case
  });
  it("deleteFeedback", async function () {
    const paper = await Paper.deployed();
    await paper.addReviewer(reviewer);
    await paper.addFeedback("The paper is correct.", {from: reviewer});

    // valid case
    await paper.rejectFeedback(0);
    expect((await paper.feedbacks(0))[2]).to.be.bignumber.equal(
      new BN(State["Rejected"])
    );

    // invalid case
  });
  it("addReviewState_validCase", async function () {
    const paper = await Paper.deployed();
    // valid case

    expect(await paper.paperState()).to.be.bignumber.equal(new BN(State["Pending"]));
    await paper.addReviewState(new BN(State["Approved"]), {from: reviewer});
    const reviewState = await paper.reviewStates(reviewer);
    expect(reviewState).to.be.bignumber.equal(
      new BN(State["Approved"])
    );
    expect(await paper.paperState()).to.be.bignumber.equal(new BN(State["Approved"]));
  });
  it("addReviewState_invalidCase", async function () {
    const paper = await Paper.deployed();
    await expectRevert(
      paper.addReviewState("The paper is just rubbish."),
      "You are not part of the reviewer's list. \
          Therefore, you can't perform this operation."
    );
  });
  it("claimAuthority", async function () {
    const paper = await Paper.deployed();

    // invalid case
    await expectRevert(
      paper.claimAuthority(""),
      "This paper review is still ongoing."
    );

    // valid case
    expect(await paper.author()).to.be.equal(owner);
    await paper.addReviewer(reviewer);
    await paper.claimAuthority(reviewer);
    expect(await paper.author()).to.be.equal(reviewer);
  });
});
