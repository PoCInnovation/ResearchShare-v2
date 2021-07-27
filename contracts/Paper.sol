pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Paper is Ownable {
    enum State {onReview, Approved, Rejected}

    struct FeedBack {
        string feedback;
        address reviewer;
    }

    address private _owner;
    bool private primaryChecked;
    string public ipfsHash;
    string[] public fields;
    State public paperState;
    address private author;
    address[] private reviewers;
    State[] private reviewStates;
    FeedBack[] private feedbacks;
    FeedBack[] private pendingFeedbacks;
    uint private submitDate;
    uint private deadlineDate;

    constructor(string memory _ipfsHash, string[] memory _fields, address _author, address[] memory _reviewers, uint _maxReviewTime) {
        _owner = msg.sender;
        primaryChecked = false;
        ipfsHash = _ipfsHash;
        fields = _fields;
        author = _author;
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

    modifier primaryCheckedHasPassed() {
        require(primaryChecked == true);
        _;
    }

    function primaryChecking() public onlyOwner() {
        primaryChecked = true;
    }
    
    function addFeedback(string memory _feedback) public  primaryCheckedHasPassed() canBeReview() {
        pendingFeedbacks.push(FeedBack(_feedback, msg.sender));
    }

    function validateFeedback(string memory _validatedFeedback) public  primaryCheckedHasPassed() onlyOwner() {
        for (uint i = 0; i < pendingFeedbacks.length; i++) {
            if (keccak256(abi.encodePacked(pendingFeedbacks[i].feedback))
            == keccak256(abi.encodePacked(_validatedFeedback))) {
                feedbacks.push(FeedBack(pendingFeedbacks[i].feedback, pendingFeedbacks[i].reviewer));
                delete pendingFeedbacks[i];
            }
        }
        revert("No such feedback !");
    }


    function deleteFeedback(string memory _deletedFeedback) public  primaryCheckedHasPassed() onlyOwner() {
        for (uint i = 0; i < pendingFeedbacks.length; i++) {
            if (keccak256(abi.encodePacked(pendingFeedbacks[i].feedback))
             == keccak256(abi.encodePacked(_deletedFeedback))) {
                delete pendingFeedbacks[i];
            }
        }
        revert("No such feedback !");
    }

    function addReviewState(State _state) public  primaryCheckedHasPassed() canBeReview() {
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
    }

    function addFinalPaperState(State _state) public  primaryCheckedHasPassed() onlyOwner() {
        require (paperState == State.onReview, "The final paper state has already been decided.");
        uint index;
        uint approved;
        uint rejected;
        (index, approved, rejected) = _getPaperData(msg.sender);
        require(approved + rejected == reviewers.length, "Please wait until all reviewers have finished their review.");
        paperState = _state;
    }
}