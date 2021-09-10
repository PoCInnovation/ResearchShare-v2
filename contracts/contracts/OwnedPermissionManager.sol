// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./PermissionInterface.sol";

contract OwnedPermissionManager is PermissionInterface, Ownable {
    
    mapping(address => bool) publishers;
    mapping(address => bool) reviewers;
    uint nb_reviewers;
    uint nb_publishers;

    function canPublish(address _address) public view override returns (bool)
    {
        return publishers[_address];
    }
    
    function canReview(address _address) public view override returns (bool)
    {
        return reviewers[_address];
    }
    
    function addReviewer(address _address) public onlyOwner {
        reviewers[_address] = true;
        nb_reviewers ++;
    }
    
    function addPublisher(address _address) public onlyOwner {
        publishers[_address] = true;
        nb_publishers ++;
    }
    
    function removeReviewer(address _address) public onlyOwner {
        reviewers[_address] = false;
    }
    
    function removePublisher(address _address) public onlyOwner {
        publishers[_address] = false;
    }
}
