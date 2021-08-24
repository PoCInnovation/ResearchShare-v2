import React, { MouseEvent } from 'react';
import "./ChangeRequests.css";
import ChangeRequest, { ChangeRequestElement } from "./ChangeRequest";

import ClearIcon from '@material-ui/icons/Clear';
import Button from '@material-ui/core/Button';

export default function ChangeRequests({hash, reviewStatus}: {hash: string, reviewStatus: string}) {
    const [changeRequests, setChangeRequests] = React.useState<Array<ChangeRequestElement>>([]);

    function handleClickDeleteChangeRequest(_: MouseEvent<HTMLButtonElement>, index: number) {
        const newArr = [...changeRequests];
        newArr.splice(index, 1);
        setChangeRequests(newArr);
    }

    function handleClickAddChangeRequest() {
        const newArr = [...changeRequests, {comment: '', page: '', line: ''}];
        setChangeRequests(newArr);
    }

    function handleClickDone() {
        //submitReview(currentAccount, contract, hash, reviewStatus, changeRequests);
    }

    return (
        <div>
            { changeRequests.length ? changeRequests.map((value , index) => {
                return (
                    <div key={index} className="change-request">
                        <Button className="none-change-request"
                            onClick={(e) => {handleClickDeleteChangeRequest(e, index)}}>
                            <ClearIcon/>
                        </Button>
                        <br/>
                        <ChangeRequest
                            changeRequests={changeRequests}
                            setChangeRequests={setChangeRequests}
                            value={value}
                            index={index}
                        />
                        <p><br/></p>
                    </div>
                )
            }) : <p>No change requests</p> }
            <div style={{marginRight: '5%', marginLeft: '5%'}}>
                <div className="change-request-wrapper">
                    <span className="change-request-left"><p></p></span>
                    <Button
                        variant='outlined'
                        onClick={handleClickAddChangeRequest}
                    >
                        Add Change Request
                    </Button>
                    <Button
                        className="change-request-right"
                        onClick={handleClickDone}
                        variant='contained'
                        color='primary'
                    >
                        Done
                    </Button>
                </div>
            </div>
        </div>
    );
}