import React from 'react';
import "./MetaMask.css";

import { useMetaMask } from 'metamask-react';
import { Button } from '@material-ui/core';
import { IMetaMaskContext } from 'metamask-react/lib/metamask-context';
import UserContract from '../User/UserContract';

const MetaMaskSteps = {
    "initializing": () => <div>Synchronisation with MetaMask ongoing...</div>,
    "unavailable": () => <div>MetaMask not available :(</div>,
    "notConnected": ({ connect }: IMetaMaskContext) => <Button onClick={connect}>Connect to MetaMask</Button>,
    "connecting": () => <div>Connecting...</div>,
    "connected": ({ account }: IMetaMaskContext) => <><div>Connected account: {account}</div><br /> <UserContract /></>
};

export default function MetaMask() {
    const MetaMaskInfo = useMetaMask();

    return (
        <div className="metamask-register">
            <h2>Register/Login</h2>
            { MetaMaskSteps[MetaMaskInfo.status](MetaMaskInfo) }
        </div>
    )
}