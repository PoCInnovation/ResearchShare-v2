import React, { ChangeEvent } from 'react';

import "./ChangeRequest.css";
import TextField from '@material-ui/core/TextField';

export interface ChangeRequestElement {
    comment: string;
    page: string;
    line: string
}

export default function ChangeRequest({changeRequests, setChangeRequests, value, index}: {
    changeRequests: Array<ChangeRequestElement>,
    setChangeRequests: React.Dispatch<React.SetStateAction<ChangeRequestElement[]>>,
    value: ChangeRequestElement,
    index: number
}) {
    function handleChangeChangeRequestComment(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, index: number) {
        const newArr = [...changeRequests];
        newArr[index] = {...newArr[index], comment: event.target.value};
        setChangeRequests(newArr);
    }

    function handleChangeChangeRequestPage(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, index: number) {
        const newArr = [...changeRequests];
        newArr[index] = {...newArr[index], page: event.target.value};
        setChangeRequests(newArr);
    }

    function handleChangeChangeRequestLine(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, index: number) {
        const newArr = [...changeRequests];
        newArr[index] = {...newArr[index], line: event.target.value};
        setChangeRequests(newArr);
    }

    return (
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
            </div><br/><br/>
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
    );
}
