pragma solidity ^0.8.4;

contract Paper {
    enum State {onReview, Approved, Rejected}

    struct FeedBack {
        string feedback;
        address reviewer;
    }

    string public ipfsHash;
    string[] public fields;
    State public paperState;
    address private owner;
    address[] private reviewers;
    State[] private reviewStates;
    FeedBack[] private feedbacks;
    uint private submitDate;
    uint private deadlineDate;

    constructor(string memory _ipfsHash, string[] memory _fields, address _owner, address[] memory _reviewers, uint _maxReviewTime) {
        ipfsHash = _ipfsHash;
        fields = _fields;
        owner = _owner;
        reviewers = _reviewers;
        reviewStates = new State[](_reviewers.length);
        submitDate = block.timestamp;
        deadlineDate = block.timestamp + _maxReviewTime;
    }

    function _getPaperData(address _reviewer) view private returns (uint, uint, uint) {
        uint index = reviewers.length;
        uint approved;
        uint rejected;

        for (uint i = 0; i < reviewers.length; i++) {
            if (reviewStates[i] == State.Approved) {
                approved += 1;
            } else if (reviewStates[i] == State.Rejected) {
                rejected += 1;
            }
            if (reviewers[i] == _reviewer) {
                index = i;
            }
        }
        return (index, approved, rejected);
    }

    modifier canBeReview() {
        require(paperState == State.onReview, "This paper can't be reviewed anymore.");
        require(block.timestamp <= deadlineDate, "The deadline date has passed.");
        _;
    }
    
    function addFeedback(string memory _feedback) public canBeReview() {
        feedbacks.push(FeedBack(_feedback, msg.sender));
    }


    function addReviewState(State _state) public canBeReview() {
        uint index;
        uint approved;
        uint rejected;
        (index, approved, rejected) = _getPaperData(msg.sender);
        require(index != reviewers.length, "You are not allowed to review this paper.");
        reviewStates[index] = _state;
        if (_state == State.Approved)
            approved += 1;
        else if (_state == State.Rejected)
            rejected += 1;
        if (approved >= reviewers.length) {
            paperState = State.Approved;
        } else if (rejected >= reviewers.length / 2) {
            paperState = State.Rejected;
        }
    }
}