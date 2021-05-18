pragma solidity ^0.8.4;

import "./PermissionInterface.sol";

abstract contract PermissionManager is PermissionInterface {
    mapping(address => address) revealedIdentities;
    
    function canPublish(address _address) public virtual override returns (bool);
    function canReview(address _address) public virtual override returns (bool);
    
    function revealIdentity(address _identity) public override {
        require(canPublish(msg.sender));
        revealedIdentities[msg.sender] = _identity;
    }
    
    function getRevealedIdentity(address _address) public view override returns (address revealedIdentity) {
        return revealedIdentities[_address];
    }
}