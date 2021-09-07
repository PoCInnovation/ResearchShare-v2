import { expectRevert } from '@openzeppelin/test-helpers';
import BN from 'bn.js';
import ChaiBN from 'chai-bn';
import chai from 'chai';

chai.use(ChaiBN(BN));

const ipfsHash = "QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4"; // cid
const fields = ["Reddit", "Screenshot"];
const reviewTime = 3600; // in seconds
const Paper = artifacts.require("Paper");

const State = {
  Pending: 0,
  RequestChanges: 1,
  Approved: 2,
  Rejected: 3,
};

const BigState = {
  Pending: new BN(0),
  RequestChanges: new BN(1),
  Approved: new BN(2),
  Rejected: new BN(3),
};

contract("Paper", async ([owner, reviewer]) => {
  it("addFeedback", async function () {
    const paper = await Paper.new(ipfsHash, fields, owner, reviewTime);
    await paper.addReviewer(reviewer);
    await paper.addFeedback("The paper is correct.", {from: reviewer});
  
    // valid case
    const feedbacks = await paper.feedbacks(0);
    expect(feedbacks[0]).to.be.equal("The paper is correct.");

    // invalid case
    await paper.removeReviewer(reviewer);
    await expectRevert(
      paper.addFeedback("The paper is just rubbish.", {from: reviewer}),
      "You are not part of the reviewer's list. \
          Therefore, you can't perform this operation."
    );
  });
  it("validateFeedback", async function () {
    const paper = await Paper.new(ipfsHash, fields, owner, reviewTime);
    await paper.addReviewer(reviewer);
    await paper.addFeedback("The paper is correct.", {from: reviewer});

    // valid case    
    await paper.validateFeedback(0);
    const feedbacks = await paper.feedbacks(0);
    expect(feedbacks[2]).to.be.bignumber.equal(BigState["Approved"]);
  });
  it("deleteFeedback", async function () {
    const paper = await Paper.new(ipfsHash, fields, owner, reviewTime);
    await paper.addReviewer(reviewer);
    await paper.addFeedback("The paper is correct.", {from: reviewer});

    // valid case
    await paper.rejectFeedback(0);
    const feedbacks = await paper.feedbacks(0);
    expect(feedbacks[2]).to.be.bignumber.equal(BigState["Rejected"]);

    // invalid case
  });
  it("addReviewState_validCase", async function () {
    const paper = await Paper.new(ipfsHash, fields, owner, reviewTime);
    // valid case

    let state = await paper.paperState();
    expect(state).to.be.bignumber.equal(BigState["Pending"]);
    await paper.addReviewState(BigState["Approved"], {from: reviewer});
    const reviewState = await paper.reviewStates(reviewer);
    expect(reviewState).to.be.bignumber.equal(BigState["Approved"]);
    state = await paper.paperState();
    expect(state).to.be.bignumber.equal(BigState["Approved"]);
  });
  it("addReviewState_invalidCase", async function () {
    const paper = await Paper.new(ipfsHash, fields, owner, reviewTime);
    await expectRevert(
      paper.addReviewState("The paper is just rubbish."),
      "You are not part of the reviewer's list. \
          Therefore, you can't perform this operation."
    );
  });
  it("claimAuthority", async function () {
    const paper = await Paper.new(ipfsHash, fields, owner, reviewTime);

    // invalid case
    await expectRevert(
      paper.claimAuthority(""),
      "This paper review is still ongoing."
    );

    // valid case
    let author = await paper.author();
    expect(author).to.be.equal(owner);
    await paper.addReviewer(reviewer);
    await paper.claimAuthority(reviewer);
    author = await paper.author();
    expect(author).to.be.equal(reviewer);
  });
});
