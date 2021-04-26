pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract RSAuth is AccessControl{
    bytes32 public constant RESEARCH_CENTER_ROLE = keccak256("RESEARCH_CENTER_ROLE");
    bytes32 public constant RESEARCHER_ROLE = keccak256("RESEARCHER_ROLE");
    mapping (address => address) researcherToCenter;

    constructor() {
        _setupRole(RESEARCH_CENTER_ROLE, msg.sender);
        _setRoleAdmin(RESEARCH_CENTER_ROLE, RESEARCH_CENTER_ROLE);
        _setRoleAdmin(RESEARCHER_ROLE, RESEARCH_CENTER_ROLE);
    }
    
    function grantRole(bytes32 _role, address _account) public override virtual {
        if (_role == RESEARCHER_ROLE) {
            researcherToCenter[_account] = msg.sender;
        }
        super.grantRole(_role, _account);
    }
    
    function getResearchersCenter(address _account) public view returns(address) {
        return researcherToCenter[_account];
    }
    
    /* function revokeRole(bytes32 _role, address _account)  public override virtual { */
    /*     if (_role == RESEARCHER_ROLE) { */
    /*         require(msg.sender == researcherToCenter[_account], "Only the researcher's center can revoke their role"); */
    /*         researcherToCenter[_account] = address(0); */
    /*     } */
    /*     super.grantRole(_role, _account); */
    /* } */

    /* function renounceRole(bytes32 _role, address _account)  public override virtual { */
    /*     if (_role == RESEARCHER_ROLE) { */
    /*         researcherToCenter[_account] = address(0); */
    /*     } */
    /*     super.grantRole(_role, _account); */
    /* } */
}
