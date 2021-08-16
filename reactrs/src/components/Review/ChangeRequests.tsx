import React from 'react';
import "ChangeRequests.css";

import ClearIcon from '@material-ui/icons/ClearIcon';
import Button from '@material-ui/core/Button';

export default function ChangeRequests({hash, reviewStatus}) {
    const [currentAccount, setCurrentAccount] = React.useState(null);
    const [changeRequests, setChangeRequests] = React.useState(null);
    const [contract, setContract] = React.useState(null);

    const classes = useStyles();

    React.useEffect(() => {
        loadContract(process.env.REACT_APP_CONTRACT_ADDRESS, setContract);
    }, []);
    React.useEffect(() => connectToMetamask(window, setCurrentAccount), []);

    const handleClickDeleteChangeRequest = (e, index) => {
        let newArr = [...changeRequests];

        newArr.splice(index, 1);
        setChangeRequests(newArr.length === 0 ? null : newArr);
    }
    const handleClickAddChangeRequest = (e) => {
        let newArr;
        if (changeRequests) {
            newArr = [...changeRequests];
            newArr.push({comment: '', page: '', line: ''});
        } else {
            newArr = [{comment: '', page: '', line: ''}];
        }
        setChangeRequests(newArr)
    }
    const handleClickDone = (e) => {
        submitReview(currentAccount, contract, hash, reviewStatus, changeRequests);
    }

    return (
        <div>
            { changeRequests ? changeRequests.map((value , index) => {
                return (
                    <div key={index} className={classes.change_request}>
                        <Button className={classes.deleteChangeRequest}
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
                <div className={classes.wrapper}>
                    <span className={classes.left}><p></p></span>
                    <Button
                        variant='outlined'
                        onClick={handleClickAddChangeRequest}
                    >
                        Add Change Request
                    </Button>
                    <Button
                        className={classes.right}
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