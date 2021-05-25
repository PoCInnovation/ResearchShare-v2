pragma solidity ^0.8.4;

import "./Paper.sol";

contract PaperManager {
    mapping (string => Paper) public papers;
    event NewPaperState(string indexed _ipfsHash, Paper.State indexed _newState);

    function getPaper(string memory _ipfsHash) public view returns (Paper) {
        return papers[_ipfsHash];
    }

    // only owner
    function addPaper(string memory _ipfsHash, address _paper) public {
        papers[_ipfsHash] = Paper(_paper);
    }

    // only reviewer
    function addReviewState(string memory _ipfsHash, Paper.State _state) public {
        Paper _paper = papers[_ipfsHash];
        Paper.State _beforeState = _paper.paperState();
        _paper.addReviewState(_state);
        Paper.State _afterState = _paper.paperState();
        if (_beforeState != _afterState)
            emit NewPaperState(_ipfsHash, _afterState);
    }

    // only reviewer
    function addFeedBack(string memory _ipfsHash, string memory _feedback) public {
        papers[_ipfsHash].addFeedback(_feedback);
    }
}
