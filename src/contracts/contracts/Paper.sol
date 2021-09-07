// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.5;

import "./OwnedPermissionManager.sol";

contract Paper is OwnedPermissionManager {

    enum State {Pending, RequestChanges, Approved, Rejected}

    struct Feedback {
        string feedback;
        address reviewer;
        State feedbackState;
    }

    address public author;
    bool private primaryChecked;
    string private ipfsHash;
    string[] private fields;
    State public paperState;
    mapping (address => State) public reviewStates;
    Feedback[] public feedbacks;
    uint private totalApproved;
    uint private totalRejected;
    uint private submitDate;
    uint private deadlineDate;

    event FeedbackRejected(string indexed _rejectedFeedback);

    constructor(string memory _ipfsHash, string[] memory _fields, address _author, uint _maxReviewTime) {
        author = _author;
        primaryChecked = false;
        ipfsHash = _ipfsHash;
        fields = _fields;
        submitDate = block.timestamp;
        paperState = State.Pending;
        deadlineDate = block.timestamp + _maxReviewTime;
    }

    modifier isPendingState() {
        
        require(paperState == State.Pending || paperState == State.RequestChanges);
        require(primaryChecked == true);
        require(block.timestamp <= deadlineDate, "The deadline date has passed.");
        _;
    }

    modifier isFinishState() {
        require(paperState != State.Pending && paperState != State.RequestChanges, "This paper review is still ongoing.");
        _;
    }

    modifier onlyReviewer() {
        require(canReview((msg.sender)) == true, "You are not part of the reviewer's list. Therefore, you can't perform this operation.");
        _;
    }

    modifier onlyAuthor() {
        require (msg.sender == author);
        _;
    }

    function primaryChecking() public onlyOwner() {
        primaryChecked = true;
    }
    
    function addFeedback(string memory _feedback) public onlyReviewer() isPendingState() {
        require(canReview(msg.sender) == true);
    
        feedbacks.push(Feedback(_feedback, msg.sender, State.Pending));
    }

    function validateFeedback(uint _indexValidFeedback) public onlyOwner() isPendingState() {
        if (_indexValidFeedback > 0 || _indexValidFeedback < feedbacks.length) {
            feedbacks[_indexValidFeedback].feedbackState = State.Approved;
        }
        revert("No such feedback !");
    }

    function rejectFeedback(uint _indexRejectedFeedback) public onlyOwner() isPendingState() {
        if (_indexRejectedFeedback >= 0 || _indexRejectedFeedback < feedbacks.length) {
            emit FeedbackRejected(feedbacks[_indexRejectedFeedback].feedback);
            feedbacks[_indexRejectedFeedback].feedbackState = State.Rejected;
        }
        revert("No such feedback !");
    }

    function updatePaperState(State _state) private {
        if (_state == State.RequestChanges)
            paperState = _state;
        if (totalApproved + totalRejected == nb_reviewers)
            paperState = (totalRejected == 0) ? State.Approved : State.Rejected;
    }

    function addReviewState(State _state) public onlyReviewer() isPendingState() {

        if (reviewStates[msg.sender] != _state) {
            if (reviewStates[msg.sender] == State.Approved)
                totalApproved --;
            else if (reviewStates[msg.sender] == State.Rejected)
                totalRejected --;
        }

        reviewStates[msg.sender] = _state;

        if (_state == State.Approved)
            totalApproved ++;
        else if (_state == State.Rejected)
            totalRejected ++;
        updatePaperState(_state);
    }

    function claimAuthority(address _realIdentity) public onlyAuthor() isFinishState() {
        author = _realIdentity;
    }

}
