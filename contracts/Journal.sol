pragma solidity ^0.8.5;

import "./Paper.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Journal is Ownable {
    mapping (string => Paper) public allPapers;
    mapping (string => Paper) public publishedPapers;
    event NewPaperState(string indexed _ipfsHash, Paper.State indexed _newState);

    function getPaper(string memory _ipfsHash) public view returns (Paper) {
        return allPapers[_ipfsHash];
    }

    /*
        This function should be called by the author of the paper.
    */
    function addPaper(string memory _ipfsHash, address _paper) public {
        allPapers[_ipfsHash] = Paper(_paper);
        allPapers[_ipfsHash].transferOwnership(owner());
        allPapers[_ipfsHash].addPublisher(owner());
    }

    function primaryPaperChecking(bool _checks, string memory _ipfsHash) public onlyOwner() {
        if (_checks) {
            allPapers[_ipfsHash].primaryChecking();
        }
    }

    function publishPaper(string memory _ipfsHash) public onlyOwner() {
        publishedPapers[_ipfsHash] = allPapers[_ipfsHash];
    }
}