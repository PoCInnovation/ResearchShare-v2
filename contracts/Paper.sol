pragma solidity ^0.8.5;

import "./OwnedPermissionManager.sol";

contract Paper is OwnedPermissionManager {

    enum State {Pending, Approved, Rejected};

    struct FeedBack {
        string feedback;
        address reviewer;
        State state;
    }

    address private author;
    bool private primaryChecked;
    bool private isPublished;
    string private ipfsHash;
    string[] private fields;
    State public paperState;
    State[] private reviewStates;
    FeedBack[] public feedbacks;
    uint private submitDate;
    uint private deadlineDate;

    event FeedbackDeleted(string indexed _rejectedFeedback);

    constructor(string memory _ipfsHash, string[] memory _fields, address _author, uint _maxReviewTime) {
        author = _author;
        primaryChecked = false;
        isPublished = false;
        ipfsHash = _ipfsHash;
        fields = _fields;
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

    modifier isPendingState() {
        
        require(paperState == State.Pending);
        require(primaryChecked == true);
        require(block.timestamp <= deadlineDate, "The deadline date has passed.");
        _;
    }

    modifier isFinishState() {
        require(paperState != State.Pending);
        _;
    }

    modifier onlyAuthor() {
        require (msg.sender == author);
        _;
    }

    function primaryChecking() public onlyOwner() {
        primaryChecked = true;
    }
    
    function addFeedback(string memory _feedback) public  isPendingState() {
        require(canReview(msg.sender));
    
        pendingFeedbacks.push(FeedBack(_feedback, msg.sender, State.Pending));
    }

    function validateFeedback(uint _indexValidFeedback) public  isPendingState() onlyOwner() {
        if (_indexValidFeedback >= 0 || _indexValidFeedback < feedbacks.length) {
            feedbacks[_indexValidFeedback].state = State.Approved;
        }
        revert("No such feedback !");
    }


    function deleteFeedback(uint _indexRejectedFeedback) public  isPendingState() onlyOwner() {
        if (_indexRejectedFeedback >= 0 || _indexRejectedFeedback < feedbacks.length) {
            emit FeedbackDeleted(feedbacks[_indexRejectedFeedback].feedback);
            delete feedbacks[_indexRejectedFeedback];
        }
        revert("No such feedback !");
    }

    function addReviewState(State _state) public isPendingState() {
        require(canReview(msg.sender));

        uint index;
        uint approved;
        uint rejected;
        (index, approved, rejected) = _getPaperData(msg.sender);

        reviewStates[index] = _state;
        if (_state == State.Approved)
            approved += 1;
        else if (_state == State.Rejected)
            rejected += 1;
    }

    function claimAuthority(address _realIdentity) public onlyAuthor() isFinishState() {
        author = _realIdentity;
    }

}