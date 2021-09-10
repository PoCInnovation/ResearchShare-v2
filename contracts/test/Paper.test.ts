import { expectRevert } from '@openzeppelin/test-helpers';
import chai from 'chai';
import BN from 'bn.js';
import ChaiBN from 'chai-bn';
import { PaperInstance } from '../types/truffle-contracts';

const expectBN = chai.use(ChaiBN(BN)).expect;

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

contract("Paper", async ([owner, reviewer, random]) => {  
  beforeEach(async function () {
    this.paper = await Paper.new(ipfsHash, fields, owner, reviewTime, {from: owner});
    const paper = this.paper as PaperInstance;
    await paper.primaryChecking({from:owner});
  })

  it("addFeedback", async function () {
    const paper = this.paper as PaperInstance;
    await paper.addReviewer(reviewer, {from:owner});
    await paper.addFeedback("The paper is correct.", {from: reviewer});
  
    // valid case
    const feedbacks = await paper.feedbacks(0, {from:owner});
    expect(feedbacks[0]).to.be.equal("The paper is correct.");

    // invalid case
    await paper.removeReviewer(reviewer, {from:owner});
    await expectRevert(
      paper.addFeedback("The paper is just rubbish.", {from: reviewer}),
      "You are not part of the reviewer's list. Therefore, you can't perform this operation."
    );
  });
  it("validateFeedback", async function () {
    const paper = this.paper as PaperInstance;
    await paper.addReviewer(reviewer, {from:owner});
    await paper.addFeedback("The paper is correct.", {from: reviewer});

    // valid case    
    await paper.validateFeedback(0, {from:owner});
    const feedbacks = await paper.feedbacks(0, {from:owner});
    expectBN(feedbacks[2]).to.be.a.bignumber.that.equals(BigState["Approved"]);
  });
  it("deleteFeedback", async function () {
    const paper = this.paper as PaperInstance;
    await paper.addReviewer(reviewer, {from:owner});
    await paper.addFeedback("The paper is correct.", {from: reviewer});

    // valid case
    await paper.rejectFeedback(0, {from:owner});
    const feedbacks = await paper.feedbacks(0, {from:owner});
    expectBN(feedbacks[2]).to.be.a.bignumber.that.equals(BigState["Rejected"]);

    // invalid case
  });
  it("addReviewState_validCase", async function () {
    const paper = this.paper as PaperInstance;
    await paper.addReviewer(reviewer, {from:owner});
    // valid case

    let state = await paper.paperState({from:owner});
    expectBN(state).to.be.a.bignumber.that.equals(BigState["Pending"]);
    await paper.addReviewState(BigState["Approved"], {from: reviewer});
    const reviewState = await paper.reviewStates(reviewer, {from:owner});
    expectBN(reviewState).to.be.a.bignumber.that.equals(BigState["Approved"]);
    state = await paper.paperState({from:owner});
    expectBN(state).to.be.a.bignumber.that.equals(BigState["Approved"]);
  });
  it("addReviewState_invalidCase", async function () {
    const paper = this.paper as PaperInstance;
    await expectRevert(
      paper.addReviewState(BigState["Approved"], {from:owner}),
      "You are not part of the reviewer's list. Therefore, you can't perform this operation."
    );
  });
  it("claimAuthority", async function () {
    const paper = this.paper as PaperInstance;
    // invalid case
    await expectRevert(
      paper.claimAuthority(random, {from:owner}),
      "This paper review is still ongoing."
    );
    
    // valid case
    let author = await paper.author({from:owner});
    expect(author).to.be.equal(owner);
    await paper.addReviewer(reviewer, {from:owner});
      
    await paper.addReviewState(BigState["Approved"], {from:reviewer});
    await paper.claimAuthority(reviewer, {from:owner});
    author = await paper.author({from:owner});
    expect(author).to.be.equal(reviewer);
  });
});