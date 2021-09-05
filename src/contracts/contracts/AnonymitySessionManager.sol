// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "./PermissionInterface.sol";

contract AnonymitySessionManager {
    
    struct AnonymitySession {
        address owner;
        bool finished;
    }
    mapping(uint => AnonymitySession) public anonymitySessions;
    mapping(address => uint) public memberToSession;
    mapping(address => address) public revealedIdentities;
    
    PermissionInterface permissionManager;
    
    constructor(PermissionInterface _permissionManager) {
        permissionManager = _permissionManager;
    }
    
    function revealIdentity(address _identity) public {
        uint _sessionId = memberToSession[msg.sender];
        require(_sessionId != 0 && anonymitySessions[_sessionId].finished);
        revealedIdentities[msg.sender] = _identity;
    }

    function startAnonymitySession(uint _sessionId, address[] memory _members) public {
        require(_sessionId != 0);
        AnonymitySession storage session = anonymitySessions[_sessionId];
        require(session.owner == address(0));
        for (uint i = 0; i < _members.length; i++) {
            address _member = _members[i];
            require(memberToSession[_member] == 0
                    && (permissionManager.canPublish(_member)
                        || permissionManager.canReview(_member)));
            memberToSession[_member] = _sessionId;
        }
        session.owner = msg.sender;
        session.finished = false;
    }
    
    function endAnonymitySession(uint _sessionId) public {
        require(_sessionId != 0);
        AnonymitySession storage session = anonymitySessions[_sessionId];
        require(session.owner == msg.sender);
        session.finished = true;
    }
}
