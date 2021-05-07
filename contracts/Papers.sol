pragma solidity ^0.8.4;

contract Papers {
    enum PaperState {onReview, Approved, Rejected}

    struct FeedBack {
        string feedBack;
        // address Reviewer;

    }

    struct Paper {
        FeedBack[] feedBacks;
        string[] fields;
        PaperState paperState;
        // address Owner;
    }

    mapping (string => Paper) public papers;
    event NewPaperState(string indexed _ipfsHash, PaperState indexed _newState);


    function getPaperState(string memory _ipfsHash) public view returns (PaperState) {
        Paper memory _paper = papers[_ipfsHash];
        return _paper.paperState;
    }

    function getFields(string memory _ipfsHash) public view returns (string[] memory) {
        Paper memory _paper = papers[_ipfsHash];
        return _paper.fields;
    }

    // only reviewer
    function updatePaperState(string memory _ipfsHash, PaperState _newState) public {
        Paper memory _paper = papers[_ipfsHash];
        require (_paper.paperState > PaperState.onReview);
        _paper.paperState = _newState;
        emit NewPaperState(_ipfsHash, _newState);
    }

    // only owner
    function addPaper(string memory _ipfsHash, string[] memory _fields) public {
        Paper storage _paper = papers[_ipfsHash];

        _paper.fields = _fields;
        _paper.paperState = PaperState.onReview;
    }

    // only reviewer
    function addFeedBack(string memory _ipfsHash, string memory _feedBack) public {
        Paper memory _paper = papers[_ipfsHash];

        uint i = _paper.feedBacks.length - 1;
        if (i == 0 && keccak256(abi.encodePacked(_paper.feedBacks[0].feedBack))
        == keccak256(abi.encodePacked(""))) {
        // We did this because when we initialize the version, the feedback string is empty.
            _paper.feedBacks[0].feedBack = _feedBack;
        } else {
            _paper.feedBacks[i].feedBack = _feedBack;
        }
    }
}
