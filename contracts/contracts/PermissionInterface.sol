// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

interface PermissionInterface {
    function canPublish(address _address) external returns (bool);
    function canReview(address _address) external returns (bool);
}
