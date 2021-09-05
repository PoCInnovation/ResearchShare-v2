// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.5;

import "./Paper.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Journal is Ownable {
    mapping (string => Paper) public allPapers;
    mapping (string => Paper) public publishedPapers;
    event NewPaper(Paper paper);

    function getPaper(string memory _ipfsHash) public view returns (Paper) {
        return allPapers[_ipfsHash];
    }

    /*
        This function should be called by the author of the paper.
    */
    function addPaper(string memory _ipfsHash, uint _maxReviewTime) public returns (Paper) {
        Paper paper = new Paper(_ipfsHash, new string[](0), msg.sender, _maxReviewTime);
        allPapers[_ipfsHash] = paper;
        paper.addPublisher(msg.sender);
        emit NewPaper(paper);
        return paper;
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
