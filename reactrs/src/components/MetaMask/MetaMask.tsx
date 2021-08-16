import React from 'react';

import { ContractUser } from '../User/UserContract';
import { useMetaMask } from 'metamask-react';

export default function MetaMask() {
    const { account } = useMetaMask();

    return (
        <div className="metamask-register">
            <h2>Register</h2>
            { account ?? <ContractUser accountsAddresses={account}/> }
        </div>
    )
}