import { useState } from 'react';
import { css } from "@emotion/react";
import PulseLoader from 'react-spinners/PulseLoader';

import { UserInteract } from './UserInteract';
import './UserContract.css';

const pulseLoading = css`
    display: block;
`;

const pulseNotLoading = css`
    display: none;
`;

export default function UserContract() {
    const [spinner, setSpinner] = useState(false);

    return (
        <div id="ConcatContract">
            <div className="user-margins">
                <div className="user-loader">
                    <PulseLoader
                        css={spinner ? pulseLoading : pulseNotLoading}
                        size={10}
                        color={"#123abc"}
                    />
                </div>

                { /*contract*/null ?
                    <UserInteract
                        contract={/*contract*/null}
                        setSpinner={setSpinner}
                    />
                : null }
            </div>
        </div>
    );
}