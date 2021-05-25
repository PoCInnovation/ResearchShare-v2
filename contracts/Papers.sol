pragma solidity ^0.8.4;

import "./Paper.sol";

contract Papers {
    mapping (string => address) public papers;
    event NewPaperState(string indexed _ipfsHash, Paper.State indexed _newState);

    function getPaperContract(string memory _ipfsHash) public view returns (address) {
        return papers[_ipfsHash];
    }

    function getPaper(string memory _ipfsHash) public view returns (string[] memory, Paper.State) { 
        Paper _paper = Paper(papers[_ipfsHash]);
        string[] memory _fields;
        Paper.State _paperState;
        (,_fields , _paperState,,,,,,) = _paper.getPaper();
        return (_fields, _paperState);
    }

    function getPaperState(string memory _ipfsHash) public view returns (Paper.State) {
        Paper _paper = Paper(papers[_ipfsHash]);
        Paper.State _paperState;
        (,, _paperState,,,,,,) = _paper.getPaper();
        return (_paperState);
    }

    function getFields(string memory _ipfsHash) public view returns (string[] memory) {
        Paper _paper = Paper(papers[_ipfsHash]);
        string[] memory _fields;
        (,_fields ,,,,,,,) = _paper.getPaper();
        return (_fields);
    }

    // only owner
    function addPaper(string memory _ipfsHash, address _paper) public {
        papers[_ipfsHash] = _paper;
    }

    // only reviewer
    function addReviewState(string memory _ipfsHash, Paper.State _state) public {
        Paper _paper = Paper(papers[_ipfsHash]);
        Paper.State _beforeState = getPaperState(_ipfsHash);
        _paper.addReviewState(_state);
        Paper.State _afterState = getPaperState(_ipfsHash);
        if (_beforeState != _afterState)
            emit NewPaperState(_ipfsHash, _afterState);
    }

    // only reviewer
    function addFeedBack(string memory _ipfsHash, string memory _feedback) public {
        Paper _paper = Paper(papers[_ipfsHash]);
        _paper.addFeedback(_feedback);
    }
}
