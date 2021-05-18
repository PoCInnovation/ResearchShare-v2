pragma solidity ^0.8.4;

contract Papers {
    enum PaperState {onReview, Approved, Rejected}

    struct FeedBack {
        string feedback;
        address reviewer;
        PaperState reviewState;
    }

    struct Paper {
        string[] fields;
        PaperState paperState;
        address owner;
        address[] reviewers;
        FeedBack[] feedbacks;
        uint submitDate;
        uint deadlineDate;
    }

    mapping (string => Paper) public papers;
    event NewPaperState(string indexed _ipfsHash, PaperState indexed _newState);


    function getPaperState(string memory _ipfsHash) public view returns (PaperState) {
        Paper memory _paper = papers[_ipfsHash];
        return _paper.paperState;
    }

    function getPaper(string memory _ipfsHash) public view returns (string[] memory, PaperState) {
        Paper memory _paper = papers[_ipfsHash];
        return (_paper.fields, _paper.paperState);
    }

    function getFields(string memory _ipfsHash) public view returns (string[] memory) {
        Paper memory _paper = papers[_ipfsHash];
        return _paper.fields;
    }

    // only reviewer
    function updatePaperState(string memory _ipfsHash, PaperState _newState) private {
        Paper storage _paper = papers[_ipfsHash];
        require (_paper.paperState == PaperState.onReview && block.timestamp <= _paper.deadlineDate);
        _paper.paperState = _newState;
        emit NewPaperState(_ipfsHash, _newState);
    }

    // only owner
    function addPaper(string memory _ipfsHash, string[] memory _fields, address[] memory _reviewers, uint _maxReviewTime) public {
        papers[_ipfsHash] = Paper(_fields, PaperState.onReview, msg.sender, _reviewers, new FeedBack[](0), block.timestamp, block.timestamp + _maxReviewTime);
    }

    // only reviewer
    function addFeedBack(string memory _ipfsHash, string memory _feedBack, PaperState _reviewState) public {
        Paper storage _paper = papers[_ipfsHash];
        PaperState reviewState = _reviewState;
        require(block.timestamp <= _paper.deadlineDate);
        address _reviewer = msg.sender;
        _paper.feedbacks.push(FeedBack(_feedBack, _reviewer, reviewState));

        FeedBack[] memory _feedbacks = _paper.feedbacks;
        address[] memory _reviewers = _paper.reviewers;
        uint16 approvements = 0;
        for (uint j = 0; j < _reviewers.length; j++) {
            bool haveApproved = false;
            for (uint i = _feedbacks.length - 1; i >= 0; i--)
                if (_feedbacks[i].reviewer == _reviewers[j]) {
                    if (_feedbacks[i].reviewState == PaperState.Approved)
                        haveApproved = true;
                    break;
                }
            if (haveApproved == true)
                approvements += 1;
        }
        if (approvements == _reviewers.length)
            updatePaperState(_ipfsHash, PaperState.Approved);
    }
}
