pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./PermissionInterface.sol";

contract OwnedPermissionManager is PermissionInterface, Ownable {
    
    mapping(address => bool) publishers;
    mapping(address => bool) reviewers;

    address private author;

    modifier onlyAuthor() {
        require (msg.sender == author);
        _;
    }
    
    
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
    }
    
    function addPublisher(address _address) public onlyOwner {
        publishers[_address] = true;
    }
    
    function removeReviewer(address _address) public onlyOwner {
        reviewers[_address] = false;
    }
    
    function removePublisher(address _address) public onlyOwner {
        publishers[_address] = false;
    }
}
