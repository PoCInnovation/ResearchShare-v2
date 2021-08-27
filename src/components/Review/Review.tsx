import React, { ChangeEvent } from 'react';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';

import "./Review.css";

import ChangeRequests from './ChangeRequests';

export default function Review() {
    const [reviewStatus, setReviewStatus] = React.useState('Refuse');
    const [cid, setCID] = React.useState('');
    const statusStrings = ["Accept", "Refuse", "Request Change"];

    function handleChangeSelectStatus(event: ChangeEvent<HTMLSelectElement>) {
        setReviewStatus(event.target.value);
    }

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        setCID(event.target.value);
    }

    return (
        <div className="review">
            <div className="review-margins">
                <div className="review-title">
                    <h2 className="review-title-elem">Review</h2>
                </div>
                <div className="review-title-status">
                    <div className="review-status">
                        <FormControl variant="filled">
                            <InputLabel style={{marginLeft: '-7.5%'}}>Status</InputLabel><br/>
                            <NativeSelect id="review_status" value={reviewStatus} onChange={handleChangeSelectStatus}>
                                { statusStrings.map((value, index) =>
                                    (<option value={value} key={index}>{value}</option>)
                                ) }
                            </NativeSelect>
                        </FormControl>
                    </div><br/>
                    <div className="review-cid">
                        <TextField id="standard-basic" label="Hash" value={cid} onChange={handleChange}/>
                    </div>
                </div>
                <br/><ChangeRequests hash={cid} reviewStatus={reviewStatus}/>
            </div>
        </div>
    );
}