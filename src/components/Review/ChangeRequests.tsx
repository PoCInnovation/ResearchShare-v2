import React, { MouseEvent, ChangeEvent } from 'react';
import "./ChangeRequests.css";

import ClearIcon from '@material-ui/icons/Clear';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export interface ChangeRequestElement {
    comment: string;
    page: string;
    line: string
}

export default function ChangeRequests({ hash, reviewStatus }: { hash: string, reviewStatus: string }) {
    const [changeRequests, setChangeRequests] = React.useState<Array<ChangeRequestElement>>([]);

    function handleClickDeleteChangeRequest(_: MouseEvent<HTMLButtonElement>, index: number) {
        const newArr = [...changeRequests];
        newArr.splice(index, 1);
        setChangeRequests(newArr);
    }

    function handleClickAddChangeRequest() {
        const newArr = [...changeRequests, { comment: '', page: '', line: '' }];
        setChangeRequests(newArr);
    }

    function handleClickDone() {
        //submitReview(currentAccount, contract, hash, reviewStatus, changeRequests);
    }

    function handleChangeChangeRequestComment(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, index: number) {
        const newArr = [...changeRequests];
        newArr[index].comment = event.target.value;
        setChangeRequests(newArr);
    }

    function handleChangeChangeRequestPage(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, index: number) {
        const newArr = [...changeRequests];
        newArr[index].page = event.target.value;
        setChangeRequests(newArr);
    }

    function handleChangeChangeRequestLine(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, index: number) {
        const newArr = [...changeRequests];
        newArr[index].line = event.target.value;
        setChangeRequests(newArr);
    }

    return (
        <div>
            {changeRequests.length ? changeRequests.map((value, index) => {
                return (
                    <div key={index} className="change-request">
                        <Button className="none-change-request"
                            onClick={(e) => { handleClickDeleteChangeRequest(e, index) }}>
                            <ClearIcon />
                        </Button>
                        <br />
                        <div id='ChangeRequestComment'>
                            <div>
                                <TextField
                                    className="change-request-page"
                                    label="Page"
                                    variant="filled"
                                    value={value.page}
                                    onChange={(e) => handleChangeChangeRequestPage(e, index)}
                                />
                                <TextField
                                    className="change-request-line"
                                    label="Line"
                                    variant="filled"
                                    value={value.line}
                                    onChange={(e) => handleChangeChangeRequestLine(e, index)}
                                />
                            </div>
                            <div className="change-request-comment">
                                <TextField
                                    label="Comments"
                                    placeholder="Enter Change Request Comments "
                                    multiline
                                    fullWidth
                                    variant="filled"
                                    value={value.comment}
                                    onChange={(e) => handleChangeChangeRequestComment(e, index)}
                                />
                            </div>
                        </div>
                        <p><br /></p>
                    </div>
                )
            }) : <p>No change requests</p>}
            <div style={{ marginRight: '5%', marginLeft: '5%' }}>
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